/**************************************************************************
 *	File            : apiAuroraCreateProposal.go
 * 	DESCRIPTION     : This file contains api calls to create a project in aurora
 *	DATE            : 28-Sep-2024
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
	query = "SELECT li.aurora_design_id FROM get_leads_info_hierarchy($1) li WHERE li.leads_id = $2"

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
}
