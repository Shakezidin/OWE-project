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
	"strings"
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
		err             error
		dataReq         models.GetDealerPay
		data            []map[string]interface{}
		whereEleList    []interface{}
		query           string
		queryForAlldata string
		filter          string
		RecordCount     int64
		queryWithFiler  string
		filter2         string
		aurguments      string
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

	dateFormat := "2006-01-02"
	if dataReq.UseCutoff == "YES" {
		parsedDate, err := time.Parse(dateFormat, dataReq.PayRollEndDate)
		if err != nil {
			fmt.Println("Error parsing date:", err)
			return
		}

		adjustedDate := parsedDate.AddDate(0, 0, -5)

		dataReq.PayRollEndDate = adjustedDate.Format(dateFormat)
	}

	tableName := db.TableName_DLR_PAY_APCALC
	if dataReq.DealerName == "ALL" {
		query = `SELECT unique_id, home_owner, current_status, status_date, dealer, type, amount, sys_size, rl, contract_$$, 
			loan_fee, epc, net_epc, other_adders, credit, rep_1, rep_2, rep_pay, net_rev, draw_amt, amt_paid, balance, st, 
			contract_date, commission_model FROM dlr_pay_pr_data dlrpay WHERE dlrpay.dealer NOT IN ('HOUSE')`
		aurguments = " AND commission_model = $1 ORDER BY $2"
		filter = PrepareDealerPayFilters(tableName, dataReq, false)
		whereEleList = append(whereEleList, dataReq.CommissionModel, dataReq.SortBy)
	} else {
		query = `SELECT unique_id, home_owner, current_status, status_date, dealer, type, amount, sys_size, rl, contract_$$, 
			loan_fee, epc, net_epc, other_adders, credit, rep_1, rep_2, rep_pay, net_rev, draw_amt, amt_paid, balance, st, 
			contract_date, commission_model FROM dlr_pay_pr_data dlrpay`
		aurguments = " WHERE dlrpay.dealer = $1 AND commission_model = $2 ORDER BY $3"
		filter = PrepareDealerPayFilters(tableName, dataReq, false)
		whereEleList = append(whereEleList, dataReq.DealerName, dataReq.CommissionModel, dataReq.SortBy)
	}

	if filter != "" {
		queryWithFiler = query + aurguments + filter
	}
	log.FuncErrorTrace(0, queryWithFiler)
	// Append sorting and pagination filters
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer pay data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get dealer pay data from DB", http.StatusBadRequest, nil)
		return
	}

	dealerpayDataList := models.GetDealerPayPRDataList{}

	for _, item := range data {
		// UniqueId
		UniqueId, uniqueIdok := item["unique_id"].(string)
		if !uniqueIdok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", UniqueId, item)
			UniqueId = ""
		}

		HomeOwner, homeOwnerok := item["home_owner"].(string)
		if !homeOwnerok {
			log.FuncErrorTrace(0, "Failed to get home owner for Record ID %v. Item: %+v\n", UniqueId, item)
			// continue
		}

		// CurrentStatus
		CurrentStatus, currentStatusok := item["current_status"].(string)
		if !currentStatusok || CurrentStatus == "" {
			log.FuncErrorTrace(0, "Failed to get current status for Record ID %v. Item: %+v\n", UniqueId, item)
			CurrentStatus = ""
		}

		// StatusDate
		StatusDate, statusDateok := item["status_date"].(time.Time)
		if !statusDateok {
			log.FuncErrorTrace(0, "Failed to get status date for Record ID %v. Item: %+v\n", UniqueId, item)
			StatusDate = time.Time{}
		}

		// Dealer
		Dealer, dealerok := item["dealer"].(string)
		if !dealerok || Dealer == "" {
			log.FuncErrorTrace(0, "Failed to get Dealer for Record ID %v. Item: %+v\n", UniqueId, item)
			Dealer = ""
		}

		// DBA
		DBA, dbaok := item["dealer_dba"].(string)
		if !dbaok || DBA == "" {
			log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", UniqueId, item)
			DBA = ""
		}

		// PaymentType
		PaymentType, paymentTypeok := item["type"].(string)
		if !paymentTypeok || PaymentType == "" {
			log.FuncErrorTrace(0, "Failed to get payment type for Record ID %v. Item: %+v\n", UniqueId, item)
			PaymentType = ""
		}

		// Today
		Today, todayok := item["today"].(time.Time)
		if !todayok {
			log.FuncErrorTrace(0, "Failed to get today for Record ID %v. Item: %+v\n", UniqueId, item)
			Today = time.Time{}
		}
		// FinanceType
		FinanceType, FinanceTypeok := item["finace_type"].(string)
		if !FinanceTypeok || FinanceType == "" {
			log.FuncErrorTrace(0, "Failed to get finance type for Record ID %v. Item: %+v\n", UniqueId, item)
			FinanceType = ""
		}

		// Amount
		Amount, Amountok := item["amount"].(float64)
		if !Amountok {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", UniqueId, item)
			Amount = 0
		}

		// PermitMax
		SysSize, sysSizeok := item["sys_size"].(float64)
		if !sysSizeok {
			log.FuncErrorTrace(0, "Failed to get sys_size for Record ID %v. Item: %+v\n", UniqueId, item)
			SysSize = 0.0
		}

		// Rl
		Rl, ok := item["rl"].(float64)
		if !ok {
			Rl = 0.0 // or another default value if appropriate
		}

		// ContractValue
		ContractValue, contractValueok := item["contract_$$"].(float64)
		if !contractValueok {
			log.FuncErrorTrace(0, "Failed to get contract value for Record ID %v. Item: %+v\n", UniqueId, item)
			ContractValue = 0
		}

		// LoanFee
		LoanFee, loanFeeok := item["loan_fee"].(float64)
		if !loanFeeok {
			log.FuncErrorTrace(0, "Failed to get loan fee for Record ID %v. Item: %+v\n", UniqueId, item)
			LoanFee = 0
		}

		// Epc
		Epc, epcok := item["epc"].(float64)
		if !epcok {
			log.FuncErrorTrace(0, "Failed to get epc for Record ID %v. Item: %+v\n", UniqueId, item)
			Epc = 0.0
		}

		// NetEpc
		NetEpc, netEpcok := item["net_epc"].(float64)
		if !netEpcok || NetEpc == 0.0 {
			log.FuncErrorTrace(0, "Failed to get net epc for Record ID %v. Item: %+v\n", UniqueId, item)
			NetEpc = 0.0
		}

		// OtherAdders
		OtherAdders, otherAdderok := item["other_adders"].(float64)
		if !otherAdderok || OtherAdders == 0.0 {
			log.FuncErrorTrace(0, "Failed to get other adders for Record ID %v. Item: %+v\n", UniqueId, item)
			OtherAdders = 0.0
		}

		// Credit
		Credit, creditok := item["credit"].(float64)
		if !creditok || Credit == 0.0 {
			log.FuncErrorTrace(0, "Failed to get Credit for Record ID %v. Item: %+v\n", UniqueId, item)
			Credit = 0.0
		}

		// Rep1
		Rep1, rep1ok := item["rep_1"].(string)
		if !rep1ok || Rep1 == "" {
			log.FuncErrorTrace(0, "Failed to get rep1 for Record ID %v. Item: %+v\n", UniqueId, item)
			Rep1 = ""
		}

		// Rep2
		Rep2, rep2ok := item["rep_2"].(string)
		if !rep2ok || Rep2 == "" {
			log.FuncErrorTrace(0, "Failed to get rep2 for Record ID %v. Item: %+v\n", UniqueId, item)
			Rep2 = ""
		}

		// repPay
		repPay, repPayok := item["rep_pay"].(float64)
		if !repPayok || repPay == 0.0 {
			log.FuncErrorTrace(0, "Failed to get rep pay for Record ID %v. Item: %+v\n", UniqueId, item)
			repPay = 0.0
		}

		// NetRev
		NetRev, netRevOk := item["net_rev"].(float64)
		if !netRevOk || NetRev == 0.0 {
			log.FuncErrorTrace(0, "Failed to get NetRev for Record ID %v. Item: %+v\n", UniqueId, item)
			NetRev = 0.0
		}

		// DrawAmt
		DrawAmt, drawAmtok := item["draw_amt"].(float64)
		if !drawAmtok || DrawAmt == 0.0 {
			log.FuncErrorTrace(0, "Failed to get draw amount for Record ID %v. Item: %+v\n", UniqueId, item)
			DrawAmt = 0.0
		}

		// AmtPaid
		AmtPaid, amtPaidok := item["amt_paid"].(float64)
		if !amtPaidok || AmtPaid == 0.0 {
			log.FuncErrorTrace(0, "Failed to get amount paid for Record ID %v. Item: %+v\n", UniqueId, item)
			AmtPaid = 0.0
		}

		// Balance
		Balance, balanceok := item["balance"].(float64)
		if !balanceok || Balance == 0.0 {
			log.FuncErrorTrace(0, "Failed to get Balance for Record ID %v. Item: %+v\n", UniqueId, item)
			Balance = 0.0
		}

		// State
		State, stateok := item["st"].(string)
		if !stateok || State == "" {
			log.FuncErrorTrace(0, "Failed to get State for Record ID %v. Item: %+v\n", UniqueId, item)
			State = ""
		}

		// ContractDate
		ContractDate, contractDateok := item["contract_date"].(time.Time)
		if !contractDateok {
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

	filter2 = PrepareDealerPayFilters(tableName, dataReq, true)
	if filter2 != "" {
		queryForAlldata = query + filter2
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get dealer credit data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of ar data List fetched : %v list %+v", len(dealerpayDataList.DealerPayList), dealerpayDataList)
	FormAndSendHttpResp(resp, "Ar  Data", http.StatusOK, dealerpayDataList, RecordCount)
}

func PrepareDealerPayFilters(tableName string, dataFilter models.GetDealerPay, forDataCount bool) (filters string) {
	log.EnterFn(0, "PrepareDealerCreditFilters")
	defer func() { log.ExitFn(0, "PrepareDealerCreditFilters", nil) }()

	var filtersBuilder strings.Builder

	if forDataCount {
		filtersBuilder.WriteString(" GROUP BY unique_id, home_owner, current_status, status_date, dealer, type, amount, sys_size, rl, contract_$$, loan_fee, epc, net_epc, other_adders, credit, rep_1, rep_2, rep_pay, net_rev, draw_amt, amt_paid, balance, st, contract_date, commission_model")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters
}
