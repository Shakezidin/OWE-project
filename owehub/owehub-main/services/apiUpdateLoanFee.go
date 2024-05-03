/**************************************************************************
* File			: apiUpdateLoanFee.go
* DESCRIPTION	: This file contains functions for update loan fee
						setter handler
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
 * FUNCTION:		HandleUpdateLoanFeeDataRequest
 * DESCRIPTION:     handler for Update Loan fee request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateLoanFeeDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		UpdateLoanFeeReq models.UpdateLoanFee
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleUpdateLoanFeeDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLoanFeeDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update loan fee request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update loan fee request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateLoanFeeReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update loan fee request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update loan fee request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateLoanFeeReq.UniqueID) <= 0) || (len(UpdateLoanFeeReq.Dealer) <= 0) ||
		(len(UpdateLoanFeeReq.Installer) <= 0) || (len(UpdateLoanFeeReq.State) <= 0) ||
		(len(UpdateLoanFeeReq.LoanType) <= 0) || (len(UpdateLoanFeeReq.DlrMu) <= 0) ||
		(len(UpdateLoanFeeReq.DlrCost) <= 0) || (len(UpdateLoanFeeReq.StartDate) <= 0) ||
		(len(UpdateLoanFeeReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLoanFeeReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Updated failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLoanFeeReq.OweCost <= float64(0) {
		err = fmt.Errorf("Invalid owe cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid owe cost Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateLoanFeeReq.RecordId)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.UniqueID)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.Dealer)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.Installer)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.State)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.LoanType)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.OweCost)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.DlrMu)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.DlrCost)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.StartDate)
	queryParameters = append(queryParameters, UpdateLoanFeeReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateLoanFeeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update loan fee in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update loan fee ", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "loan fee  updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Loan Fee Updated Successfully", http.StatusOK, nil)
}
