/**************************************************************************
* File			: apiUpdateNonCommDlrPayRequest.go
* DESCRIPTION	: This file contains functions for Update non comm dlrpay handler
* DATE			: 25-Apr-2024
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
 * FUNCTION:		HandleUpdateNonCommDlrPayRequest
 * DESCRIPTION:     handler for Update non comm dlrpay request
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
		err = fmt.Errorf("HTTP Request body is null in update non comm dealer pay request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update non comm dealer pay request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateNonCommDlrPay)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update non comm dealer pay request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update non comm dealer pay request", http.StatusBadRequest, nil)
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
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Validate float64 fields
	if UpdateNonCommDlrPay.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id: %f, Not Allowed", UpdateNonCommDlrPay.Balance)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Validate float64 fields
	if UpdateNonCommDlrPay.Balance <= float64(0) {
		err = fmt.Errorf("Invalid balance value: %f, Not Allowed", UpdateNonCommDlrPay.Balance)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Balance value Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateNonCommDlrPay.PaidAmount <= float64(0) {
		err = fmt.Errorf("Invalid paid amount value: %f, Not Allowed", UpdateNonCommDlrPay.PaidAmount)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Paid Amount value Not Allowed, Update failed", http.StatusBadRequest, nil)
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
		log.FuncErrorTrace(0, "Failed to update non comm dealer pay in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update non comm dealer pay", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "non comm dealer pay Updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Non Comm Dealer Pay Updated Successfully", http.StatusOK, nil)
}
