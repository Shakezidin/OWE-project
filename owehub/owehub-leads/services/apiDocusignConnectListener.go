/**************************************************************************
* File			: apiDocusignConnectListener.go
* DESCRIPTION	: This file contains functions for listening docusign events
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	leadService "OWEApp/owehub-leads/common"
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/owehub-leads/docusignclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	emailClient "OWEApp/shared/email"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleDocusignConnectListenerRequest
 * DESCRIPTION:     handler for listening docusign events
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDocusignConnectListenerRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		reqBody []byte
		query   string
		data    []map[string]interface{}
		dataReq models.DocusignConnectListenerRequest
	)
	log.EnterFn(0, "HandleDocusignConnectListenerRequest")
	defer func() { log.ExitFn(0, "HandleDocusignConnectListenerRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in connect docusign listener request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from connect docusign listener request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to connect docusign listener request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Docusign Connect Listener", http.StatusOK, nil)

	accountId, ok := dataReq.Data["accountId"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get accountId from connect docusign listener request")
		return
	}

	userId, ok := dataReq.Data["userId"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get userId from connect docusign listener request")
		return
	}

	// make sure accountId and userId are valid as per the config
	if accountId != leadsService.LeadAppCfg.DocusignAccountId ||
		userId != leadsService.LeadAppCfg.DocusignUserId {
		log.FuncErrorTrace(0, "Failed to validate accountId and userId from connect docusign listener request")
		return
	}

	if dataReq.Event == "envelope-completed" {
		envelopeId, ok := dataReq.Data["envelopeId"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get envelopeId from connect docusign listener request")
			return
		}

		query = "SELECT leads_id, first_name, last_name FROM leads_info WHERE docusign_envelope_id = $1"
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{envelopeId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to retrieve leads info from DB err: %v", err)
			return
		}
		if len(data) <= 0 {
			err = fmt.Errorf("leads info not found")
			log.FuncErrorTrace(0, "%v", err)
			return
		}
		leadsId, ok := data[0]["leads_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get leads id from leads info Item: %+v\n", data[0])
			return
		}

		firstName, ok := data[0]["first_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get first_name from leads info Item: %+v\n", data[0])
			return
		}

		lastName, ok := data[0]["last_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get last_name from leads info Item: %+v\n", data[0])
			return
		}

		log.FuncDebugTrace(0, "Docusign Envelope completed event received")

		// download docusign document
		getDocumentApi := docusignclient.GetDocumentApi{
			EnvelopeId: envelopeId,
		}

		document, err := getDocumentApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get docusign document err %v", err)
			return
		}

		// upload to s3
		filePath := fmt.Sprintf("/leads/signed_proposals/%s", getLeadPdfFilename(firstName, lastName))
		err = leadsService.S3PutObject(filePath, bytes.NewReader(*document))

		if err != nil {
			log.FuncErrorTrace(0, "Failed to upload pdf to s3 err %v", err)
			return
		}

		// update leads info
		query = `
			UPDATE leads_info SET
				proposal_pdf_key = $1,
				docusign_envelope_completed_at = CURRENT_TIMESTAMP,
				lead_won_date = CASE WHEN lead_won_date IS NULL THEN CURRENT_TIMESTAMP ELSE lead_won_date END,
				updated_at = CURRENT_TIMESTAMP
			WHERE leads_id = $2
		`
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{filePath, leadsId})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to update proposal_pdf_key err %v", err)
			return
		}

		// send email to salerep
		err = sendProposalSignedNotification(leadsId)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send lead won email err %v", err)
			return
		}
	}

	if dataReq.Event == "envelope-declined" {
		envelopeId, ok := dataReq.Data["envelopeId"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get envelopeId from connect docusign listener request")
			return
		}

		log.FuncDebugTrace(0, "Docusign Envelope declined event received")
		// update docusign_envelope_declined_at
		query = `UPDATE leads_info SET 
					docusign_envelope_declined_at = CURRENT_TIMESTAMP,
					docusign_envelope_id = NULL,
					UPDATED_AT = CURRENT_TIMESTAMP 
				WHERE docusign_envelope_id = $1`
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{envelopeId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update docusign_envelope_declined_at err %v", err)
			return
		}
	}

	if dataReq.Event == "envelope-voided" {
		envelopeId, ok := dataReq.Data["envelopeId"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get envelopeId from connect docusign listener request")
			return
		}

		log.FuncDebugTrace(0, "Docusign Envelope voided event received")
		// update docusign_envelope_voided_at
		query = `UPDATE leads_info SET 
					docusign_envelope_voided_at = CURRENT_TIMESTAMP,
					docusign_envelope_id = NULL,
					UPDATED_AT = CURRENT_TIMESTAMP 
				WHERE docusign_envelope_id = $1`
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{envelopeId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update docusign_envelope_voided_at err %v", err)
			return
		}
	}

}

/******************************************************************************
 * FUNCTION:		sendProposalSignedNotification
 * DESCRIPTION:     function to send the lead won email and sms
 * INPUT:			leadsId
 * RETURNS:    		error
 ******************************************************************************/
