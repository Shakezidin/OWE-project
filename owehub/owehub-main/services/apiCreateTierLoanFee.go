/**************************************************************************
* File			: apiCreateTierLoanFee.go
* DESCRIPTION	: This file contains functions for create tier loan fee handler
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
		err = fmt.Errorf("HTTP Request body is null in create tier loan fee request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create tier loan fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createTierLoanFee)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create tier loan fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create tier loan fee request", http.StatusBadRequest, nil)
		return
	}

	if (len(createTierLoanFee.DealerTier) <= 0) || (len(createTierLoanFee.Installer) <= 0) ||
		(len(createTierLoanFee.State) <= 0) || (len(createTierLoanFee.LoanType) <= 0) ||
		(len(createTierLoanFee.StartDate) <= 0) || (len(createTierLoanFee.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createTierLoanFee.OweCost <= float64(0) {
		err = fmt.Errorf("Invalid owe cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid owe cost Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createTierLoanFee.DlrMu <= float64(0) {
		err = fmt.Errorf("Invalid dlr_mu Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid dlr)mu Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createTierLoanFee.DlrCost <= float64(0) {
		err = fmt.Errorf("Invalid dlr cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid dlr cost Not Allowed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", createTierLoanFee.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", createTierLoanFee.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createTierLoanFee.DealerTier)
	queryParameters = append(queryParameters, createTierLoanFee.Installer)
	queryParameters = append(queryParameters, createTierLoanFee.State)
	queryParameters = append(queryParameters, createTierLoanFee.LoanType)
	queryParameters = append(queryParameters, createTierLoanFee.OweCost)
	queryParameters = append(queryParameters, createTierLoanFee.DlrMu)
	queryParameters = append(queryParameters, createTierLoanFee.DlrCost)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateTierLoanFeeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add tier loan fee in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Tier Loan Fee", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "tier loan fee created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Tier Loan Fee Created Successfully", http.StatusOK, nil)
}
