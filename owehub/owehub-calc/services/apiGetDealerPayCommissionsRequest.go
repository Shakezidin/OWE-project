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
	"OWEApp/shared/types"
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

type DealerPayment struct {
	AmountPrepaid             float64 `json:"amount_prepaid"`
	PipelineRemaining         float64 `json:"pipeline_remaining"`
	CurrentDue                float64 `json:"current_due"`
	Period                    string  `json:"period"`
	PreviousAmountPrepaid     float64
	PreviousPipelineRemaining float64
	PreviousCurrentDue        float64
}

func HandleGetDealerPayCommissionsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DealerPayReportRequest
		RecordCount  int
		response     models.DealerPayCommissions
		whereEleList []interface{}
		query        string
		filter       string
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

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	dataReq.Role = req.Context().Value("rolename").(string)
	if dataReq.Role == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	if len(dataReq.PartnerName) <= 0 && dataReq.Role == string(types.RoleAdmin) {
		var dlrpayComm []models.DealerPayReportResponse
		response.DealerPayComm = dlrpayComm
		appserver.FormAndSendHttpResp(resp, "Dealer pay commissions data", http.StatusOK, response, int64(RecordCount))
		return
	}

	if dataReq.Role == string(types.RoleDealerOwner) || dataReq.Role == string(types.RoleSubDealerOwner) {
		dealerQuery := fmt.Sprintf(` SELECT sp.sales_partner_name AS dealer_name, name FROM user_details ud
			LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
			where ud.email_id = '%v'`, dataReq.Email)
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, dealerQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer name", http.StatusBadRequest, data)
			return
		}
		if len(data) == 0 {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer name %v", http.StatusBadRequest, data)
			return
		}

		dealerName, ok := data[0]["dealer_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert dealer_name to string for data: %v", data[0])
			appserver.FormAndSendHttpResp(resp, "Failed to process dealer name", http.StatusBadRequest, nil)
			return
		}
		dataReq.PartnerName = append(dataReq.PartnerName, dealerName)
	}

	tableName := "dealer_pay"
	query = `SELECT home_owner, current_status, unique_id, dealer_code, referral, rebate,
				today, amount, sys_size, rl, contract_dol_dol, loan_fee, 
				epc, net_epc, other_adders, credit, rep_1, rep_2, 
				setter, draw_perc, amt_paid, balance, st, contract_date,finance_type 
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
		dlrPay.Draw_Amt = getFloat(item, "draw_perc")
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
		response.DealerPayComm = append(response.DealerPayComm, dlrPay)
	}

	RecordCount = len(response.DealerPayComm)

	if dataReq.Paginate {
		response.DealerPayComm = Paginate(response.DealerPayComm, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	}

	if len(dataReq.PartnerName) > 0 {
		if dataReq.PayroleDate == "" {
			dataReq.PayroleDate = time.Now().Format("02-01-2006")
		}

		// Parse the PayroleDate
		currentDate, err := time.Parse("02-01-2006", dataReq.PayroleDate)
		if err != nil {
			return
		}

		// Escape dealer names
		dealerNames := make([]string, len(dataReq.PartnerName))
		for i, name := range dataReq.PartnerName {
			dealerNames[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'"
		}
		dealerList := strings.Join(dealerNames, ", ")

		// SQL query to get month-wise data with cumulative totals
		query := fmt.Sprintf(`
			WITH monthly_data AS (
				SELECT
					DATE_TRUNC('month', $1::timestamp) AS current_period,
					DATE_TRUNC('month', $1::timestamp - INTERVAL '1 month') AS previous_period,
					-- Current month amount_prepaid (cumulative)
					(
						SELECT SUM(CASE WHEN sys_size IS NOT NULL THEN amt_paid ELSE 0 END)
						FROM dealer_pay
						WHERE dealer_code IN (%s)
						AND ntp_date <= $1::timestamp
					) as current_amount_prepaid,
					-- Previous month amount_prepaid (cumulative)
					(
						SELECT SUM(CASE WHEN sys_size IS NOT NULL THEN amt_paid ELSE 0 END)
						FROM dealer_pay
						WHERE dealer_code IN (%s)
						AND ntp_date <= ($1::timestamp - INTERVAL '1 month')
					) as previous_amount_prepaid,
					-- Current month pipeline_remaining (cumulative)
					(
						SELECT SUM(CASE WHEN unique_id IS NOT NULL THEN amount ELSE 0 END)
						FROM dealer_pay
						WHERE dealer_code IN (%s)
						AND ntp_date <= $1::timestamp
					) as current_pipeline_remaining,
					-- Previous month pipeline_remaining (cumulative)
					(
						SELECT SUM(CASE WHEN unique_id IS NOT NULL THEN amount ELSE 0 END)
						FROM dealer_pay
						WHERE dealer_code IN (%s)
						AND ntp_date <= ($1::timestamp - INTERVAL '1 month')
					) as previous_pipeline_remaining,
					-- Current month current_due (cumulative)
					(
						SELECT SUM(balance)
						FROM dealer_pay
						WHERE dealer_code IN (%s)
						AND ntp_date <= $1::timestamp
					) as current_due,
					-- Previous month current_due (cumulative)
					(
						SELECT SUM(balance)
						FROM dealer_pay
						WHERE dealer_code IN (%s)
						AND ntp_date <= ($1::timestamp - INTERVAL '1 month')
					) as previous_current_due
				FROM dealer_pay
				WHERE dealer_code IN (%s)
				AND ntp_date >= DATE_TRUNC('month', $1::timestamp - INTERVAL '1 month')
				AND ntp_date < DATE_TRUNC('month', $1::timestamp + INTERVAL '1 month')
				GROUP BY 1, 2
			)
			SELECT 
				current_period as period,
				current_amount_prepaid as amount_prepaid,
				previous_amount_prepaid,
				current_pipeline_remaining as pipeline_remaining,
				previous_pipeline_remaining,
				current_due,
				previous_current_due
			FROM monthly_data`,
			dealerList, dealerList, dealerList, dealerList, dealerList, dealerList, dealerList)

		// Execute query with the current date as parameter
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{currentDate})
		if err != nil {
			return
		}

		// Process the results
		var currentMonth DealerPayment
		for _, row := range data {
			period := row["period"].(time.Time)
			payment := DealerPayment{
				AmountPrepaid:             getFloat(row, "amount_prepaid"),
				PreviousAmountPrepaid:     getFloat(row, "previous_amount_prepaid"),
				PipelineRemaining:         getFloat(row, "pipeline_remaining"),
				PreviousPipelineRemaining: getFloat(row, "previous_pipeline_remaining"),
				CurrentDue:                getFloat(row, "current_due"),
				PreviousCurrentDue:        getFloat(row, "previous_current_due"),
				Period:                    period.Format("2006-01"),
			}
			currentMonth = payment
		}

		// Set response values
		response.AmountPrepaid = currentMonth.AmountPrepaid
		response.Pipeline_Remaining = currentMonth.PipelineRemaining
		response.Current_Due = currentMonth.CurrentDue

		// Calculate growth rates using cumulative totals
		response.AmountPrepaidPerc = calculateGrowthRate(currentMonth.AmountPrepaid, currentMonth.PreviousAmountPrepaid)
		response.PipelineRemainingPerc = calculateGrowthRate(currentMonth.PipelineRemaining, currentMonth.PreviousPipelineRemaining)
		response.CurrentDuePerc = calculateGrowthRate(currentMonth.CurrentDue, currentMonth.PreviousCurrentDue)
	}

	// Send the response
	// log.FuncInfoTrace(0, "Number of dealer pay commissions fetched: %v, data: %+v", RecordCount, dlsPayCommResp)
	appserver.FormAndSendHttpResp(resp, "Dealer pay commissions data", http.StatusOK, response, int64(RecordCount))
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
				filtersBuilder.WriteString(fmt.Sprintf("CURRENT_DATE = TO_DATE($%d, 'MM-DD-YYYY')", len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
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

func calculateGrowthRate(current, previous float64) float64 {
	if previous == 0 {
		if current == 0 {
			return 0
		}
		return 100 // Represent infinite growth as 100%
	}

	if current == 0 {
		return -100 // Represent complete decline as -100%
	}

	return ((current - previous) / math.Abs(previous)) * 100
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
