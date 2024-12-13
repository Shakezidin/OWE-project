/**************************************************************************
 *	File            : apiAuroraCreateProposal.go
 * 	DESCRIPTION     : This file contains api calls to create a project in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package services

import (
	"OWEApp/owehub-leads/auroraclient"
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	emailClient "OWEApp/shared/email"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

/******************************************************************************
 * FUNCTION:        HandleAuroraCreateProposalRequest
 *
 * DESCRIPTION:     This function will handle the request to create a proposal
 *                  in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraCreateProposalRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		reqBody            []byte
		query              string
		data               []map[string]interface{}
		dataReq            models.AuroraCreateProposalRequest
		createProposalResp *auroraclient.CreateProposalApiResponse
	)
	log.EnterFn(0, "HandleAuroraCreateProjectRequest")
	defer func() { log.ExitFn(0, "HandleAuroraCreateProjectRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in CreateProjectRequest")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from CreateProjectRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to CreateProjectRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// retreive design_id from leads_info table
	query = `
		SELECT 
			li.aurora_design_id,
			li.leads_id,
			li.email_id,
			li.first_name,
			li.last_name,
			li.phone_number,
			li.frontend_base_url,
			ud.name as creator_name,
			ud.email_id as creator_email_id,
			ud.mobile_number as creator_phone_number
		FROM get_leads_info_hierarchy($1) li
		INNER JOIN user_details ud ON ud.user_id = li.salerep_id
		WHERE li.leads_id = $2
	`

	authenticatedEmailId := req.Context().Value("emailid").(string)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmailId, dataReq.LeadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve design id from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve design id from DB", http.StatusInternalServerError, nil)
		return
	}
	if len(data) <= 0 {
		err = fmt.Errorf("leads info not found")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Lead not found", http.StatusBadRequest, nil)
		return
	}

	designId, ok := data[0]["aurora_design_id"].(string)
	if !ok {
		err = fmt.Errorf("aurora_design_id not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve aurora_design_id from DB", http.StatusInternalServerError, nil)
		return
	}

	createProposalApi := auroraclient.CreateProposalApi{
		DesignId: designId,
	}
	createProposalResp, err = createProposalApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora proposal err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	proposalId, ok := createProposalResp.Proposal["id"].(string)
	if !ok {
		err = fmt.Errorf("proposal_id not found in create design response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve proposal id from create proposal response", http.StatusInternalServerError, nil)
		return
	}

	proposalLink, ok := createProposalResp.Proposal["proposal_link"].(string)
	if !ok {
		err = fmt.Errorf("proposal_link not found in create design response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve proposal link from create proposal response", http.StatusInternalServerError, nil)
		return
	}

	// update the lead info record

	updateEleList := []interface{}{dataReq.LeadsId, authenticatedEmailId, proposalLink, proposalId}
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateLeadAddProposalFunction, updateEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update leads info in DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update record in DB", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Proposal created successfully", http.StatusOK, createProposalResp.Proposal)

	// send sms and email notifications
	leadFirstName, ok := data[0]["first_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert first_name to string type Item: %+v", data[0])
		return
	}
	leadLastName, ok := data[0]["last_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert last_name to string type Item: %+v", data[0])
		return
	}
	leadEmail, ok := data[0]["email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert email_id to string type Item: %+v", data[0])
		return
	}
	leadPhone, ok := data[0]["phone_number"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert phone_number to string type Item: %+v", data[0])
		return
	}
	creatorName, ok := data[0]["creator_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_name to string type Item: %+v", data[0])
		return
	}
	creatorEmail, ok := data[0]["creator_email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_email_id to string type Item: %+v", data[0])
		return
	}
	creatorPhone, ok := data[0]["creator_phone_number"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_phone_number to string type Item: %+v", data[0])
		return
	}
	frontendBaseUrl, ok := data[0]["frontend_base_url"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert frontend_base_url to string type Item: %+v", data[0])
		return
	}

	smsBody := leadsService.SmsLeadProposalCreated.WithData(leadsService.SmsDataLeadProposalCreated{
		LeadId:        int64(dataReq.LeadsId),
		LeadFirstName: leadFirstName,
		LeadLastName:  leadLastName,
		UserName:      creatorName,
	})

	emailTmplData := emailClient.TemplateDataLeadStatusChanged{
		LeadId:          int64(dataReq.LeadsId),
		LeadFirstName:   leadFirstName,
		LeadLastName:    leadLastName,
		LeadEmailId:     leadEmail,
		LeadPhoneNumber: leadPhone,
		UserName:        creatorName,
		ViewUrl:         fmt.Sprintf("%s/leadmng-dashboard?view=%d", frontendBaseUrl, dataReq.LeadsId),
		NewStatus:       "PROPOSAL_CREATED",
	}

	err = sendSms(creatorPhone, smsBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
	}

	err = emailClient.SendEmail(emailClient.SendEmailRequest{
		ToName:       creatorName,
		ToEmail:      creatorEmail,
		Subject:      "Lead Proposal Created",
		TemplateData: emailTmplData,
	})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
	}

	smsbody := leadsService.SmsHomeOwner.WithData(leadsService.SmsDataHomeOwner{
		LeadFirstName: leadFirstName,
		LeadLastName:  leadLastName,
		Message:       "Your proposal has been creaded.",
	})
	err = sendSms(leadPhone, smsbody)
	if err != nil {
		log.FuncErrorTrace(0, "Error while sending sms: %v", err)
	}
}
