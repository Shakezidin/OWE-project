/**************************************************************************
*	File			: apiDocusignCreateRecipientView.go
*	DESCRIPTION	: This file contains functions for creating docusign recipient view
*	DATE			: 28-Aug-2024
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
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleDocusignCreateRecipientViewRequest
 * DESCRIPTION:     handler for creating docusign recipient view
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDocusignCreateRecipientViewRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		query                   string
		data                    []map[string]interface{}
		dataReq                 models.DocusignCreateRecipientViewRequest
		createRecipientViewResp *docusignclient.CreateRecipientViewApiResponse
	)

	log.EnterFn(0, "HandleDocusignCreateRecipientViewRequest")
	defer log.ExitFn(0, "HandleDocusignCreateRecipientViewRequest", err)

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create docusign recipient view request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create docusign recipient view request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to create docusign recipient view request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmailId := req.Context().Value("emailid").(string)

	query = "SELECT email_id, docusign_envelope_id, first_name, last_name FROM get_leads_info_hierarchy($1) li WHERE li.leads_id = $2"
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
		err = fmt.Errorf("email_id not found in docusign create recipient response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve email_id from docusign create recipient response", http.StatusInternalServerError, nil)
		return
	}

	leadsFirstName, ok := data[0]["first_name"].(string)
	if !ok {
		err = fmt.Errorf("first_name not found in docusign create recipient response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve first_name from docusign create recipient response", http.StatusInternalServerError, nil)
		return
	}

	leadsLastName, ok := data[0]["last_name"].(string)
	if !ok {
		err = fmt.Errorf("last_name not found in docusign create recipient response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve last_name from docusign create recipient response", http.StatusInternalServerError, nil)
		return
	}

	envelopeId, ok := data[0]["docusign_envelope_id"].(string)
	if !ok {
		err = fmt.Errorf("docusign_envelope_id not found in docusign create recipient response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve docusign_envelope_id from docusign create recipient response", http.StatusInternalServerError, nil)
		return
	}

	// create docusign recipient view
	createRecipientViewApi := docusignclient.CreateRecipientViewApi{
		EnvelopeId:   envelopeId,
		RecipientId:  fmt.Sprintf("%d", dataReq.LeadsId),
		UserName:     fmt.Sprintf("%s %s", leadsFirstName, leadsLastName),
		Email:        leadsEmail,
		ClientUserId: fmt.Sprintf("OWE%d", dataReq.LeadsId),
		ReturnUrl:    dataReq.ReturnUrl,
		AccessToken:  dataReq.AccessToken,
		BaseUri:      dataReq.BaseUri,
	}

	createRecipientViewResp, err = createRecipientViewApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create docusign recipient view err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Recipient View Created", http.StatusOK, createRecipientViewResp)
}
