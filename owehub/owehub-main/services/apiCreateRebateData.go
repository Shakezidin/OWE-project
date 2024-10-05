/**************************************************************************
* File			: apiCreateRebateData.go
* DESCRIPTION	: This file contains functions for create rebate data handler
* DATE			: 24-Apr-2024
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
 * FUNCTION:		HandleCreateRebateDataRequest
 * DESCRIPTION:     handler for create rebate data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateRebateDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createRebateDataReq models.CreateRebateData
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleCreateRebateDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateRebateDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create rebate data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create rebate data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRebateDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create rebate data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create rebate data request", http.StatusBadRequest, nil)
		return
	}

	if (len(createRebateDataReq.UniqueId) <= 0) || (len(createRebateDataReq.CustomerVerf) <= 0) ||
		(len(createRebateDataReq.Date) <= 0) || (len(createRebateDataReq.Type) <= 0) ||
		(len(createRebateDataReq.Item) <= 0) || (len(createRebateDataReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRebateDataReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid Repdolldivbyper Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createRebateDataReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid Amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	date, err := time.Parse("2006-01-02", createRebateDataReq.Date)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createRebateDataReq.CustomerVerf)
	queryParameters = append(queryParameters, createRebateDataReq.UniqueId)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createRebateDataReq.Type)
	queryParameters = append(queryParameters, createRebateDataReq.Item)
	queryParameters = append(queryParameters, createRebateDataReq.Amount)
	queryParameters = append(queryParameters, createRebateDataReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, createRebateDataReq.Notes)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateRebateDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add rebate data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Rebate Data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New rebate data created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Rebate Data Created Successfully", http.StatusOK, nil)
}
