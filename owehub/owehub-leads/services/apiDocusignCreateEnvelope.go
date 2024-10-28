/**************************************************************************
* File			: apiDocusignCreateEnvelope.go
* DESCRIPTION	: This file contains functions for creating docusign envelope
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	"OWEApp/owehub-leads/docusignclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleDocusignCreateEnvelopeRequest
 * DESCRIPTION:     handler for creating docusign envelope
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDocusignCreateEnvelopeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		reqBody            []byte
		query              string
		data               []map[string]interface{}
		dataReq            models.DocusignCreateEnvelopeRequest
		createEnvelopeResp interface{}
	)
	log.EnterFn(0, "HandleDocusignCreateEnvelopeRequest")
	defer func() { log.ExitFn(0, "HandleDocusignCreateEnvelopeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create docusign envelope request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create docusign envelope request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to create docusign envelope request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmailId := req.Context().Value("emailid").(string)

	query = `
		SELECT
			li.email_id,
			li.first_name,
			li.last_name
		FROM get_leads_info_hierarchy($1) li
		WHERE li.leads_id = $2
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmailId, dataReq.LeadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve leads info from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}
	if len(data) <= 0 {
		err = fmt.Errorf("leads info not found")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Lead not found", http.StatusBadRequest, nil)
		return
	}

	leadsEmail, ok := data[0]["email_id"].(string)
	if !ok {
		err = fmt.Errorf("email_id not found in retrieve web proposal response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve email_id from retrieve web proposal response", http.StatusInternalServerError, nil)
		return
	}

	leadsFirstName, ok := data[0]["first_name"].(string)
	if !ok {
		err = fmt.Errorf("first_name not found in retrieve web proposal response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve first_name from retrieve web proposal response", http.StatusInternalServerError, nil)
		return
	}

	leadsLastName, ok := data[0]["last_name"].(string)
	if !ok {
		err = fmt.Errorf("last_name not found in retrieve web proposal response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve last_name from retrieve web proposal response", http.StatusInternalServerError, nil)
		return
	}

	// create docusign envelope
	createEnvelopeApi := docusignclient.CreateEnvelopeApi{
		EmailSubject: dataReq.EmailSubject,
		Documents: []docusignclient.CreateEnvelopeApiDocument{
			{
				DocumentBase64: dataReq.DocumentBase64,
				DocumentId:     dataReq.DocumentId,
				Name:           dataReq.DocumentName,
				FileExtension:  dataReq.DocumentFileExtension,
			},
		},
		Recipients: []docusignclient.CreateEnvelopeApiRecipient{
			{
				Email:     leadsEmail,
				FirstName: leadsFirstName,
				LastName:  leadsLastName,
			},
		},
		Status: dataReq.Status,
	}

	createEnvelopeResp, err = createEnvelopeApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create docusign envelope err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Docusign envelope created successfully", http.StatusOK, createEnvelopeResp)
}
