/**************************************************************************
* File			: apiupdateRateAdjustments.go
* DESCRIPTION	: This file contains functions for update RateAdjustments handler
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
 * FUNCTION:		HandleupdateRateAdjustmentsRequest
 * DESCRIPTION:     handler for update RateAdjustments request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateRateAdjustmentsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                      error
		updateRateAdjustmentsReq models.UpdateRateAdjustments
		queryParameters          []interface{}
		result                   []interface{}
	)

	log.EnterFn(0, "HandleupdateRateAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleupdateRateAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update RateAdjustments request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update RateAdjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateRateAdjustmentsReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update RateAdjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update RateAdjustments request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateRateAdjustmentsReq.PayScale) <= 0) ||
		(len(updateRateAdjustmentsReq.Position) <= 0) || (len(updateRateAdjustmentsReq.Adjustment) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateRateAdjustmentsReq.MinRate <= float64(0) {
		err = fmt.Errorf("Invalid MinRate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid MinRate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateRateAdjustmentsReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateRateAdjustmentsReq.MaxRate <= float64(0) {
		err = fmt.Errorf("Invalid MaxRate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid MaxRate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateRateAdjustmentsReq.RecordId)
	queryParameters = append(queryParameters, updateRateAdjustmentsReq.PayScale)
	queryParameters = append(queryParameters, updateRateAdjustmentsReq.Position)
	queryParameters = append(queryParameters, updateRateAdjustmentsReq.Adjustment)
	queryParameters = append(queryParameters, updateRateAdjustmentsReq.MinRate)
	queryParameters = append(queryParameters, updateRateAdjustmentsReq.MaxRate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRateAdjustmentsFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RateAdjustments in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update RateAdjustments", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "RateAdjustments updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "RateAdjustments updated Successfully", http.StatusOK, nil)
}
