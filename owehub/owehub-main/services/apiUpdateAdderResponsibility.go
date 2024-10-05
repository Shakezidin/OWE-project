/**************************************************************************
* File			: apiUpdateAdderResponsibility.go
* DESCRIPTION	: This file contains functions for update adder responsibility
* DATE			: 29-Apr-2024
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
 * FUNCTION:		HandleUpdateAdderResponsibilityDataRequest
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

	log.EnterFn(0, "HandleUpdateAdderResponsibilityDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdderResponsibilityDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update adder responsibility request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update adder responsibility request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateAdderResponsibilityReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update adder responsibility request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update adder responsibility request", http.StatusBadRequest, nil)
		return
	}

	if len(UpdateAdderResponsibilityReq.Pay_Scale) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdderResponsibilityReq.Record_Id <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record_id, update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdderResponsibilityReq.Percentage <= float64(0) {
		err = fmt.Errorf("Invalid Percentage Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Percentage, update failed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateAdderResponsibilityReq.Record_Id)
	queryParameters = append(queryParameters, UpdateAdderResponsibilityReq.Pay_Scale)
	queryParameters = append(queryParameters, UpdateAdderResponsibilityReq.Percentage)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateAdderResponsibilityFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update adder responsibility in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update adder responsibility", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adder responsibility Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Adder Responsibility Updated Successfully", http.StatusOK, nil)
}
