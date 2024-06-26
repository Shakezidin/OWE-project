// /**************************************************************************
//  * File       	   : apiGetRepPayFromView.go
//  * DESCRIPTION     : This file contains functions for get ApptSetters data handler
//  * DATE            : 22-Jan-2024
//  **************************************************************************/

package services

import (
	// 	// 	// 	"OWEApp/shared/db"
	// 	// 	// 	log "OWEApp/shared/logger"
	"OWEApp/shared/db"
	models "OWEApp/shared/models"
	"strings"
	"time"

	// 	// 	// 	"time"

	// 	// 	// 	"encoding/json"
	// 	// 	// 	"fmt"

	log "OWEApp/shared/logger"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

// /******************************************************************************
// * FUNCTION:		GetRepPayFromView
// * DESCRIPTION:     handler for get ApptSetters data request
// * INPUT:			resp, req
// * RETURNS:    		void
// ******************************************************************************/

func GetRepPayDataFromView(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		dataReq         models.RepPayRequest
		data            []map[string]interface{}
		whereEleList    []interface{}
		query           string
		queryWithFiler  string
		queryForAlldata string
		filter          string
		RecordCount     int64
	)

	type Response struct {
		Message     string      `json:"message"`
		RecordCount int64       `json:"record_count"`
		Data        interface{} `json:"data"`
	}

	log.EnterFn(0, "GetRepPayFromView")
	defer func() { log.ExitFn(0, "GetRepPayFromView", err) }()

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

	if dataReq.ReportType == "" {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// tableName := db.TableName_REP_PAY
	// sortByList := dataReq.SortBy

	dateFormat := "2006-01-02"
	if dataReq.UseCutoff == "YES" {
		parsedDate, err := time.Parse(dateFormat, dataReq.PayRollDate)
		if err != nil {
			fmt.Println("Error parsing date:", err)
			return
		}
		adjustedDate := parsedDate.AddDate(0, 0, -5)
		dataReq.PayRollDate = adjustedDate.Format(dateFormat)
	}

	tableName := db.TableName_REP_PAY
	query = `SELECT 
		rep.home_owner, rep.current_status, rep.status_date, rep.unique_id, rep.owe_contractor,
		rep.DBA, rep.type, rep.Today, rep.Amount, rep.finance_type, rep.sys_size, rep.contract_total, 
		rep.loan_fee, rep.epc, rep.adders, rep.r_r, rep.comm_rate, rep.net_epc, rep.credit, rep.rep_2,
		rep.net_comm, rep.draw_amt, rep.amt_paid, rep.balance, rep.dealer_code, rep.subtotal, rep.max_per_rep, rep.total_per_rep
		FROM ` + db.TableName_REP_PAY

	filter, whereEleList = prepareRepPayFilters(tableName, dataReq, false, true)
	queryWithFiler = query + filter

	Finaldata, err := db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepPayData data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get RepPayData data from DB", http.StatusBadRequest, nil)
		return
	}

	filter, whereEleList = prepareRepPayFilters(tableName, dataReq, true, true)
	queryForAlldata = query + filter

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepPayData data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get RepPayData data from DB", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))
	response := Response{
		Message:     "Rep Pay Data",
		RecordCount: RecordCount,
		Data:        Finaldata,
	}
	log.FuncInfoTrace(0, "Number of RepPay List fetched : %v", (RecordCount))

	resp.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(resp).Encode(response); err != nil {
		http.Error(resp, fmt.Sprintf("Failed to encode data as JSON: %v", err), http.StatusInternalServerError)
		return
	}
}

func prepareRepPayFilters(tableName string, dataFilter models.RepPayRequest, forDataCount, reportFilter bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDealerCreditFilters")
	defer func() { log.ExitFn(0, "PrepareDealerCreditFilters", nil) }()

	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(" WHERE")
	if reportFilter {
		switch dataFilter.ReportType {
		case "ALL":
			filtersBuilder.WriteString(" rep.status_date <= $1")
			whereEleList = append(whereEleList, dataFilter.PayRollDate)
			break
		case "STANDARD":
			filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status = 'Active' AND rep.total_per_rep > 0.01")
			whereEleList = append(whereEleList, dataFilter.PayRollDate)
			break
		case "ACTIVE+":
			filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status = 'Active' AND rep.max_per_rep > 0.01")
			whereEleList = append(whereEleList, dataFilter.PayRollDate)
			break
		case "ACTIVE":
			filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status = 'Active'")
			whereEleList = append(whereEleList, dataFilter.PayRollDate)
			break
		case "INACTIVE":
			filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status != 'Active'")
			whereEleList = append(whereEleList, dataFilter.PayRollDate)
		}
	}

	for i, filter := range dataFilter.Filters {
		column := filter.Column

		operator := GetFilterDBMappedOperator(filter.Operation)
		value := filter.Data

		if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
			value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
		}

		if i > 0 {
			filtersBuilder.WriteString(" AND ")
		}

		switch column {
		case "home_owner":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.home_owner) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "current_status":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.current_status) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "status_date":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.status_date %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "unique_id":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "owe_contractor":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.owe_contractor) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "DBA":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.DBA) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "type":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.type) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "Amount":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.Amount %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "finance_type":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.finance_type) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "sys_size":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.sys_size %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "loan_fee":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.loan_fee %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "epc":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.epc %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "adders":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.adders %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "r_r":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.r_r %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "comm_rate":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.comm_rate %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "net_epc":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.net_epc %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "credit":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.credit %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "rep_2":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.rep_2) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "net_comm":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.net_comm %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "draw_amt":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.draw_amt %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "amt_paid":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.amt_paid %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "balance":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.balance %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "dealer_code":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.dealer_code) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "subtotal":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.subtotal %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "max_per_rep":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.max_per_rep %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "total_per_rep":
			filtersBuilder.WriteString(fmt.Sprintf(" rep.total_per_rep %s $%d", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		}
	}

	if len(dataFilter.SortBy) > 1 {
		filtersBuilder.WriteString(" ORDER BY ")
	}
	for i, sort := range dataFilter.SortBy {
		filtersBuilder.WriteString(fmt.Sprintf(" $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, sort)
		if i < len(dataFilter.SortBy)-1 {
			filtersBuilder.WriteString(",")
		}
	}

	if forDataCount {
		filtersBuilder.WriteString(" GROUP BY rep.home_owner, rep.current_status, rep.status_date, rep.unique_id, rep.owe_contractor," +
			"rep.DBA, rep.type, rep.Today, rep.Amount, rep.finance_type, rep.sys_size, rep.contract_total, " +
			"rep.loan_fee, rep.epc, rep.adders, rep.r_r, rep.comm_rate, rep.net_epc, rep.credit, rep.rep_2," +
			"rep.net_comm, rep.draw_amt, rep.amt_paid, rep.balance, rep.dealer_code, rep.subtotal, rep.max_per_rep, rep.total_per_rep")
	} else {
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
