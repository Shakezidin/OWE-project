/**************************************************************************
* File			: apiCreateAdderResponsibility.go
* DESCRIPTION	: This file contains functions for create adder responsibility
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
 * FUNCTION:		HandleCreateAdderResponsibilityRequest
 * DESCRIPTION:     handler for create adder responsibility request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateAdderResponsibilityDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                          error
		createAdderResponsibilityReq models.CreateAdderResponsibilityReq
		queryParameters              []interface{}
		result                       []interface{}
	)

	log.EnterFn(0, "HandleCreateAdderResponsibilityRequest")
	defer func() { log.ExitFn(0, "HandleCreateAdderResponsibilityRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create adder responsibility request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create adder responsibility request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAdderResponsibilityReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create adder responsibility request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create adder responsibility request", http.StatusBadRequest, nil)
		return
	}

	if len(createAdderResponsibilityReq.Pay_Scale) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAdderResponsibilityReq.Percentage <= float64(0) {
		err = fmt.Errorf("Invalid Percentage Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Percentage Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createAdderResponsibilityReq.Pay_Scale)
	queryParameters = append(queryParameters, createAdderResponsibilityReq.Percentage)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateAdderResponsibilityFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add adder responsibility in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create adder responsibility", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New adder responsibility created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "adder responsibility Created Successfully", http.StatusOK, nil)
}
