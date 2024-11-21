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
	oweconfig "OWEApp/shared/oweconfig"
	"math"
	"strings"
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
		err               error
		dataReq           models.DealerPayReportRequest
		RecordCount       int
		dlsPayCommResp    models.DealerPayCommissions
		whereEleList      []interface{}
		query             string
		filter            string
		amountPrepaid     float64
		pipelineRemaining float64
		currentDue        float64
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

	if len(dataReq.PartnerName) <= 0 {
		var dlrpayComm []models.DealerPayReportResponse
		dlsPayCommResp.DealerPayComm = dlrpayComm
		appserver.FormAndSendHttpResp(resp, "Dealer pay commissions data", http.StatusOK, dlsPayCommResp, int64(RecordCount))
		return
	}

	tableName := "dealer_pay"
	query = `SELECT home_owner, current_status, unique_id, dealer_code, marketing_fee, referral, rebate,
				today, amount, sys_size, rl, contract_dol_dol, loan_fee, 
				epc, net_epc, other_adders, credit, rep_1, rep_2, 
				setter, draw_amt, amt_paid, balance, st, contract_date,finance_type 
				FROM dealer_pay`

	filter, whereEleList = PrepareDealerPayFilters(tableName, dataReq)
	if filter != "" {
		query = query + filter
	}

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer pay commissions from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer pay commissions from DB", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {
		var dlrPay models.DealerPayReportResponse
		var adder models.Adder

		dlrPay.Home_Owner = getStringVal(item, "home_owner")
		dlrPay.Current_Status = getStringVal(item, "current_status")
		dlrPay.Unique_ID = getStringVal(item, "unique_id")
		dlrPay.Dealer_Code = getStringVal(item, "dealer_code")
		dlrPay.Today = time.Now().Truncate(24 * time.Hour)
		dlrPay.Amount = getFloat(item, "amount")
		dlrPay.Sys_Size = getFloat(item, "sys_size")
		dlrPay.RL = getFloat(item, "rl")
		dlrPay.Contract = getFloat(item, "contract_dol_dol")
		dlrPay.Loan_Fee = getFloat(item, "loan_fee")
		dlrPay.EPC = getFloat(item, "epc")
		dlrPay.Net_EPC = getFloat(item, "net_epc")
		dlrPay.Other_Adders = getFloat(item, "other_adders")
		dlrPay.Credit = getStringVal(item, "credit")
		dlrPay.Rep1 = getStringVal(item, "rep_1")
		dlrPay.Rep2 = getStringVal(item, "rep_2")
		dlrPay.Setter = getStringVal(item, "setter")
		dlrPay.Draw_Amt = getFloat(item, "draw_amt")
		dlrPay.Amt_Paid = getFloat(item, "amt_paid")
		dlrPay.Balance = getFloat(item, "balance")
		dlrPay.ST = getStringVal(item, "st")
		dlrPay.Contract_Date = getTime(item, "contract_date")
		dlrPay.Type = getStringVal(item, "finance_type")

		// Assign values for `adder` fields
		adder.Marketing = getFloat(item, "marketing_fee")
		adder.Referral = getStringVal(item, "referral")
		adder.Rebate = getStringVal(item, "rebate")
		adder.SmallSystemSize = dlrPay.Sys_Size
		adder.Credit = dlrPay.Credit

		// Assign `adder` to `dlrPay` and add `dlrPay` to the response
		dlrPay.Adder = adder
		dlsPayCommResp.DealerPayComm = append(dlsPayCommResp.DealerPayComm, dlrPay)
	}

	RecordCount = len(dlsPayCommResp.DealerPayComm)

	if dataReq.Paginate {
		dlsPayCommResp.DealerPayComm = Paginate(dlsPayCommResp.DealerPayComm, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	}

	if len(dataReq.PartnerName) > 0 && dataReq.PayroleDate != "" {
		// Prepare a string for dealer names, with each name properly escaped
		escapedPartnerNames := make([]string, len(dataReq.PartnerName))
		for i, name := range dataReq.PartnerName {
			escapedPartnerNames[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
		}
		dealerNames := strings.Join(escapedPartnerNames, ", ")

		// Parse the PayroleDate
		payroleDate, err := time.Parse("02-01-2006", dataReq.PayroleDate) // Ensure the format matches your input
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing PayroleDate")
			return
		}

		// Calculate one month before the PayroleDate
		oneMonthBefore := payroleDate.AddDate(0, -1, 0) // Subtract one month
		twoMonthBefore := payroleDate.AddDate(0, -2, 0)

		// Format the dates for SQL
		formattedPayroleDate := payroleDate.Format("2006-01-02 15:04:05")
		formattedOneMonthBefore := oneMonthBefore.Format("2006-01-02 15:04:05")
		formattedTwoMonthBefore := twoMonthBefore.Format("2006-01-02 15:04:05")

		query = fmt.Sprintf(`
			SELECT
				(SELECT SUM(amt_paid) 
				 FROM dealer_pay 
				 WHERE sys_size IS NOT NULL 
				   AND dealer_code IN (%s)
				   AND ntp_date <= '%s') AS amount_prepaid,
				
				(SELECT SUM(amount) 
				 FROM dealer_pay 
				 WHERE unique_id IS NOT NULL 
				   AND dealer_code IN (%s)
				   AND ntp_date <= '%s') AS pipeline_remaining,
				
				(SELECT SUM(balance) 
				 FROM dealer_pay 
				 WHERE dealer_code IN (%s)
				   AND ntp_date <= '%s') AS current_due,
				
				(SELECT SUM(amt_paid) 
				 FROM dealer_pay 
				 WHERE sys_size IS NOT NULL 
				   AND dealer_code IN (%s)
				   AND ntp_date <= '%s') AS amount_prepaid_this_month,
				
				(SELECT SUM(amount) 
				 FROM dealer_pay 
				 WHERE unique_id IS NOT NULL 
				   AND dealer_code IN (%s)
				   AND ntp_date <= '%s') AS pipeline_remaining_this_month,
				
				(SELECT SUM(balance) 
				 FROM dealer_pay 
				 WHERE dealer_code IN (%s)
				   AND ntp_date <= '%s') AS current_due_this_month,
				   
				(SELECT SUM(amt_paid) 
				 FROM dealer_pay 
				 WHERE sys_size IS NOT NULL 
				   AND dealer_code IN (%s)
				   AND ntp_date <= '%s') AS amount_prepaid_last_month,
				
				(SELECT SUM(amount) 
				 FROM dealer_pay 
				 WHERE unique_id IS NOT NULL 
				   AND dealer_code IN (%s)
				   AND ntp_date <= '%s') AS pipeline_remaining_last_month,
				
				(SELECT SUM(balance) 
				 FROM dealer_pay 
				 WHERE dealer_code IN (%s)
				   AND ntp_date <= '%s') AS current_due_last_month`,
			dealerNames, formattedPayroleDate,
			dealerNames, formattedPayroleDate,
			dealerNames, formattedPayroleDate,
			dealerNames, formattedOneMonthBefore,
			dealerNames, formattedOneMonthBefore,
			dealerNames, formattedOneMonthBefore,
			dealerNames, formattedTwoMonthBefore,
			dealerNames, formattedTwoMonthBefore,
			dealerNames, formattedTwoMonthBefore)

		// Execute the query
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dlrpay tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get dlrpay tile data from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			amountPrepaid = getFloat(data[0], "amount_prepaid")
			pipelineRemaining = getFloat(data[0], "pipeline_remaining")
			currentDue = getFloat(data[0], "current_due")

			amountPrepaidThisMonth := getFloat(data[0], "amount_prepaid_this_month")
			pipelineRemainingThisMonth := getFloat(data[0], "pipeline_remaining_this_month")
			currentDueThisMonth := getFloat(data[0], "current_due_this_month")

			amountPrepaidLastMonth := getFloat(data[0], "amount_prepaid_last_month")
			pipelineRemainingLastMonth := getFloat(data[0], "pipeline_remaining_last_month")
			currentDueLastMonth := getFloat(data[0], "current_due_last_month")

			amountPrepaidThisMonth = amountPrepaid - amountPrepaidThisMonth          // This month’s value only
			amountPrepaidLastMonth = amountPrepaidThisMonth - amountPrepaidLastMonth // Last month’s value only

			pipelineRemainingThisMonth = pipelineRemaining - pipelineRemainingThisMonth
			pipelineRemainingLastMonth = pipelineRemainingThisMonth - pipelineRemainingLastMonth

			currentDueThisMonth = currentDue - currentDueThisMonth
			currentDueLastMonth = currentDueThisMonth - currentDueLastMonth

			// Add last month data to response if needed
			dlsPayCommResp.AmountPrepaid = amountPrepaid
			dlsPayCommResp.Pipeline_Remaining = pipelineRemaining
			dlsPayCommResp.Current_Due = currentDue
			// Revised percentage calculation
			dlsPayCommResp.AmountPrepaidPerc = calculatePercentageIncrease(amountPrepaidThisMonth, amountPrepaidLastMonth)
			dlsPayCommResp.PipelineRemainingPerc = calculatePercentageIncrease(pipelineRemainingThisMonth, pipelineRemainingLastMonth)
			dlsPayCommResp.CurrentDuePerc = calculatePercentageIncrease(currentDueThisMonth, currentDueLastMonth)

		}
	}

	// Send the response
	// log.FuncInfoTrace(0, "Number of dealer pay commissions fetched: %v, data: %+v", RecordCount, dlsPayCommResp)
	appserver.FormAndSendHttpResp(resp, "Dealer pay commissions data", http.StatusOK, dlsPayCommResp, int64(RecordCount))
}

