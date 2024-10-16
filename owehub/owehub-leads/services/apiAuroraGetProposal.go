/**************************************************************************
* File                  : apiAuroraGetProposal.go
* DESCRIPTION           : This file contains functions to get a proposal in aurora

* DATE                  : 11-September-2024
**************************************************************************/

package services

import (
	"OWEApp/owehub-leads/auroraclient"
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
 * FUNCTION:		HandleAuroraGetProposalRequest
 * DESCRIPTION:     handler for getting proposal in aurora
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleAuroraGetProposalRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		reqBody         []byte
		dataReq         models.AuroraGetProposalRequest
		data            []map[string]interface{}
		query           string
		getProposalResp *auroraclient.RetreiveProposalApiResponse
	)
	log.EnterFn(0, "HandleAuroraGetProposalRequest")
	defer func() { log.ExitFn(0, "HandleAuroraGetProposalRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get proposal request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get proposal request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}
	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to get proposal request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	query = "SELECT design_id FROM get_leads_info_hierarchy($1) li WHERE li.leads_id = $2"

	authenticatedEmailId := req.Context().Value("emailid").(string)

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

	designId, ok := data[0]["design_id"].(string)
	if !ok {
		err = fmt.Errorf("design_id not found in get proposal response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve design id from get proposal response", http.StatusInternalServerError, nil)
		return
	}

	// get proposal
	getProposalApi := auroraclient.RetreiveProposalApi{
		DesignId: designId,
	}

	getProposalResp, err = getProposalApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get aurora proposal err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Aurora Proposal", http.StatusOK, getProposalResp.Proposal)
}
