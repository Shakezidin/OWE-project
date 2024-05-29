/**************************************************************************
 * File       	   : apiGetArDataFromView.go
 * DESCRIPTION     : This file contains functions for get ApptSetters data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
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
 * FUNCTION:		GetARDataFromView
 * DESCRIPTION:     handler for get ApptSetters data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetDealerPayDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetDealerPay
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		// filter string
		// RecordCount     int64
	)

	log.EnterFn(0, "GetARDataFromView")
	defer func() { log.ExitFn(0, "GetARDataFromView", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ar data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ar data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get ar data Request body", http.StatusBadRequest, nil)
		return
	}

	if dataReq.PayRollStartDate == "" || dataReq.PayRollEndDate == "" || dataReq.UseCutoff == "" || dataReq.DealerName == "" {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if dataReq.DealerName == "HOUSE" {
		log.FuncInfoTrace(0, "dealername is House, So function retun with a message ")
		FormAndSendHttpResp(resp, "'HOUSE' dealer is currently filtered from this report", http.StatusOK, nil)
		return
	}

	if dataReq.UseCutoff == "YES" {
		dateFormat := "2006-01-02"
		parsedDate, err := time.Parse(dateFormat, dataReq.PayRollEndDate)
		if err != nil {
			fmt.Println("Error parsing date:", err)
			return
		}

		adjustedDate := parsedDate.AddDate(0, 0, -5)

		dataReq.PayRollEndDate = adjustedDate.Format(dateFormat)
	}
	if dataReq.DealerName == "ALL" {
		query = `SELECT * FROM dlr_pay_pr_data dlrpay WHERE dlrpay.Dealer NOT in('HOUSE') AND dlrpay.Status_Date >= $1 AND dlrpay.Status_Date <= $2 ORDER BY $3 ASC`
		whereEleList = append(whereEleList, dataReq.PayRollStartDate)
		whereEleList = append(whereEleList, dataReq.PayRollEndDate)
		whereEleList = append(whereEleList, dataReq.SortBy)
	} else {
		query = `SELECT * FROM dlr_pay_pr_data dlrpay WHERE dlrpay.Dealer = $1 AND dlrpay.Status_Date >= $2 AND dlrpay.Status_Date <= $3 ORDER BY $4 ASC`
		whereEleList = append(whereEleList, dataReq.DealerName)
		whereEleList = append(whereEleList, dataReq.PayRollStartDate)
		whereEleList = append(whereEleList, dataReq.PayRollEndDate)
		whereEleList = append(whereEleList, dataReq.SortBy)
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer pay data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get dealer pay data from DB", http.StatusBadRequest, nil)
		return
	}

	dealerpayDataList := models.GetDealerPayPRDataList{}

	for _, item := range data {
		// UniqueId
		UniqueId, ok := item["Unique_ID"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", UniqueId, item)
			UniqueId = ""
		}

		HomeOwner, ok := item["Home_Owne"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get home owner for Record ID %v. Item: %+v\n", UniqueId, item)
			continue
		}

		// CurrentStatus
		CurrentStatus, ok := item["Current_Status"].(string)
		if !ok || CurrentStatus == "" {
			log.FuncErrorTrace(0, "Failed to get current status for Record ID %v. Item: %+v\n", UniqueId, item)
			CurrentStatus = ""
		}

		// StatusDate
		StatusDate, ok := item["Status_Date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get status date for Record ID %v. Item: %+v\n", UniqueId, item)
			StatusDate = time.Time{}
		}

		// Dealer
		Dealer, ok := item["Dealer"].(string)
		if !ok || Dealer == "" {
			log.FuncErrorTrace(0, "Failed to get Dealer for Record ID %v. Item: %+v\n", UniqueId, item)
			Dealer = ""
		}

		// DBA
		DBA, ok := item["DBA"].(string)
		if !ok || DBA == "" {
			log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", UniqueId, item)
			DBA = ""
		}

		// PaymentType
		PaymentType, ok := item["Payment_Type"].(string)
		if !ok || PaymentType == "" {
			log.FuncErrorTrace(0, "Failed to get payment type for Record ID %v. Item: %+v\n", UniqueId, item)
			PaymentType = ""
		}

		// FinanceType
		FinanceType, ok := item["Finace_Type"].(string)
		if !ok || FinanceType == "" {
			log.FuncErrorTrace(0, "Failed to get finance type for Record ID %v. Item: %+v\n", UniqueId, item)
			FinanceType = ""
		}

		// Today
		Today, ok := item["Today"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get today for Record ID %v. Item: %+v\n", UniqueId, item)
			Today = time.Time{}
		}

		// Amount
		Amount, ok := item["Amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", UniqueId, item)
			Amount = 0
		}

		// PermitMax
		SysSize, ok := item["Sys_Size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys_size for Record ID %v. Item: %+v\n", UniqueId, item)
			SysSize = 0.0
		}

		// ContractValue
		ContractValue, ok := item["Contract_Value"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get contract value for Record ID %v. Item: %+v\n", UniqueId, item)
			ContractValue = 0
		}

		// LoanFee
		LoanFee, ok := item["Loan_Fee"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get loan fee for Record ID %v. Item: %+v\n", UniqueId, item)
			LoanFee = 0
		}

		// OtherAdders
		OtherAdders, ok := item["Other_Adders"].(float64)
		if !ok || OtherAdders == 0.0 {
			log.FuncErrorTrace(0, "Failed to get other adders for Record ID %v. Item: %+v\n", UniqueId, item)
			OtherAdders = 0.0
		}

		// Epc
		Epc, ok := item["EPC"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get epc for Record ID %v. Item: %+v\n", UniqueId, item)
			Epc = 0.0
		}

		// NetEpc
		NetEpc, ok := item["Net_EPC"].(float64)
		if !ok || NetEpc == 0.0 {
			log.FuncErrorTrace(0, "Failed to get net epc for Record ID %v. Item: %+v\n", UniqueId, item)
			NetEpc = 0.0
		}

		// Rl
		Rl, ok := item["RL"].(float64)
		if !ok || Rl == 0.0 {
			log.FuncErrorTrace(0, "Failed to get Rl for Record ID %v. Item: %+v\n", UniqueId, item)
			Rl = 0.0
		}

		// Credit
		Credit, ok := item["Credit"].(float64)
		if !ok || Credit == 0.0 {
			log.FuncErrorTrace(0, "Failed to get Credit for Record ID %v. Item: %+v\n", UniqueId, item)
			Credit = 0.0
		}

		// Rep1
		Rep1, ok := item["Rep1"].(string)
		if !ok || Rep1 == "" {
			log.FuncErrorTrace(0, "Failed to get rep1 for Record ID %v. Item: %+v\n", UniqueId, item)
			Rep1 = ""
		}

		// Rep2
		Rep2, ok := item["Rep2"].(string)
		if !ok || Rep2 == "" {
			log.FuncErrorTrace(0, "Failed to get rep2 for Record ID %v. Item: %+v\n", UniqueId, item)
			Rep2 = ""
		}

		// repPay
		repPay, ok := item["Rep_Pay"].(float64)
		if !ok || repPay == 0.0 {
			log.FuncErrorTrace(0, "Failed to get rep pay for Record ID %v. Item: %+v\n", UniqueId, item)
			Rl = 0.0
		}

		// NetRev
		NetRev, ok := item["Net_Rev"].(float64)
		if !ok || NetRev == 0.0 {
			log.FuncErrorTrace(0, "Failed to get NetRev for Record ID %v. Item: %+v\n", UniqueId, item)
			NetRev = 0.0
		}

		// DrawAmt
		DrawAmt, ok := item["Draw_Amt"].(float64)
		if !ok || DrawAmt == 0.0 {
			log.FuncErrorTrace(0, "Failed to get draw amount for Record ID %v. Item: %+v\n", UniqueId, item)
			DrawAmt = 0.0
		}

		// AmtPaid
		AmtPaid, ok := item["Amt_Paid"].(float64)
		if !ok || AmtPaid == 0.0 {
			log.FuncErrorTrace(0, "Failed to get amount paid for Record ID %v. Item: %+v\n", UniqueId, item)
			AmtPaid = 0.0
		}

		// Balance
		Balance, ok := item["Balance"].(float64)
		if !ok || Balance == 0.0 {
			log.FuncErrorTrace(0, "Failed to get Balance for Record ID %v. Item: %+v\n", UniqueId, item)
			Balance = 0.0
		}

		// State
		State, ok := item["ST"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get State for Record ID %v. Item: %+v\n", UniqueId, item)
			State = ""
		}

		// ContractDate
		ContractDate, ok := item["Contract_Date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get ContractDate for Record ID %v. Item: %+v\n", UniqueId, item)
			ContractDate = time.Time{}
		}

		StatusDateStr := StatusDate.Format("2006-01-02")
		TodayStr := Today.Format("2006-01-02")
		ContractDateStr := ContractDate.Format("2006-01-02")

		dealerpayData := models.GetDealerPayPRData{
			Home_owner:    HomeOwner,
			CurrentStatus: CurrentStatus,
			StatusDate:    StatusDateStr,
			UniqueId:      UniqueId,
			Dealer:        Dealer,
			DBA:           DBA,
			PaymentType:   PaymentType,
			FinanceType:   FinanceType,
			Today:         TodayStr,
			Amount:        Amount,
			SysSize:       SysSize,
			ContractValue: ContractValue,
			LoanFee:       LoanFee,
			OtherAdders:   OtherAdders,
			Epc:           Epc,
			NetEpc:        NetEpc,
			RL:            Rl,
			Credit:        Credit,
			Rep1:          Rep1,
			Rep2:          Rep2,
			RepPay:        repPay,
			NetRev:        NetRev,
			DrawAmt:       DrawAmt,
			AmtPaid:       AmtPaid,
			Balance:       Balance,
			St:            State,
			ContractDate:  ContractDateStr,
		}
		dealerpayDataList.DealerPayList = append(dealerpayDataList.DealerPayList, dealerpayData)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of ar data List fetched : %v list %+v", len(dealerpayDataList.DealerPayList), dealerpayDataList)
	FormAndSendHttpResp(resp, "Ar  Data", http.StatusOK, dealerpayDataList)
}
