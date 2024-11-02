/**************************************************************************
* File			: apiDocusignCreateEnvelope.go
* DESCRIPTION	: This file contains functions for creating docusign envelope
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
	"encoding/base64"
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
		createEnvelopeResp *map[string]interface{}
		pdfResp            *http.Response
		pdfBytes           []byte
		pdfBase64          string
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
			li.last_name,
			li.proposal_pdf_key
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

	proposalPdfKey, ok := data[0]["proposal_pdf_key"].(string)
	if !ok {
		err = fmt.Errorf("proposal_pdf_key not found in retrieve web proposal response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve proposal_pdf_key from retrieve web proposal response", http.StatusInternalServerError, nil)
		return
	}

	// download proposal pdf as base64 string
	pdfResp, err = http.Get(leadsService.S3GetObjectUrl(proposalPdfKey))
	if err != nil {
		log.FuncErrorTrace(0, "Failed to download proposal pdf as base64 string err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to download proposal pdf", http.StatusInternalServerError, nil)
		return
	}

	defer pdfResp.Body.Close()

	pdfBytes, err = io.ReadAll(pdfResp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read proposal pdf as base64 string err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read proposal pdf", http.StatusInternalServerError, nil)
		return
	}

	pdfBase64 = base64.StdEncoding.EncodeToString(pdfBytes)

	// create docusign envelope
	createEnvelopeApi := docusignclient.CreateEnvelopeApi{
		EmailSubject: dataReq.EmailSubject,
		Documents: []docusignclient.CreateEnvelopeApiDocument{
			{
				DocumentId:     1,
				DocumentBase64: pdfBase64,
				Name:           dataReq.DocumentName,
				FileExtension:  "pdf",
			},
		},
		Recipients: []docusignclient.CreateEnvelopeApiRecipient{
			{
				Email:        leadsEmail,
				Name:         fmt.Sprintf("%s %s", leadsFirstName, leadsLastName),
				FirstName:    leadsFirstName,
				LastName:     leadsLastName,
				RecipientId:  fmt.Sprintf("%d", dataReq.LeadsId),
				ClientUserId: fmt.Sprintf("OWE%d", dataReq.LeadsId),
			},
		},
	}

	createEnvelopeResp, err = createEnvelopeApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create docusign envelope err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	envelopeId, ok := (*createEnvelopeResp)["envelopeId"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get envelope id")
		appserver.FormAndSendHttpResp(resp, "Failed to get envelope id", http.StatusInternalServerError, nil)
		return
	}

	query = "UPDATE leads_info SET docusign_envelope_id = $1 WHERE leads_id = $2"
	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{envelopeId, dataReq.LeadsId})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update docusign envelope id err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Docusign envelope created successfully", http.StatusOK, createEnvelopeResp)
}
