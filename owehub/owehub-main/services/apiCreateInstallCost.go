/**************************************************************************
* File			: apiCreateInstallCost.go
* DESCRIPTION	: This file contains functions for create install cost handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleCreateInstallCostRequest
 * DESCRIPTION:     handler for create Install cost request
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
		err = fmt.Errorf("HTTP Request body is null in create install cost request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create install cost request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createInstallCostReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create install cost request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Install Cost request", http.StatusBadRequest, nil)
		return
	}

	if (len(createInstallCostReq.StartDate) <= 0) || (len(createInstallCostReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createInstallCostReq.Cost <= float64(0) {
		err = fmt.Errorf("Invalid cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Cost Not Allowed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", createInstallCostReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", createInstallCostReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createInstallCostReq.Cost)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateInstallCostFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add install cost in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Install Cost", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New install cost created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Install Cost Created Successfully", http.StatusOK, nil)
}
