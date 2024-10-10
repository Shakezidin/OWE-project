/**************************************************************************
 * File       	   : apiGetDealerPayCommissionsRequest.go
 * DESCRIPTION     : This file contains functions to get Dealer pay commissions data
 * DATE            : 10-Oct-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetDealerPayCommissionsRequest
 * DESCRIPTION:     handler for get Dealer pay commissions data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDealerPayCommissionsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.DealerPayReportRequest
		RecordCount    int
		dlsPayCommResp models.DealerPayCommissions
	)

	log.EnterFn(0, "HandleGetDealerPayCommissionsRequest")
	defer func() { log.ExitFn(0, "HandleGetDealerPayCommissionsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dealerpay commissions data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealerpay commissions data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealerpay commissions data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealerpay commissions data Request body", http.StatusBadRequest, nil)
		return
	}
	var dlrPay models.DealerPayReportResponse

	dlrPay.Home_Owner = "TestHomeOwner"
	dlrPay.Current_Status = "TestStatus"
	dlrPay.Unique_ID = "OUR12345"
	dlrPay.Dealer_Code = "TestDealer"
	dlrPay.Sys_Size = "TestSysSize"
	dlrPay.Contract = "TestContract"
	dlrPay.Other_Adders = "TestOtherAdders"
	dlrPay.Rep1 = "TestRep1"
	dlrPay.Rep2 = "TestRep2"
	dlrPay.Setter = "TestSetter"
	dlrPay.ST = "TestState"
	dlrPay.Contract_Date = time.Now()
	dlrPay.Loan_Fee = "TesLoanFee"
	dlrPay.Net_EPC = "TestNetEPC"
	dlrPay.Credit = "TestCredit"
	dlrPay.Draw_Amt = 10.10
	dlrPay.RL = "TestRL"
	dlrPay.Type = "TestType"
	dlrPay.Today = time.Now()
	dlrPay.Amount = 50.50
	dlrPay.EPC = "TestEPC"
	dlrPay.Amt_Paid = 10.100
	dlrPay.Balance = "TestBalance"

	dlsPayCommResp.DealerPayComm = append(dlsPayCommResp.DealerPayComm, dlrPay)
	RecordCount = len(dlsPayCommResp.DealerPayComm)

	// Send the response
	log.FuncInfoTrace(0, "Number of dealerpay commissions List fetched : %v list %+v", len(dlsPayCommResp.DealerPayComm), dlsPayCommResp.DealerPaymentsData)
	appserver.FormAndSendHttpResp(resp, "Dealerpay commissions Data", http.StatusOK, dlsPayCommResp.DealerPayComm, int64(RecordCount))
}
