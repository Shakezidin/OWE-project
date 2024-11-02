/**************************************************************************
* File			: apiDocusignConnectListener.go
* DESCRIPTION	: This file contains functions for listening docusign events
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/owehub-leads/docusignclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
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
				docusign_proposal_pdf_key = $1,
				docusign_envelope_completed_at = CURRENT_TIMESTAMP,
				updated_at = CURRENT_TIMESTAMP
			WHERE leads_id = $2
		`
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{filePath, leadsId})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to update docusign_proposal_pdf_key err %v", err)
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
		query = "UPDATE leads_info SET docusign_envelope_declined_at = CURRENT_TIMESTAMP, UPDATED_AT = CURRENT_TIMESTAMP WHERE docusign_envelope_id = $1"
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{envelopeId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update docusign_envelope_declined_at err %v", err)
			return
		}
	}

}