func Paginate[T any](data []T, pageNumber int64, pageSize int64) []T {
	start := (pageNumber - 1) * pageSize
	if start >= int64(len(data)) {
		return []T{}
	}

	end := start + pageSize
	if end > int64(len(data)) {
		end = int64(len(data))
	}

	return data[start:end]
}

func PrepareDealerPayFilters(tableName string, dataFilter models.DealerPayReportRequest) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDealerPayFilters")
	defer func() { log.ExitFn(0, "PrepareDealerPayFilters", nil) }()

	var filtersBuilder strings.Builder
	var whereAdder bool

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		whereAdder = true

		for i, filter := range dataFilter.Filters {
			// Check if the column is a foreign key
			column := filter.Column

			// Determine the operator and value based on the filter operation
			operator := oweconfig.GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			// For "stw" and "edw" operations, modify the value with '%'
			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = oweconfig.GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}

			// Build the filter condition using correct db column name
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			switch column {
			case "home_owner":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(home_owner) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "current_status":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(current_status) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "today":
				valueAsTime, _ := time.Parse("02-01-2006", value.(string))

				if !valueAsTime.Equal(time.Now().Truncate(24 * time.Hour)) {
					filtersBuilder.WriteString(fmt.Sprintf("today %s $%d", operator, len(whereEleList)+1))
					whereEleList = append(whereEleList, value)
				} else {
					filtersBuilder.WriteString(" 1 =1 ")
				}
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "draw_amt":
				filtersBuilder.WriteString(fmt.Sprintf("draw_amt %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amt_paid":
				filtersBuilder.WriteString(fmt.Sprintf("amt_paid %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "contract_date":
				filtersBuilder.WriteString(fmt.Sprintf("contract_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rl":
				filtersBuilder.WriteString(fmt.Sprintf("rl %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "contract":
				filtersBuilder.WriteString(fmt.Sprintf("contract_dol_dol %s $%d", operator, len(whereEleList)+1))
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
			case "balance":
				filtersBuilder.WriteString(fmt.Sprintf("balance %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "other_adders":
				filtersBuilder.WriteString(fmt.Sprintf("other_adders %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	if dataFilter.PayroleDate != "" {
		// Parse dataFilter.PayroleDate to time.Time using the given format
		date, err := time.Parse("02-01-2006", dataFilter.PayroleDate)
		if err != nil {
			log.FuncErrorTrace(0, "error while formatting PayroleDate")
			return
		}

		// Format date to the layout required for SQL (e.g., "2006-01-02")
		formattedDate := date.Format("2006-01-02")

		// Append to where clause with parameterized date format
		if whereAdder {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdder = true
		}

		filtersBuilder.WriteString(fmt.Sprintf(" ntp_date <= $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, formattedDate)
	}

	if len(dataFilter.PartnerName) > 0 {
		if whereAdder {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdder = true
		}

		filtersBuilder.WriteString(" dealer_code IN (")
		for i, dealer := range dataFilter.PartnerName {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, dealer)

			if i < len(dataFilter.PartnerName)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	if len(dataFilter.SearchInput) > 0 {
		if whereAdder {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdder = true
		}

		// Open parenthesis for grouping OR conditions
		filtersBuilder.WriteString("(")

		// Condition to match unique_id with case-insensitive search
		filtersBuilder.WriteString("LOWER(unique_id) ILIKE ")
		filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, "%"+dataFilter.SearchInput+"%")

		// Add OR condition for home_owner
		filtersBuilder.WriteString(" OR LOWER(home_owner) ILIKE ")
		filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, "%"+dataFilter.SearchInput+"%")

		// Close the OR group
		filtersBuilder.WriteString(")")
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func calculatePercentageIncrease(currentMonthValue, lastMonthValue float64) float64 {
	if lastMonthValue == 0 {
		if currentMonthValue > 0 {
			return 100 // To indicate a full increase from zero
		}
		return 0 // No change if both are zero
	}

	increase := currentMonthValue - lastMonthValue
	percentageIncrease := (increase / lastMonthValue) * 100
	return percentageIncrease
}

func getStringVal(item map[string]interface{}, key string) string {
	if val, ok := item[key].(string); ok {
		return val
	}
	return ""
}

func getFloat(item map[string]interface{}, key string) float64 {
	if val, ok := item[key].(float64); ok {
		return math.Round(val*100) / 100 // round to 2 decimals
	}
	return 0.0
}

func getTime(item map[string]interface{}, key string) time.Time {
	if val, ok := item[key].(time.Time); ok {
		return val
	}
	return time.Time{}
}
