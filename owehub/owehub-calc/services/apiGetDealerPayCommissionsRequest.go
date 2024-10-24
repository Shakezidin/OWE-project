/**************************************************************************
 * File       	   : apiGetDealerPayCommissionsRequest.go
 * DESCRIPTION     : This file contains functions to get Dealer pay commissions data
 * DATE            : 10-Oct-2024
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
		 err = fmt.Errorf("HTTP Request body is null in get dealer pay commissions data request")
		 log.FuncErrorTrace(0, "%v", err)
		 appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		 return
	 }
 
	 reqBody, err := ioutil.ReadAll(req.Body)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer pay commissions data request err: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		 return
	 }
 
	 err = json.Unmarshal(reqBody, &dataReq)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to unmarshal get dealer pay commissions data request err: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer pay commissions data Request body", http.StatusBadRequest, nil)
		 return
	 }
 
	 // Calculate pagination
	 offset := (dataReq.PageNumber - 1) * dataReq.PageSize
	 query := `SELECT home_owner, current_status, unique_id, dealer_code, 
				today, amount, sys_size, rl, contract_dol_dol, loan_fee, 
				epc, net_epc, other_adders, credit, rep_1, rep_2, 
				setter, draw_amt, amt_paid, balance, st, contract_date 
				FROM dealer_pay 
				LIMIT $1 OFFSET $2`
 
	 
	 data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dataReq.PageSize, offset})
 
	 if err != nil || len(data) <= 0 {
		 log.FuncErrorTrace(0, "Failed to get dealer pay commissions from DB err: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to get dealer pay commissions from DB", http.StatusBadRequest, nil)
		 return
	 }
 
	 for _, item := range data {
		 var dlrPay models.DealerPayReportResponse
 
		 // Populate the DealerPayReportResponse struct with values from the database
		 dlrPay.Home_Owner = item["home_owner"].(string)
		 dlrPay.Current_Status = item["current_status"].(string)
		 dlrPay.Unique_ID = item["unique_id"].(string)
		 dlrPay.Dealer_Code = item["dealer_code"].(string)
		 dlrPay.Today = item["today"].(time.Time)
		 dlrPay.Amount = item["amount"].(float64)
		 dlrPay.Sys_Size = item["sys_size"].(string) 
		 dlrPay.RL = item["rl"].(string)           git 
		 dlrPay.Contract = item["contract_dol_dol"].(string)
		 dlrPay.Loan_Fee = item["loan_fee"].(string)
		 dlrPay.EPC = item["epc"].(string)
		 dlrPay.Net_EPC = item["net_epc"].(string)
		 dlrPay.Other_Adders = item["other_adders"].(string)
		 dlrPay.Credit = item["credit"].(string)
		 dlrPay.Rep1 = item["rep_1"].(string)
		 dlrPay.Rep2 = item["rep_2"].(string)
		 dlrPay.Setter = item["setter"].(string)
		 dlrPay.Draw_Amt = item["draw_amt"].(float64)
		 dlrPay.Amt_Paid = item["amt_paid"].(float64)
		 dlrPay.Balance = item["balance"].(string) 
		 dlrPay.ST = item["st"].(string)
		 dlrPay.Contract_Date = item["contract_date"].(time.Time)
 
		 // Append the populated struct to the response
		 dlsPayCommResp.DealerPayComm = append(dlsPayCommResp.DealerPayComm, dlrPay)
	 }
 
	 RecordCount = len(dlsPayCommResp.DealerPayComm)
 
	//  dlsPayCommResp.AmountPrepaid = 200.55 
	//  dlsPayCommResp.AmountPrepaidPer = 123 
	//  dlsPayCommResp.Pipeline_Remaining = 356 
	//  dlsPayCommResp.Pipeline_RemainingPer = 368 
	//  dlsPayCommResp.Current_Due = 658       			
	//  dlsPayCommResp.Current_Due_Per = 698  
 
	 // Send the response
	 log.FuncInfoTrace(0, "Number of dealer pay commissions fetched: %v, data: %+v", RecordCount, dlsPayCommResp)
	 appserver.FormAndSendHttpResp(resp, "Dealer pay commissions data", http.StatusOK, dlsPayCommResp.DealerPayComm, int64(RecordCount))
 }
 