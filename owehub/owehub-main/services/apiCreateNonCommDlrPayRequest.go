/**************************************************************************
* File			: apiCreateNonCommDlrPayRequest.go
* DESCRIPTION	: This file contains functions for create NonCommDlrPay handler
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
 * FUNCTION:		HandleCreateNonCommDlrPayRequest
 * DESCRIPTION:     handler for create NonCommDlrPay request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateNonCommDlrPayRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createNonCommDlrPay models.CreateNonCommDlrPay
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleCreateNonCommDlrPayRequest")
	defer func() { log.ExitFn(0, "HandleCreateNonCommDlrPayRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create non comm dealer pay request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create non comm dealer pay request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createNonCommDlrPay)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create non comm dealer pay request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Non Comm Dealer Pay request", http.StatusBadRequest, nil)
		return
	}

	// Validate float64 fields
	if createNonCommDlrPay.Balance <= float64(0) {
		err = fmt.Errorf("Invalid balance: %f, Not Allowed", createNonCommDlrPay.Balance)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Balance Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createNonCommDlrPay.PaidAmount <= float64(0) {
		err = fmt.Errorf("Invalid paid amount value: %f, Not Allowed", createNonCommDlrPay.PaidAmount)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Paid Amount value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Validate string fields
	if len(createNonCommDlrPay.UniqueID) <= 0 ||
		len(createNonCommDlrPay.Customer) <= 0 ||
		len(createNonCommDlrPay.DealerName) <= 0 ||
		len(createNonCommDlrPay.DealerDBA) <= 0 ||
		len(createNonCommDlrPay.ExactAmount) <= 0 ||
		len(createNonCommDlrPay.ApprovedBy) <= 0 ||
		len(createNonCommDlrPay.Notes) <= 0 ||
		len(createNonCommDlrPay.DBA) <= 0 ||
		len(createNonCommDlrPay.StartDate) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createNonCommDlrPay.UniqueID)
	queryParameters = append(queryParameters, createNonCommDlrPay.Customer)
	queryParameters = append(queryParameters, createNonCommDlrPay.DealerName)
	queryParameters = append(queryParameters, createNonCommDlrPay.DealerDBA)
	queryParameters = append(queryParameters, createNonCommDlrPay.ExactAmount)
	queryParameters = append(queryParameters, createNonCommDlrPay.ApprovedBy)
	queryParameters = append(queryParameters, createNonCommDlrPay.Notes)
	queryParameters = append(queryParameters, createNonCommDlrPay.Balance)
	queryParameters = append(queryParameters, createNonCommDlrPay.PaidAmount)
	queryParameters = append(queryParameters, createNonCommDlrPay.DBA)
	queryParameters = append(queryParameters, createNonCommDlrPay.StartDate)
	queryParameters = append(queryParameters, createNonCommDlrPay.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateNonCommDlrPayFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add non comm dealer pay in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Non Comm Dealer Pay", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New non comm dealer pay created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Non Comm Dealer Pay Created Successfully", http.StatusOK, nil)
}
