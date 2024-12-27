/**************************************************************************
 *	File            : apiAuroraRetreiveProject.go
 * 	DESCRIPTION     : This file contains api calls to retreive project in aurora
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
 * FUNCTION:        HandleAuroraGetProjectRequest
 *
 * DESCRIPTION:     This function will handle the request to retreive project in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraGetProjectRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err           error
		reqBody       []byte
		dataReq       models.AuroraGetProjectRequest
		auroraApiResp *auroraclient.RetreiveProjectApiResponse
		query         string
		whereEleList  []interface{}
		data          []map[string]interface{}
	)
	log.EnterFn(0, "HandleAuroraGetProjectRequest")
	defer func() { log.ExitFn(0, "HandleAuroraGetProjectRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get aurora project")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get aurora project err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to get aurora project err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	query = "SELECT aurora_project_id FROM get_leads_info_hierarchy($1) li WHERE li.leads_id = $2"

	authenticatedEmailId := req.Context().Value("emailid").(string)
	whereEleList = []interface{}{authenticatedEmailId, dataReq.LeadsId}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

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

	projectId, ok := data[0]["aurora_project_id"].(string)
	if !ok {
		err = fmt.Errorf("project_id not found in create project response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Project not found", http.StatusBadRequest, nil)
		return
	}

	// retrieve aurora project
	retrieveAuroraProjectApi := auroraclient.RetreiveProjectApi{
		ProjectId: projectId,
	}

	auroraApiResp, err = retrieveAuroraProjectApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve aurora project err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Aurora Project", http.StatusOK, auroraApiResp.Project)
}