func sendProposalSignedNotification(leadsId int64) error {
	var (
		err   error
		query string
		data  []map[string]interface{}
	)

	log.EnterFn(0, "sendLeadWonEmail")
	defer func() { log.ExitFn(0, "sendLeadWonEmail", nil) }()

	query = `
		SELECT
			ud.email_id as user_email_id,
			ud.name as user_name,
			ud.mobile_number as user_phone,
			li.first_name,
			li.last_name,
			li.email_id,
			li.phone_number,
			li.proposal_pdf_key
		FROM user_details ud
		JOIN leads_info li ON ud.user_id = li.salerep_id
		WHERE li.leads_id = $1
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{leadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve email_id from database err: %v", err)
		return err
	}
	if len(data) <= 0 {
		err = fmt.Errorf("email_id not found in database")
		log.FuncErrorTrace(0, "%v", err)
		return err
	}

	userEmail, ok := data[0]["user_email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get email_id from leads info Item: %+v\n", data[0])
		return nil
	}

	userName, ok := data[0]["user_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get name from leads info Item: %+v\n", data[0])
		return nil
	}

	firstName, ok := data[0]["first_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get first_name from leads info Item: %+v\n", data[0])
		return nil
	}

	lastName, ok := data[0]["last_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get last_name from leads info Item: %+v\n", data[0])
		return nil
	}

	email, ok := data[0]["email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get email_id from leads info Item: %+v\n", data[0])
		return nil
	}

	phoneNo, ok := data[0]["phone_number"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get phone_number from leads info Item: %+v\n", data[0])
		return nil
	}

	// proposalPdfKey, ok := data[0]["proposal_pdf_key"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get proposal_pdf_key from leads info Item: %+v\n", data[0])
	// 	return nil
	// }

	userPhone, ok := data[0]["user_phone"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get user_phone from leads info Item: %+v\n", data[0])
		return nil
	}

	//proposalPdfUrl := leadsService.S3GetObjectUrl(proposalPdfKey)

	err = emailClient.SendEmail(emailClient.SendEmailRequest{
		ToName:  userName,
		ToEmail: userEmail,
		Subject: "Lead Won!",
		TemplateData: emailClient.TemplateDataLeadQCSigned{
			LeadFirstName:   firstName,
			LeadLastName:    lastName,
			LeadId:          leadsId,
			LeadEmailId:     email,
			LeadPhoneNumber: phoneNo,
			UserName:        userName,
			ViewUrl:         fmt.Sprintf("%s/leadmng-dashboard?view=%d", leadService.LeadAppCfg.FrontendBaseUrl, leadsId),
		},
	})

	if err != nil {
		return err
	}

	// send sms
	smsBody := leadsService.SmsLeadWon.WithData(leadsService.SmsDataLeadWon{
		LeadId:        leadsId,
		LeadFirstName: firstName,
		LeadLastName:  lastName,
		UserName:      userName,
	})

	err = sendSms(userPhone, smsBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
	}

	smsbody := leadsService.SmsHomeOwner.WithData(leadsService.SmsDataHomeOwner{
		LeadFirstName: firstName,
		LeadLastName:  lastName,
		Message:       "Thank You for showing interest in Our World Energy",
	})
	err = sendSms(phoneNo, smsbody)
	if err != nil {
		log.FuncErrorTrace(0, "Error while sending sms: %v", err)
	}

	return nil
}
