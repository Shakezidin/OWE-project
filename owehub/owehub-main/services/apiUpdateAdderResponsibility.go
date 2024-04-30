/**************************************************************************
* File			: apiUpdateAdderResponsibility.go
* DESCRIPTION	: This file contains functions for Update adder responsibility
* DATE			: 29-Apr-2024
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
 * FUNCTION:		HandleUpdateAdderResponsibilityRequest
 * DESCRIPTION:     handler for Update adder responsibility request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateAdderResponsibilityDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                          error
		UpdateAdderResponsibilityReq models.UpdateAdderResponsibilityReq
		queryParameters              []interface{}
		result                       []interface{}
	)

	log.EnterFn(0, "HandleUpdateAdderResponsibilityRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdderResponsibilityRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update adder responsibility request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update adder responsibility request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateAdderResponsibilityReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update adder responsibility request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Update adder responsibility request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateAdderResponsibilityReq.Unique_Id) <= 0) || (len(UpdateAdderResponsibilityReq.Pay_Scale) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdderResponsibilityReq.Record_Id <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdderResponsibilityReq.Percentage <= float64(0) {
		err = fmt.Errorf("Invalid Percentage Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Percentage Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateAdderResponsibilityReq.Record_Id)
	queryParameters = append(queryParameters, UpdateAdderResponsibilityReq.Unique_Id)
	queryParameters = append(queryParameters, UpdateAdderResponsibilityReq.Pay_Scale)
	queryParameters = append(queryParameters, UpdateAdderResponsibilityReq.Percentage)

	result, err = db.CallDBFunction(db.UpdateAdderResponsibilityFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add adder responsibility in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update adder responsibility", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adder responsibility Updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "adder responsibility Updated Successfully", http.StatusOK, nil)
}
