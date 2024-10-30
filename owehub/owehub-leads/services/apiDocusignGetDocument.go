/**************************************************************************
*	File			: apiDocusignGetDocument.go
*	DESCRIPTION	: This file contains functions for getting docusign document
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
 * FUNCTION:		HandleDocusignGetDocumentRequest
 * DESCRIPTION:     handler for getting docusign document
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDocusignGetDocumentRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		query                   string
		data                    []map[string]interface{}
		dataReq                 models.DocusignGetDocumentRequest
		getDocumentResp         *[]byte
		getDocumentRespFileName string
	)

	log.EnterFn(0, "HandleDocusignGetDocumentRequest")
	defer log.ExitFn(0, "HandleDocusignGetDocumentRequest", err)

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get docusign document request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get docusign document request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to get docusign document request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmailId := req.Context().Value("emailid").(string)

	query = "SELECT docusign_envelope_id FROM get_leads_info_hierarchy($1) li WHERE li.leads_id = $2"
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

	envelopeId, ok := data[0]["docusign_envelope_id"].(string)
	if !ok {
		err = fmt.Errorf("docusign_envelope_id not found in retrieve docusign document response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve docusign_envelope_id from retrieve docusign document response", http.StatusInternalServerError, nil)
		return
	}

	// get docusign document
	getDocumentApi := docusignclient.GetDocumentApi{
		AccessToken: dataReq.AccessToken,
		BaseUri:     dataReq.BaseUri,
		EnvelopeId:  envelopeId,
	}

	getDocumentResp, err = getDocumentApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get docusign document err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	_, err = resp.Write(*getDocumentResp)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to write docusign document err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	getDocumentRespFileName = fmt.Sprintf("docusign_document_%d.pdf", dataReq.LeadsId)
	resp.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", getDocumentRespFileName))
}
