/**************************************************************************
* File			: apiUpdateAr.go
* DESCRIPTION	: This file contains functions for Update Ar handler
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
 * FUNCTION:		HandleUpdateAptSetterRequest
 * DESCRIPTION:     handler for Update Ar request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateARDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		UpdateArReq     models.UpdateAR
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateArDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateArDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update Ar request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update Ar request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateArReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update Ar request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Update Ar request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateArReq.UniqueId) <= 0) || (len(UpdateArReq.PayScale) <= 0) ||
		(len(UpdateArReq.Position) <= 0) || (len(UpdateArReq.Adjustment) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateArReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateArReq.MinRate <= float64(0) {
		err = fmt.Errorf("Invalid min_rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid min_rate price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateArReq.MaxRate <= float64(0) {
		err = fmt.Errorf("Invalid max_rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid max_rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order

	queryParameters = append(queryParameters, UpdateArReq.RecordId)
	queryParameters = append(queryParameters, UpdateArReq.UniqueId)
	queryParameters = append(queryParameters, UpdateArReq.PayScale)
	queryParameters = append(queryParameters, UpdateArReq.Position)
	queryParameters = append(queryParameters, UpdateArReq.Adjustment)
	queryParameters = append(queryParameters, UpdateArReq.MinRate)
	queryParameters = append(queryParameters, UpdateArReq.MaxRate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateArFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Ar in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update Ar", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Ar Updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Ar Updated Successfully", http.StatusOK, nil)
}
