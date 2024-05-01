/**************************************************************************
* File			: apiCreateRateAdjustments.go
* DESCRIPTION	: This file contains functions for create RateAdjustments handler
* DATE			: 24-Apr-2024
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
		err = fmt.Errorf("HTTP Request body is null in create RateAdjustments request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create RateAdjustments request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRateAdjustmentsReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create RateAdjustments request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create RateAdjustments request", http.StatusBadRequest, nil)
		return
	}

	if (len(createRateAdjustmentsReq.UniqueId) <= 0) || (len(createRateAdjustmentsReq.PayScale) <= 0) ||
		(len(createRateAdjustmentsReq.Position) <= 0) || (len(createRateAdjustmentsReq.Adjustment) <= 0) ||
		(len(createRateAdjustmentsReq.StartDate) <= 0) || (len(createRateAdjustmentsReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRateAdjustmentsReq.MinRate <= float64(0) {
		err = fmt.Errorf("Invalid MinRate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid MinRate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRateAdjustmentsReq.MaxRate <= float64(0) {
		err = fmt.Errorf("Invalid MaxRate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid MaxRate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createRateAdjustmentsReq.UniqueId)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.PayScale)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.Position)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.Adjustment)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.MinRate)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.MaxRate)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.StartDate)
	queryParameters = append(queryParameters, createRateAdjustmentsReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateRateAdjustmentsFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RateAdjustments in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create RateAdjustments", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "commissions created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Commissions Created Successfully", http.StatusOK, nil)
}
