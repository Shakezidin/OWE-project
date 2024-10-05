/**************************************************************************
 * File       	   : apiGetArDataFromView.go
 * DESCRIPTION     : This file contains functions for get ApptSetters data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
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
		orderby         string
		offset          string
	)

	log.EnterFn(0, "GetARDataFromView")
	defer func() { log.ExitFn(0, "GetARDataFromView", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ar data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ar data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get ar data Request body", http.StatusBadRequest, nil)
		return
	}

	if dataReq.PayRollStartDate == "" || dataReq.PayRollEndDate == "" || dataReq.UseCutoff == "" || dataReq.DealerName == "" {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if dataReq.DealerName == "HOUSE" {
		log.FuncInfoTrace(0, "dealername is House, So function retun with a message ")
		appserver.FormAndSendHttpResp(resp, "'HOUSE' dealer is currently filtered from this report", http.StatusOK, nil)
		return
	}

	// dateFormat := "2006-01-02"
	// if dataReq.UseCutoff == "YES" {
	// 	parsedDate, err := time.Parse(dateFormat, dataReq.PayRollEndDate)
	// 	if err != nil {
	// 		fmt.Println("Error parsing date:", err)
	// 		return
	// 	}

	// 	adjustedDate := parsedDate.AddDate(0, 0, -5)

	// 	dataReq.PayRollEndDate = adjustedDate.Format(dateFormat)
	// }

	tableName := db.TableName_DLR_PAY_APCALC
	if dataReq.DealerName == "ALL" {
		query = fmt.Sprintf("SELECT unique_id, home_owner, current_status, status_date, dealer, type, amount, sys_size, rl, contract_$$, loan_fee, epc, net_epc, other_adders, credit, rep_1, rep_2, rep_pay, net_rev, draw_amt, amt_paid, balance, st, contract_date, commission_model FROM dlr_pay_pr_data dlrpay WHERE dlrpay.dealer NOT IN ('HOUSE')")
		if dataReq.CommissionModel != "ALL" {
			query += fmt.Sprintf(" AND commission_model = '%v'", dataReq.CommissionModel)
		}
		filter, whereEleList = PrepareDealerPayFilters(tableName, dataReq, false, false)
		orderby = fmt.Sprintf(" ORDER BY %v", dataReq.SortBy)
		offset, _ = PrepareDealerPayFilters(tableName, dataReq, false, true)
	} else {
		query = fmt.Sprintf("SELECT unique_id, home_owner, current_status, status_date, dealer, type, amount, sys_size, rl, contract_$$, loan_fee, epc, net_epc, other_adders, credit, rep_1, rep_2, rep_pay, net_rev, draw_amt, amt_paid, balance, st, contract_date, commission_model FROM dlr_pay_pr_data dlrpay WHERE dlrpay.dealer = '%v'", dataReq.DealerName)
		if dataReq.CommissionModel != "ALL" {
			query += fmt.Sprintf(" AND commission_model = '%v'", dataReq.CommissionModel)
		}
		filter, whereEleList = PrepareDealerPayFilters(tableName, dataReq, false, false)
		orderby = fmt.Sprintf(" ORDER BY %v", dataReq.SortBy)
		offset, _ = PrepareDealerPayFilters(tableName, dataReq, false, true)
	}

	if filter != "" {
		queryWithFiler = query + filter + orderby + offset
	} else {
		queryWithFiler = query + orderby + offset
	}
	log.FuncErrorTrace(0, queryWithFiler)
	// Append sorting and pagination filters
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer pay data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer pay data from DB", http.StatusBadRequest, nil)
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

	filter2, _ = PrepareDealerPayFilters(tableName, dataReq, true, true)
	if filter2 != "" {
		queryForAlldata = query + filter + filter2
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer credit data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of ar data List fetched : %v list %+v", len(dealerpayDataList.DealerPayList), dealerpayDataList)
	appserver.FormAndSendHttpResp(resp, "Ar  Data", http.StatusOK, dealerpayDataList, RecordCount)
}

func PrepareDealerPayFilters(tableName string, dataFilter models.GetDealerPay, forDataCount, offset bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDealerCreditFilters")
	defer func() { log.ExitFn(0, "PrepareDealerCreditFilters", nil) }()

	var filtersBuilder strings.Builder
	// whereAdded := false // Flag to track if WHERE clause has been added
	if !offset {
		// Check if there are filters
		if len(dataFilter.Filters) > 0 {
			filtersBuilder.WriteString(" AND ")
			// whereAdded = true // Set flag to true as WHERE clause is added

			for i, filter := range dataFilter.Filters {
				// Check if the column is a foreign key
				column := filter.Column

				// Determine the operator and value based on the filter operation
				operator := GetFilterDBMappedOperator(filter.Operation)
				value := filter.Data

				// For "stw" and "edw" operations, modify the value with '%'
				if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
					value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
				}

				// Build the filter condition using correct db column name
				if i > 0 {
					filtersBuilder.WriteString(" AND ")
				}
				switch column {
				case "unique_id":
					filtersBuilder.WriteString(fmt.Sprintf("LOWER(unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "home_owner":
					filtersBuilder.WriteString(fmt.Sprintf("LOWER(home_owner) %s LOWER($%d)", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "current_status":
					filtersBuilder.WriteString(fmt.Sprintf("LOWER(current_status) %s LOWER($%d)", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "status_date":
					filtersBuilder.WriteString(fmt.Sprintf("status_date %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "dealer":
					filtersBuilder.WriteString(fmt.Sprintf("LOWER(dealer) %s LOWER($%d)", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "today":
					filtersBuilder.WriteString(fmt.Sprintf("today %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "amount":
					filtersBuilder.WriteString(fmt.Sprintf("amount %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "sys_size":
					filtersBuilder.WriteString(fmt.Sprintf("sys_size %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "rl":
					filtersBuilder.WriteString(fmt.Sprintf("rl %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "contract_$$":
					filtersBuilder.WriteString(fmt.Sprintf("contract_$$ %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "loan_fee":
					filtersBuilder.WriteString(fmt.Sprintf("loan_fee %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "epc":
					filtersBuilder.WriteString(fmt.Sprintf("epc %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "net_epc":
					filtersBuilder.WriteString(fmt.Sprintf("net_epc %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "other_adders":
					filtersBuilder.WriteString(fmt.Sprintf("other_adders %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "credit":
					filtersBuilder.WriteString(fmt.Sprintf("credit %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "rep_pay":
					filtersBuilder.WriteString(fmt.Sprintf("rep_pay %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "net_rev":
					filtersBuilder.WriteString(fmt.Sprintf("net_rev %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "draw_amt":
					filtersBuilder.WriteString(fmt.Sprintf("draw_amt %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "amt_paid":
					filtersBuilder.WriteString(fmt.Sprintf("amt_paid %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "balance":
					filtersBuilder.WriteString(fmt.Sprintf("balance %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				case "contract_date":
					filtersBuilder.WriteString(fmt.Sprintf("contract_date %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)

				default:
					filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				}

			}
		}
	}
	if offset {
		if forDataCount {
			filtersBuilder.WriteString(" GROUP BY unique_id, home_owner, current_status, status_date, dealer, type, amount, sys_size, rl, contract_$$, loan_fee, epc, net_epc, other_adders, credit, rep_1, rep_2, rep_pay, net_rev, draw_amt, amt_paid, balance, st, contract_date, commission_model")
		} else {
			// Add pagination logic
			if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
				offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
				filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
			}
		}
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
