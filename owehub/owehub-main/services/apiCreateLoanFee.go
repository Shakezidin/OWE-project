/**************************************************************************
* File			: apiCreateLoanFee.go
* DESCRIPTION	: This file contains functions for create Loan Fee
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
 * FUNCTION:		HandleCreateLoanFeeDataRequest
 * DESCRIPTION:     handler for create Loan fee  request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateLoanFeeDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		createLoanFeeReq models.CreateLoanFee
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleCreateLoanFeeDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateLoanFeeDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create loanfee  request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create loan fee  request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createLoanFeeReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create loan fee  request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create loan fee  request", http.StatusBadRequest, nil)
		return
	}

	if (len(createLoanFeeReq.Dealer) <= 0) ||
		(len(createLoanFeeReq.Installer) <= 0) || (len(createLoanFeeReq.State) <= 0) ||
		(len(createLoanFeeReq.LoanType) <= 0) || (len(createLoanFeeReq.StartDate) <= 0) ||
		(len(createLoanFeeReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createLoanFeeReq.OweCost <= float64(0) {
		err = fmt.Errorf("Invalid owe cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid owe cost Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createLoanFeeReq.DlrMu <= float64(0) {
		err = fmt.Errorf("Invalid dlr_mu Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid dlr mu Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createLoanFeeReq.DlrCost <= float64(0) {
		err = fmt.Errorf("Invalid dlr cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid dlr cost Not Allowed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", createLoanFeeReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", createLoanFeeReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createLoanFeeReq.Dealer)
	queryParameters = append(queryParameters, createLoanFeeReq.Installer)
	queryParameters = append(queryParameters, createLoanFeeReq.State)
	queryParameters = append(queryParameters, createLoanFeeReq.LoanType)
	queryParameters = append(queryParameters, createLoanFeeReq.OweCost)
	queryParameters = append(queryParameters, createLoanFeeReq.DlrMu)
	queryParameters = append(queryParameters, createLoanFeeReq.DlrCost)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateLoanFeeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add loan fee in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create loan fee ", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "loan fee  created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "loan fee  Created Successfully", http.StatusOK, nil)
}
