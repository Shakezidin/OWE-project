/**************************************************************************
* File			: apiUpdateNonCommDlrPayRequest.go
* DESCRIPTION	: This file contains functions for Update Referral data handler
* DATE			: 25-Apr-2024
**************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateNonCommDlrPayRequest
 * DESCRIPTION:     handler for Update referral data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateNonCommDlrPayRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		UpdateNonCommDlrPay models.UpdateNonCommDlrPay
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleUpdateNonCommDlrPayRequest")
	defer func() { log.ExitFn(0, "HandleUpdateNonCommDlrPayRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update NonComm Dealer Pay request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update NonComm Dealer Pay request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateNonCommDlrPay)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update NonComm Dealer Pay request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Update NoncCmm Dealer Pay request", http.StatusBadRequest, nil)
		return
	}
	
	// Validate string fields
	if len(UpdateNonCommDlrPay.UniqueID) <= 0 || len(UpdateNonCommDlrPay.Customer) <= 0 ||
	len(UpdateNonCommDlrPay.Dealer) <= 0 || len(UpdateNonCommDlrPay.DealerDBA) <= 0 || 
	len(UpdateNonCommDlrPay.ExactAmount) <= 0 || len(UpdateNonCommDlrPay.ApprovedBy) <= 0 ||
	len(UpdateNonCommDlrPay.Notes) <= 0 || len(UpdateNonCommDlrPay.DBA) <= 0 ||
	len(UpdateNonCommDlrPay.StartDate) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Validate float64 fields
	if UpdateNonCommDlrPay.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id: %f, Not Allowed", UpdateNonCommDlrPay.Balance)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id Not Allowed", http.StatusBadRequest, nil)
		return
	}
	
	// Validate float64 fields
	if UpdateNonCommDlrPay.Balance <= float64(0) {
		err = fmt.Errorf("Invalid balance value: %f, Not Allowed", UpdateNonCommDlrPay.Balance)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid balance value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateNonCommDlrPay.PaidAmount <= float64(0) {
		err = fmt.Errorf("Invalid paid amount value: %f, Not Allowed", UpdateNonCommDlrPay.PaidAmount)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid paid amount value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.RecordId)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.UniqueID)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.Customer)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.Dealer)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.DealerDBA)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.ExactAmount)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.ApprovedBy)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.Notes)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.Balance)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.PaidAmount)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.DBA)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.StartDate)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateNonCommDlrPayFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update NonComm Dealer Pay in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update NonComm Dealer Pay", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "NonComm Dealer Pay Updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "NonComm Dealer Pay Updated Successfully", http.StatusOK, nil)
}
