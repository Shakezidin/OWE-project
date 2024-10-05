/**************************************************************************
* File			: apiCreateRateAdjustments.go
* DESCRIPTION	: This file contains functions for create RateAdjustments handler
* DATE			: 24-Apr-2024
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
)

/******************************************************************************
 * FUNCTION:		HandleCreateRateAdjustmentsRequest
 * DESCRIPTION:     handler for create RateAdjustments request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateRateAdjustmentsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                      error
		createRateAdjustmentsReq models.CreateRateAdjustments
		queryParameters          []interface{}
		result                   []interface{}
	)

	log.EnterFn(0, "HandleCreateRateAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleCreateRateAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create rate adjustments request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create rate adjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRateAdjustmentsReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create rate adjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Rate Adjustments request", http.StatusBadRequest, nil)
		return
	}

	if (len(createRateAdjustmentsReq.PayScale) <= 0) ||
		(len(createRateAdjustmentsReq.Position) <= 0) || (len(createRateAdjustmentsReq.Adjustment) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRateAdjustmentsReq.MinRate <= float64(0) {
		err = fmt.Errorf("Invalid Min Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Min Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRateAdjustmentsReq.MaxRate <= float64(0) {
		err = fmt.Errorf("Invalid Max Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Max Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createRateAdjustmentsReq.PayScale)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.Position)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.Adjustment)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.MinRate)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.MaxRate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateRateAdjustmentsFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add rate adjustments in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Rate Adjustments", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New rate adjustments created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Rate Adjustments Created Successfully", http.StatusOK, nil)
}
