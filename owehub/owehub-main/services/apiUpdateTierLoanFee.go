/**************************************************************************
* File			: apiUpdateTierLoanFee.go
* DESCRIPTION	: This file contains functions for update tier loan fee
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateTierLoanFeeRequest
 * DESCRIPTION:     handler for update Tier Loan Fee request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateTierLoanFeeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		updateTierLoanFee models.UpdateTierLoanFee
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleUpdateTierLoanFeeRequest")
	defer func() { log.ExitFn(0, "HandleUpdateTierLoanFeeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update Tier Loan Fee request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Tier Loan Fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateTierLoanFee)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Tier Loan Fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update Tier Loan Fee request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateTierLoanFee.DealerTier) <= 0) || (len(updateTierLoanFee.Installer) <= 0) ||
		(len(updateTierLoanFee.State) <= 0) || (len(updateTierLoanFee.LoanType) <= 0) ||
		(len(updateTierLoanFee.StartDate) <= 0) || (len(updateTierLoanFee.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateTierLoanFee.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateTierLoanFee.OweCost <= float64(0) {
		err = fmt.Errorf("Invalid owe cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid owe cost Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateTierLoanFee.DlrMu <= float64(0) {
		err = fmt.Errorf("Invalid dlr mu Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid dlr_mu Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateTierLoanFee.DlrCost <= float64(0) {
		err = fmt.Errorf("Invalid dlr cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid dlr cost Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", updateTierLoanFee.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date, Update failed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", updateTierLoanFee.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date, Update failed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateTierLoanFee.RecordId)
	queryParameters = append(queryParameters, updateTierLoanFee.DealerTier)
	queryParameters = append(queryParameters, updateTierLoanFee.Installer)
	queryParameters = append(queryParameters, updateTierLoanFee.State)
	queryParameters = append(queryParameters, updateTierLoanFee.LoanType)
	queryParameters = append(queryParameters, updateTierLoanFee.OweCost)
	queryParameters = append(queryParameters, updateTierLoanFee.DlrMu)
	queryParameters = append(queryParameters, updateTierLoanFee.DlrCost)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateTierLoanFeeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Tier Loan Fee in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update Tier Loan Fee", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Tier Loan Fee updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Tier Loan Fee Updated Successfully", http.StatusOK, nil)
}
