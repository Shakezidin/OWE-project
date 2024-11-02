/**************************************************************************
*	File			: apiDocusignGetSigningUrl.go
*	DESCRIPTION	: This file contains functions for getting docusign signing url
*	DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/owehub-leads/docusignclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
)

/******************************************************************************
 * FUNCTION:		HandleDocusignGetSigningUrlRequest
 * DESCRIPTION:     handler for getting docusign signing url
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDocusignGetSigningUrlRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		query              string
		data               []map[string]interface{}
		leadId             int
		pdfResp            *http.Response
		pdfBytes           []byte
		pdfBase64          string
		createEnvelopeResp *map[string]interface{}
	)

	const totalSteps = 4

	log.EnterFn(0, "HandleDocusignGetSigningUrlRequest")
	defer log.ExitFn(0, "HandleDocusignGetSigningUrlRequest", err)

	handler := appserver.NewSSEHandler(resp, req)
	defer func() { err = handler.EndResponse() }()

	// retreive lead id from url query
	leadIdStr := req.URL.Query().Get("leads_id")
	returnUrl := req.URL.Query().Get("return_url")

	if leadIdStr == "" {
		log.FuncErrorTrace(0, "Failed to parse get leads id from url query")
		handler.SendError("Lead id is not provided")
		return
	}

	if _, err = url.ParseRequestURI(returnUrl); err != nil {
		log.FuncErrorTrace(0, "Failed to parse return url from url query")
		handler.SendError("Return url is not provided")
		return
	}

	leadId, err = strconv.Atoi(leadIdStr)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse leads id err %v", err)
		handler.SendError("Invalid lead id format")
		return
	}

	// retreive design id from database
	query = `
		SELECT
			li.email_id,
			li.first_name,
			li.last_name,
			li.proposal_pdf_key,
			li.docusign_envelope_id
		FROM leads_info li
		WHERE li.leads_id = $1
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{leadId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve leads info from DB err: %v", err)
		handler.SendError("Failed to retrieve leads info from DB")
		return
	}

	if len(data) <= 0 {
		err = fmt.Errorf("leads info not found")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Lead not found")
		return
	}

	leadsEmail, ok := data[0]["email_id"].(string)
	if !ok {
		err = fmt.Errorf("email_id not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve email_id from database")
		return
	}

	leadsFirstName, ok := data[0]["first_name"].(string)
	if !ok {
		err = fmt.Errorf("first_name not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve first_name from database")
		return
	}

	leadsLastName, ok := data[0]["last_name"].(string)
	if !ok {
		err = fmt.Errorf("last_name not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve last_name from database")
		return
	}

	proposalPdfKey, ok := data[0]["proposal_pdf_key"].(string)
	if !ok {
		err = fmt.Errorf("proposal_pdf_key not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve proposal_pdf_key from database")
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": 1,
		"total_steps":  totalSteps,
	}, false)

	envelopeId, ok := data[0]["docusign_envelope_id"].(string)

	// if envelope id is null, create docusign envelope
	if !ok {
		// download proposal pdf as base64 string
		pdfResp, err = http.Get(leadsService.S3GetObjectUrl(proposalPdfKey))
		if err != nil {
			log.FuncErrorTrace(0, "Failed to download proposal pdf as base64 string err: %v", err)
			handler.SendError("Failed to download proposal pdf")
			return
		}

		defer pdfResp.Body.Close()

		handler.SendData(map[string]interface{}{
			"current_step": 2,
			"total_steps":  totalSteps,
		}, false)

		pdfBytes, err = io.ReadAll(pdfResp.Body)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to read proposal pdf as base64 string err: %v", err)
			handler.SendError("Failed to read proposal pdf")
			return
		}

		pdfBase64 = base64.StdEncoding.EncodeToString(pdfBytes)

		// create docusign envelope
		createEnvelopeApi := docusignclient.CreateEnvelopeApi{
			EmailSubject: string(leadsService.LeadDocusignLabelSubject),
			Documents: []docusignclient.CreateEnvelopeApiDocument{
				{
					DocumentId:     1,
					DocumentBase64: pdfBase64,
					Name:           string(leadsService.LeadDocusignLabelDocumentName),
					FileExtension:  "pdf",
				},
			},
			Recipients: []docusignclient.CreateEnvelopeApiRecipient{
				{
					Email:        leadsEmail,
					Name:         fmt.Sprintf("%s %s", leadsFirstName, leadsLastName),
					FirstName:    leadsFirstName,
					LastName:     leadsLastName,
					RecipientId:  fmt.Sprintf("%d", leadId),
					ClientUserId: fmt.Sprintf("OWE%d", leadId),
				},
			},
		}
		createEnvelopeResp, err = createEnvelopeApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create docusign envelope err %v", err)
			handler.SendError(err.Error())
			return
		}

		envelopeId, ok = (*createEnvelopeResp)["envelopeId"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get envelope id")
			handler.SendError("Failed to get envelope id")
			return
		}

		query = "UPDATE leads_info SET docusign_envelope_id = $1, docusign_envelope_sent_at = CURRENT_TIMESTAMP WHERE leads_id = $2"
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{envelopeId, leadId})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to update docusign envelope id err %v", err)
			handler.SendError(err.Error())
			return
		}
	}

	handler.SendData(map[string]interface{}{
		"current_step": 3,
		"total_steps":  totalSteps,
	}, false)

	// create recipient view
	recipientViewApi := docusignclient.CreateRecipientViewApi{
		EnvelopeId:   envelopeId,
		RecipientId:  fmt.Sprintf("%d", leadId),
		UserName:     fmt.Sprintf("%s %s", leadsFirstName, leadsLastName),
		Email:        leadsEmail,
		ClientUserId: fmt.Sprintf("OWE%d", leadId),
		ReturnUrl:    returnUrl,
	}
	recipientViewResp, err := recipientViewApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create docusign recipient view err %v", err)
		handler.SendError(err.Error())
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": totalSteps,
		"total_steps":  totalSteps,
		"url":          recipientViewResp.Url,
	}, true)
}
