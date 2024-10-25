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
		err            error
		dataReq        models.DealerPayReportRequest
		RecordCount    int
		dlsPayCommResp models.DealerPayCommissions
		whereEleList   []interface{}
		query          string
		filter         string
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

	tableName := "dealer_pay"
	// Calculate pagination
	query = `SELECT home_owner, current_status, unique_id, dealer_code, 
				today, amount, sys_size, rl, contract_dol_dol, loan_fee, 
				epc, net_epc, other_adders, credit, rep_1, rep_2, 
				setter, draw_amt, amt_paid, balance, st, contract_date,finance_type 
				FROM dealer_pay`

	filter, whereEleList = PrepareDealerPayFilters(tableName, dataReq)
	if filter != "" {
		query = query + filter
	}

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get dealer pay commissions from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer pay commissions from DB", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {
		var dlrPay models.DealerPayReportResponse

		// Populate the DealerPayReportResponse struct with values from the database safely
		if val, ok := item["home_owner"].(string); ok {
			dlrPay.Home_Owner = val
		}
		if val, ok := item["current_status"].(string); ok {
			dlrPay.Current_Status = val
		}
		if val, ok := item["unique_id"].(string); ok {
			dlrPay.Unique_ID = val
		}
		if val, ok := item["dealer_code"].(string); ok {
			dlrPay.Dealer_Code = val
		}
		if val, ok := item["today"].(time.Time); ok {
			dlrPay.Today = val
		}
		if val, ok := item["amount"].(float64); ok {
			dlrPay.Amount = val
		}
		if val, ok := item["sys_size"].(string); ok {
			dlrPay.Sys_Size = val
		}
		if val, ok := item["rl"].(string); ok {
			dlrPay.RL = val
		}
		if val, ok := item["contract_dol_dol"].(string); ok {
			dlrPay.Contract = val
		}
		if val, ok := item["loan_fee"].(string); ok {
			dlrPay.Loan_Fee = val
		}
		if val, ok := item["epc"].(string); ok {
			dlrPay.EPC = val
		}
		if val, ok := item["net_epc"].(string); ok {
			dlrPay.Net_EPC = val
		}
		if val, ok := item["other_adders"].(string); ok {
			dlrPay.Other_Adders = val
		}
		if val, ok := item["credit"].(string); ok {
			dlrPay.Credit = val
		}
		if val, ok := item["rep_1"].(string); ok {
			dlrPay.Rep1 = val
		}
		if val, ok := item["rep_2"].(string); ok {
			dlrPay.Rep2 = val
		}
		if val, ok := item["setter"].(string); ok {
			dlrPay.Setter = val
		}
		if val, ok := item["draw_amt"].(float64); ok {
			dlrPay.Draw_Amt = val
		}
		if val, ok := item["amt_paid"].(float64); ok {
			dlrPay.Amt_Paid = val
		}
		if val, ok := item["balance"].(string); ok {
			dlrPay.Balance = val
		}
		if val, ok := item["st"].(string); ok {
			dlrPay.ST = val
		}
		if val, ok := item["contract_date"].(time.Time); ok {
			dlrPay.Contract_Date = val
		}

		if val, ok := item["finance_type"].(string); ok {
			dlrPay.Type = val
		}

		// Append the populated struct to the response
		dlsPayCommResp.DealerPayComm = append(dlsPayCommResp.DealerPayComm, dlrPay)
	}

	RecordCount = len(dlsPayCommResp.DealerPayComm)

	dlsPayCommResp.DealerPayComm = Paginate(dlsPayCommResp.DealerPayComm, int64(dataReq.PageNumber), int64(dataReq.PageSize))

	dlsPayCommResp.AmountPrepaid = 200.55
	dlsPayCommResp.AmountPrepaidPer = 123
	dlsPayCommResp.Pipeline_Remaining = 356
	dlsPayCommResp.Pipeline_RemainingPer = 368
	dlsPayCommResp.Current_Due = 658
	dlsPayCommResp.Current_Due_Per = 698

	// Send the response
	log.FuncInfoTrace(0, "Number of dealer pay commissions fetched: %v, data: %+v", RecordCount, dlsPayCommResp)
	appserver.FormAndSendHttpResp(resp, "Dealer pay commissions data", http.StatusOK, dlsPayCommResp.DealerPayComm, int64(RecordCount))
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
				filtersBuilder.WriteString(fmt.Sprintf("today %s $%d", operator, len(whereEleList)+1))
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

		filtersBuilder.WriteString(" ntp_date <= ?")
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

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
