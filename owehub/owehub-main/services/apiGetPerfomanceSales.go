/**************************************************************************
 * File       	   : apiGetPerfomanceSales.go
 * DESCRIPTION     : This file contains functions for get PerfomanceSales handler
 * DATE            : 03-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"io/ioutil"
	"strings"

	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetPerfomanceTileDataRequest
* DESCRIPTION:     handler for get PerfomanceSales request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPerfomanceTileDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		dataReq            models.PerfomanceTileDataReq
		perfomanceResponse models.PerfomanceTileDataResponse
		data               []map[string]interface{}
		userRole           string
		roleFilter         string
		pipelineQuery      string
		RecordCount        int64
	)

	log.EnterFn(0, "HandleGetPerfomanceTileDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceTileDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get perfomance tile data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get perfomance tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get perfomance tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get perfomance tile data Request body", http.StatusBadRequest, nil)
		return
	}

	/* Project status out of this will be rejected */
	allowedStatuses := map[string]bool{
		"JEOPARDY": true,
		"HOLD":     true,
		"ACTIVE":   true,
	}

	if len(dataReq.ProjectStatus) == 0 {
		log.FuncErrorTrace(0, "empty  project status: %v", err)
		appserver.FormAndSendHttpResp(resp, "empty project status", http.StatusBadRequest, nil)
		return
	}

	for _, status := range dataReq.ProjectStatus {
		if !allowedStatuses[status] {
			log.FuncErrorTrace(0, "invalid project status: %s", status)
			appserver.FormAndSendHttpResp(resp, "invalid project status", http.StatusBadRequest, nil)
			return
		}
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	userRole = req.Context().Value("rolename").(string)
	if len(userRole) == 0 {
		appserver.FormAndSendHttpResp(resp, "Unauthorized Role", http.StatusBadRequest, nil)
		return
	}

	roleFilter, err = HandleDataFilterOnUserRoles(dataReq.Email, userRole, "cust", dataReq.DealerNames)
	if err != nil {
		if !strings.Contains(err.Error(), "<not an error>") && !strings.Contains(err.Error(), "<emptyerror>") {
			log.FuncErrorTrace(0, "error creating user role query %v", err)
			appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
			return
		} else if strings.Contains(err.Error(), "<emptyerror>") || strings.Contains(err.Error(), "<not an error>") {
			appserver.FormAndSendHttpResp(resp, "perfomance tile Data", http.StatusOK, perfomanceResponse, RecordCount)
			return
		}
	}

	projectStatus := joinNames(dataReq.ProjectStatus)
	pipelineQuery = models.PipelineTileDataAboveQuery(roleFilter, projectStatus)
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, pipelineQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get perfomance tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get perfomance tile data", http.StatusBadRequest, nil)
		return
	}

	var performanceResponse models.PerfomanceTileDataResponse

	for _, item := range data {
		queueStatus, ok := item["queue_status"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get queue_status. Item: %+v\n", item)
			continue
		}

		count, ok := item["distinct_customer_count"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get distinct_customer_count. Item: %+v\n", item)
			continue
		}

		switch queueStatus {
		case "Inspections Queue":
			performanceResponse.InspectionCount = count
		case "Activation Queue":
			performanceResponse.ActivationCount = count
		case "Install (Scheduling) Queue":
			performanceResponse.InstallCount = count
		case "CAD Queue":
			performanceResponse.CadDesignCount = count
		case "Permit Queue":
			performanceResponse.PerimittingCount = count
		case "Survey Queue":
			performanceResponse.SiteSurveyCount = count
		case "Roofing Queue":
			performanceResponse.RoofingCount = count
		default:
			log.FuncErrorTrace(0, "Unknown queue status: %s", queueStatus)
		}
	}

	log.FuncInfoTrace(0, "Performance tile data fetched: %+v", performanceResponse)
	appserver.FormAndSendHttpResp(resp, "performance tile Data", http.StatusOK, performanceResponse, RecordCount)
}
