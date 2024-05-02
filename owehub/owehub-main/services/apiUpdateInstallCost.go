/**************************************************************************
* File			: apiUpdateInstallCost.go
* DESCRIPTION	: This file contains functions for create InstallCost
						setter handler
* DATE			: 01-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateInstallCostDataRequest
 * DESCRIPTION:     handler for update InstallCosts request
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

	log.EnterFn(0, "HandleUpdateInstallCostRequest")
	defer func() { log.ExitFn(0, "HandleUpdateInstallCostRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update InstallCosts request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create InstallCosts request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateInstallCostReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update InstallCosts request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update InstallCosts request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateInstallCostReq.UniqueId) <= 0) || (len(UpdateInstallCostReq.StartDate) <= 0) ||
		(len(UpdateInstallCostReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateInstallCostReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateInstallCostReq.Cost <= float64(0) {
		err = fmt.Errorf("Invalid Cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Cost Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateInstallCostReq.RecordId)
	queryParameters = append(queryParameters, UpdateInstallCostReq.UniqueId)
	queryParameters = append(queryParameters, UpdateInstallCostReq.Cost)
	queryParameters = append(queryParameters, UpdateInstallCostReq.StartDate)
	queryParameters = append(queryParameters, UpdateInstallCostReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateInstallCostFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update InstallCosts in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update InstallCosts", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "InstallCosts Update with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "InstallCosts Update Successfully", http.StatusOK, nil)
}
