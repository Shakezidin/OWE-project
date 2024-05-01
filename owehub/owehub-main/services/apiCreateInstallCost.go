/**************************************************************************
* File			: apiInstallCostCreateCommission.go
* DESCRIPTION	: This file contains functions for create InstallCost
						setter handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleCreateAptSetterRequest
 * DESCRIPTION:     handler for create InstallCosts request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateInstallCostRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		createInstallCostReq models.CreateInstallCost
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleCreateInstallCostRequest")
	defer func() { log.ExitFn(0, "HandleCreateInstallCostRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create InstallCosts request")
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

	err = json.Unmarshal(reqBody, &createInstallCostReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create InstallCosts request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create InstallCosts request", http.StatusBadRequest, nil)
		return
	}

	if (len(createInstallCostReq.UniqueId) <= 0) || (len(createInstallCostReq.StartDate) <= 0) ||
		(len(createInstallCostReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createInstallCostReq.Cost <= float64(0) {
		err = fmt.Errorf("Invalid Cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Cost Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createInstallCostReq.UniqueId)
	queryParameters = append(queryParameters, createInstallCostReq.Cost)
	queryParameters = append(queryParameters, createInstallCostReq.StartDate)
	queryParameters = append(queryParameters, createInstallCostReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateInstallCostFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add InstallCosts in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create InstallCosts", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "InstallCosts created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "InstallCosts Created Successfully", http.StatusOK, nil)
}
