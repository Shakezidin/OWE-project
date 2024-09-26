/**************************************************************************
* File			: apiUpdateInstallCost.go
* DESCRIPTION	: This file contains functions for create install cost handler
* DATE			: 01-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateInstallCostDataRequest
 * DESCRIPTION:     handler for update InstallCost request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateInstallCostDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		UpdateInstallCostReq models.UpdateInstallCost
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleUpdateInstallCostDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateInstallCostDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update install cost request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update install cost request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateInstallCostReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update install cost request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update install cost request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateInstallCostReq.StartDate) <= 0) || (len(UpdateInstallCostReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateInstallCostReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateInstallCostReq.Cost <= float64(0) {
		err = fmt.Errorf("Invalid Cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Cost Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", UpdateInstallCostReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date, Update failed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", UpdateInstallCostReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateInstallCostReq.RecordId)
	queryParameters = append(queryParameters, UpdateInstallCostReq.Cost)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateInstallCostFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update install cost in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update install cost", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "install cost Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Install Cost Updated Successfully", http.StatusOK, nil)
}
