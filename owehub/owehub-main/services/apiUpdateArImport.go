/**************************************************************************
* File			: apiUpdateArImport.go
* DESCRIPTION	: This file contains functions for Update ar import handler
* DATE			: 30-Apr-2024
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
 * FUNCTION:		HandleUpdateArImportDataRequest
 * DESCRIPTION:     handler for Update Ar import request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateArImportDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		UpdateArImportReq models.UpdateArImport
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleUpdateArImportDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateArImportDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update ar import request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update ar import request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateArImportReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update ar import request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update ar import request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateArImportReq.UniqueId) <= 0) || (len(UpdateArImportReq.Customer) <= 0) ||
		(len(UpdateArImportReq.Date) <= 0) || (len(UpdateArImportReq.Amount) <= 0) ||
		(len(UpdateArImportReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateArImportReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateArImportReq.UniqueId)
	queryParameters = append(queryParameters, UpdateArImportReq.Customer)
	queryParameters = append(queryParameters, UpdateArImportReq.Date)
	queryParameters = append(queryParameters, UpdateArImportReq.Amount)
	queryParameters = append(queryParameters, UpdateArImportReq.Notes)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateArImportFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update Ar import in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update Ar import", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Ar import Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Ar Import Updated Successfully", http.StatusOK, nil)
}
