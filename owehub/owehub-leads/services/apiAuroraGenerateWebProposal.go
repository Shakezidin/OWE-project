/**************************************************************************
 *	File            : apiAuroraGenerateWebProposal.go
 * 	DESCRIPTION     : This file contains api calls to generate module in aurora
 *	DATE            : 15-october-2024
**************************************************************************/
package services

import (
	"OWEApp/owehub-leads/auroraclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

/******************************************************************************
 * FUNCTION:        HandleAuroraGenerateWebProposalRequest
 *
 * DESCRIPTION:     This function will handle the request to generate module in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraGenerateWebProposalRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err           error
		reqBody       []byte
		dataReq       models.AuroraGenerateWebProposalRequest
		query         string
		data          []map[string]interface{}
		whereEleList  []interface{}
		auroraApiResp *auroraclient.GenerateWebProposalApiResponse
	)

	log.EnterFn(0, "HandleAuroraGenerateWebProposalRequest")
	defer func() { log.ExitFn(0, "HandleAuroraGenerateWebProposalRequest", err) }()

	if req.Body == nil {
		err = errors.New("HTTP Request body is null in generate web proposal")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
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
	auroraApi := auroraclient.GenerateWebProposalApi{
		DesignId: designId,
	}

	auroraApiResp, err = auroraApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora web proposal err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	// set proposal_pdf_key to null, to trigger the pdf generation when generate_pdf api is called
	query = "UPDATE leads_info SET proposal_pdf_key = NULL WHERE leads_id = $1"
	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{dataReq.LeadsId})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update proposal_pdf_key to null in DB err %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update proposal_pdf_key to null in DB", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Aurora create web proposal", http.StatusOK, auroraApiResp.WebProposal)
}
