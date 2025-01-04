/**************************************************************************
 * File       	   : apiDeleteSupersetReports.go
 * DESCRIPTION     : This file contains functions to delete superset report
 * DATE            : 22-Dec-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

/******************************************************************************
 * FUNCTION:		HandleDeleteSupersetReportsRequest
 * DESCRIPTION:     handler for delete superset report request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDeleteSupersetReportsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		dataReq           models.DeleteSupersetReportRequest
		query             string
		queryPlaceholders []string
		whereEleList      []interface{}
		deletedCount      int64
	)

	log.EnterFn(0, "HandleDeleteSupersetReportsRequest")
	defer func() { log.ExitFn(0, "HandleDeleteSupersetReportsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in delete superset report")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from delete superset report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal delete superset report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal delete superset report", http.StatusBadRequest, nil)
		return
	}

	// bad request if no report ids provided
	if len(dataReq.ReportIds) == 0 {
		err = fmt.Errorf("no report ids provided")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "No report ids provided", http.StatusBadRequest, nil)
		return
	}

	// prepare the query
	for _, reportId := range dataReq.ReportIds {
		whereEleList = append(whereEleList, reportId)
		queryPlaceholders = append(queryPlaceholders, fmt.Sprintf("$%d", len(whereEleList)))
	}
	query = fmt.Sprintf("DELETE FROM %s WHERE id IN (%s)", db.TableName_SupersetReports, strings.Join(queryPlaceholders, ", "))

	// delete the superset reports
	err, deletedCount = db.UpdateDataInDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Delete Superset Report in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Delete Superset Report ", http.StatusInternalServerError, nil)
		return
	}

	// log if some reports failed to delete
	failedDeleteCount := int64(len(dataReq.ReportIds)) - deletedCount
	if failedDeleteCount > 0 {
		log.FuncErrorTrace(0, "Failed to delete %d of %d superset reports", failedDeleteCount, len(dataReq.ReportIds))
	}

	appserver.FormAndSendHttpResp(resp, "Superset report deleted successfully", http.StatusOK, nil, deletedCount)
}
