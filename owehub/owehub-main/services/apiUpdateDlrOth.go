/**************************************************************************
* File			: apiupdateDLR_OTH.go
* DESCRIPTION	: This file contains functions for update dlr_oth handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleUpdateDLROTHDataRequest
 * DESCRIPTION:     handler for update dlr_oth request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateDLROTHDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		updateDLR_OTHReq models.UpdateDLR_OTHData
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleUpdateDLROTHDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDLROTHDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dlr_oth request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dlr_oth request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDLR_OTHReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dlr_oth request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update dlr_oth request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateDLR_OTHReq.Unique_Id) <= 0) || (len(updateDLR_OTHReq.Payee) <= 0) ||
		(len(updateDLR_OTHReq.Amount) <= 0) || (len(updateDLR_OTHReq.Description) <= 0) ||
		(len(updateDLR_OTHReq.StartDate) <= 0) || (len(updateDLR_OTHReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDLR_OTHReq.Record_Id <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDLR_OTHReq.Paid_Amount <= float64(0) {
		err = fmt.Errorf("Invalid Paid_amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid paid amount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDLR_OTHReq.Balance <= float64(0) {
		err = fmt.Errorf("Invalid balance Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Balance Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDLR_OTHReq.Paid_Amount <= float64(0) {
		err = fmt.Errorf("Invalid Paid_amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Paid Amount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateDLR_OTHReq.Record_Id)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Unique_Id)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Payee)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Amount)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Description)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Balance)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Paid_Amount)
	queryParameters = append(queryParameters, updateDLR_OTHReq.StartDate)
	queryParameters = append(queryParameters, updateDLR_OTHReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDLR_OTHFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dlr_oth in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update dlr_oth", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dlr_oth updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Dlr Oth Updated Successfully", http.StatusOK, nil)
}
