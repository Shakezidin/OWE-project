/**************************************************************************
* File			: apiCreateTierLoanFee.go
* DESCRIPTION	: This file contains functions for create tier loan fee
						setter handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleCreateTierLoanFeeRequest
 * DESCRIPTION:     handler for create Tier Loan Fee request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateTierLoanFeeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		createTierLoanFee models.CreateTierLoanFee
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleCreateTierLoanFeeRequest")
	defer func() { log.ExitFn(0, "HandleCreateTierLoanFeeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create Tier Loan Fee request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Tier Loan Fee request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createTierLoanFee)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Tier Loan Fee request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Tier Loan Fee request", http.StatusBadRequest, nil)
		return
	}

	if (len(createTierLoanFee.DealerTier) <= 0) || (len(createTierLoanFee.Installer) <= 0) ||
		(len(createTierLoanFee.State) <= 0) || (len(createTierLoanFee.FinanceType) <= 0) ||
		(len(createTierLoanFee.OweCost) <= 0) || (len(createTierLoanFee.DlrMu) <= 0) ||
		(len(createTierLoanFee.DlrCost) <= 0) || (len(createTierLoanFee.StartDate) <= 0) ||
		(len(createTierLoanFee.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createTierLoanFee.DealerTier)
	queryParameters = append(queryParameters, createTierLoanFee.Installer)
	queryParameters = append(queryParameters, createTierLoanFee.State)
	queryParameters = append(queryParameters, createTierLoanFee.FinanceType)
	queryParameters = append(queryParameters, createTierLoanFee.OweCost)
	queryParameters = append(queryParameters, createTierLoanFee.DlrMu)
	queryParameters = append(queryParameters, createTierLoanFee.DlrCost)
	queryParameters = append(queryParameters, createTierLoanFee.StartDate)
	queryParameters = append(queryParameters, createTierLoanFee.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateTierLoanFeeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Tier Loan Fee in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Tier Loan Fee", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Tier Loan Fee created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Tier Loan Fee Created Sucessfully", http.StatusOK, nil)
}
