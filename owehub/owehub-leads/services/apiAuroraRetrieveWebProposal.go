/**************************************************************************
 *	File            : apiAuroraRetrieveWebProposal.go
 * 	DESCRIPTION     : This file contains api calls to retrieve web proposals in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package services

import (
	"OWEApp/owehub-leads/auroraclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

/******************************************************************************
 * FUNCTION:        HandleAuroraRetrieveWebProposalRequest
 *
 * DESCRIPTION:     This function will handle the request to retreive web proposals in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraRetrieveWebProposalRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err           error
		reqBody       []byte
		dataReq       models.AuroraRetrieveWebProposaltRequest
		auroraApiResp *auroraclient.RetrieveWebProposalApiResponse
		data          []map[string]interface{}
		query         string
		whereEleList  []interface{}
	)
	log.EnterFn(0, "HandleAuroraRetrieveWebProposalRequest")
	defer func() { log.ExitFn(0, "HandleAuroraRetrieveWebProposalRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in retrieve web proposals")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from retrieve web proposals err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to retrieve web proposals err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	query = "SELECT aurora_design_id FROM get_leads_info_hierarchy($1) li WHERE li.leads_id = $2"

	authenticatedEmailId := req.Context().Value("emailid").(string)
	whereEleList = []interface{}{authenticatedEmailId, dataReq.LeadsId}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve aurora design id from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve aurora design id from DB", http.StatusInternalServerError, nil)
		return
	}

	if len(data) <= 0 {
		err = fmt.Errorf("aurora design id not found")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "aurora design id not found", http.StatusBadRequest, nil)
		return
	}

	designId, ok := data[0]["aurora_design_id"].(string)
	if !ok {
		err = fmt.Errorf("design_id not found in retrieve web proposal response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "design id not found", http.StatusBadRequest, nil)
		return
	}

	// get aurora retrieve module
	retrieveAuroraWebProposalApi := auroraclient.RetrieveWebProposalApi{
		DesignId: designId,
	}

	auroraApiResp, err = retrieveAuroraWebProposalApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve aurora web proposal err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Aurora retrieve web proposal", http.StatusOK, auroraApiResp.WebProposal)
}
