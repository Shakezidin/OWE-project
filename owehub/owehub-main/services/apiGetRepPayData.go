// /**************************************************************************
//  * File       	   : apiGetRepPayFromView.go
//  * DESCRIPTION     : This file contains functions for get ApptSetters data handler
//  * DATE            : 22-Jan-2024
//  **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
	"time"
)

type RepPay struct {
	HomeOwner     string
	CurrentStatus string
	StatusDate    time.Time
	UniqueId      string
	OweContractor string
	DBA           string
	Type          string
	Amount        float64
	FinanceType   string
	SysSize       float64
	ContractTotal float64
	LoanFee       float64
	EPC           float64
	Adders        float64
	RR            float64
	CommRate      float64
	NetEPC        float64
	Credit        float64
	Rep2          string
	NetComm       float64
	DrawAmt       float64
	AmtPaid       float64
	Balance       float64
	DealerCode    string
	Subtotal      float64
	MaxPerRep     float64
	TotalPerRep   float64
}

/******************************************************************************
/ * FUNCTION:		GetRepPayFromView
/ * DESCRIPTION:     handler for get ApptSetters data request
/ * INPUT:			resp, req
/ * RETURNS:    		void
/ ******************************************************************************/

func GetRepPayDataFromView(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.RepPayRequest
		// data            []map[string]interface{}
		whereEleList   []interface{}
		query          string
		queryWithFiler string
		// queryForAlldata string
		filter      string
		RecordCount int64
		filterData  []map[string]interface{}
		// totalPerRepData []map[string]interface{}
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
		err = errors.New("empty input fields in api is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	dateFormat := "2006-01-02"
	if dataReq.UseCutoff == "YES" {
		parsedDate, err := time.Parse(dateFormat, dataReq.PayRollDate)
		if err != nil {
			FormAndSendHttpResp(resp, "error parsing date", http.StatusBadRequest, nil)
			return
		}
		adjustedDate := parsedDate.AddDate(0, 0, -5)
		dataReq.PayRollDate = adjustedDate.Format(dateFormat)
	}

	tableName := db.ViewName_REP_PAY
	query = `SELECT 
		rep.home_owner, rep.current_status, rep.status_date, rep.unique_id, rep.owe_contractor,
		rep.DBA, rep.type, rep.Today, rep.Amount, rep.finance_type, rep.sys_size, rep.contract_total, 
		rep.loan_fee, rep.epc, rep.adders, rep.r_r, rep.comm_rate, rep.net_epc, rep.credit, rep.rep_2,
		rep.net_comm, rep.draw_amt, rep.amt_paid, rep.balance, rep.dealer_code, rep.subtotal, rep.max_per_rep, rep.total_per_rep
		FROM ` + db.ViewName_REP_PAY + ` rep `

	maxPerRepQuery := `SELECT 
		owe_contractor, MAX(Amount) AS total_amount
		FROM ` + db.ViewName_REP_PAY + `
		GROUP BY owe_contractor;
	`
	totalPerRepQuery := `SELECT 
		owe_contractor, SUM(Amount) AS total_amount
		FROM ` + db.ViewName_REP_PAY + `
		GROUP BY owe_contractor;
	`

	if dataReq.ReportType == "ACTIVE+" {
		filterData, err = db.ReteriveFromDB(db.OweHubDbIndex, maxPerRepQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get ACTIVE+ data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get ACTIVE+ data from DB", http.StatusBadRequest, nil)
			return
		}
	} else if dataReq.ReportType == "STANDARD" {
		filterData, err = db.ReteriveFromDB(db.OweHubDbIndex, totalPerRepQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get STANDARD data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get STANDARD data from DB", http.StatusBadRequest, nil)
			return
		}
	}

	filter, whereEleList = prepareRepPayFilters(tableName, dataReq, false, true)
	queryWithFiler = query + filter

	Finaldata, err := db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepPayData data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get RepPayData data from DB", http.StatusBadRequest, nil)
		return
	}

	oweContractorMap := make(map[string]float64)
	for _, data := range filterData {
		if oweContractor, ok := data["owe_contractor"].(string); ok {
			if totalAmount, ok := data["total_amount"].(float64); ok {
				oweContractorMap[oweContractor] = totalAmount
			}
		}
	}

	var repPayList []RepPay

	for _, item := range Finaldata {
		var repPay RepPay
		skip := false

		for column, value := range item {
			switch column {
			case "home_owner":
				repPay.HomeOwner = value.(string)
			case "current_status":
				repPay.CurrentStatus = value.(string)
			case "status_date":
				repPay.StatusDate = value.(time.Time)
			case "unique_id":
				repPay.UniqueId = value.(string)
			case "owe_contractor":
				repPay.OweContractor = value.(string)
			case "DBA":
				repPay.DBA = value.(string)
			case "type":
				repPay.Type = value.(string)
			case "Amount":
				repPay.Amount = value.(float64)
			case "finance_type":
				repPay.FinanceType = value.(string)
			case "sys_size":
				repPay.SysSize = value.(float64)
			case "contract_total":
				repPay.ContractTotal = value.(float64)
			case "loan_fee":
				repPay.LoanFee = value.(float64)
			case "epc":
				repPay.EPC = value.(float64)
			case "adders":
				repPay.Adders = value.(float64)
			case "r_r":
				repPay.RR = value.(float64)
			case "comm_rate":
				repPay.CommRate = value.(float64)
			case "net_epc":
				repPay.NetEPC = value.(float64)
			case "credit":
				repPay.Credit = value.(float64)
			case "rep_2":
				repPay.Rep2 = value.(string)
			case "net_comm":
				repPay.NetComm = value.(float64)
			case "draw_amt":
				repPay.DrawAmt = value.(float64)
			case "amt_paid":
				repPay.AmtPaid = value.(float64)
			case "balance":
				repPay.Balance = value.(float64)
			case "dealer_code":
				repPay.DealerCode = value.(string)
			case "subtotal":
				repPay.Subtotal = value.(float64)
			case "max_per_rep":
				if totalAmount, ok := oweContractorMap[repPay.OweContractor]; ok && dataReq.ReportType == "ACTIVE+" {
					if totalAmount > 0.01 {
						repPay.MaxPerRep = value.(float64)
					} else {
						skip = true
					}
				} else {
					repPay.MaxPerRep = value.(float64)
				}
			case "total_per_rep":
				if totalAmount, ok := oweContractorMap[repPay.OweContractor]; ok && dataReq.ReportType == "STANDARD" {
					if totalAmount > 0.01 {
						repPay.TotalPerRep = value.(float64)
					} else {
						skip = true
					}
				} else {
					repPay.TotalPerRep = value.(float64)
				}
			}
		}

		if !skip {
			repPayList = append(repPayList, repPay)
		}
	}

	paginatedList := paginate(repPayList, dataReq.PageNumber, dataReq.PageSize)

	RecordCount = int64(len(repPayList))
	response := Response{
		Message:     "Rep Pay Data",
		RecordCount: RecordCount,
		Data:        paginatedList,
	}
	log.FuncInfoTrace(0, "Number of RepPay List fetched : %v", (RecordCount))

	resp.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(resp).Encode(response); err != nil {
		http.Error(resp, fmt.Sprintf("Failed to encode data as JSON: %v", err), http.StatusInternalServerError)
		return
	}
}

func paginate(repPayList []RepPay, page_number int, page_size int) []RepPay {
	start := (page_number - 1) * page_size
	end := page_number * page_size

	if start >= len(repPayList) {
		return []RepPay{}
	}

	if end > len(repPayList) {
		end = len(repPayList)
	}

	return repPayList[start:end]
}

func prepareRepPayFilters(tableName string, dataFilter models.RepPayRequest, forDataCount, reportFilter bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDealerCreditFilters")
	defer func() { log.ExitFn(0, "PrepareDealerCreditFilters", nil) }()

	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(" WHERE")
	if reportFilter {
		switch dataFilter.ReportType {
		case "ALL":
			filtersBuilder.WriteString(" rep.unique_id IS NOT NULL")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "STANDARD":
			filtersBuilder.WriteString(" rep.rep_status = 'Active'")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "ACTIVE+":
			filtersBuilder.WriteString(" rep.rep_status = 'Active'")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "ACTIVE":
			filtersBuilder.WriteString(" rep.rep_status = 'Active'")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "INACTIVE":
			filtersBuilder.WriteString(" rep.rep_status != 'Active'")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		}
	}

	// if reportFilter {
	// 	switch dataFilter.ReportType {
	// 	case "ALL":
	// 		filtersBuilder.WriteString(" rep.status_date <= $1")
	// 		whereEleList = append(whereEleList, dataFilter.PayRollDate)
	// 	case "STANDARD":
	// 		filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status = 'Active'")
	// 		whereEleList = append(whereEleList, dataFilter.PayRollDate)
	// 	case "ACTIVE+":
	// 		filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status = 'Active'")
	// 		whereEleList = append(whereEleList, dataFilter.PayRollDate)
	// 	case "ACTIVE":
	// 		filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status = 'Active'")
	// 		whereEleList = append(whereEleList, dataFilter.PayRollDate)
	// 	case "INACTIVE":
	// 		filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status != 'Active'")
	// 		whereEleList = append(whereEleList, dataFilter.PayRollDate)
	// 	}
	// }
	statuses := map[string]bool{
		"AP_OTH":      dataFilter.ApOth,
		"AP_PDA":      dataFilter.ApPda,
		"AP_DED":      dataFilter.ApDed,
		"AP_ADV":      dataFilter.ApAdv,
		"REP_COMM":    dataFilter.RepComm,
		"REP_BONUS":   dataFilter.RepBonus,
		"LEADER_OVRD": dataFilter.LeaderOvrd,
	}

	status := generateStatusConditionRep(statuses)
	filtersBuilder.WriteString(fmt.Sprintf(" AND %s", status))

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

	if !forDataCount {
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
	}

	if forDataCount {
		filtersBuilder.WriteString(" GROUP BY rep.home_owner, rep.current_status, rep.status_date, rep.unique_id, rep.owe_contractor," +
			"rep.DBA, rep.type, rep.Today, rep.Amount, rep.finance_type, rep.sys_size, rep.contract_total, " +
			"rep.loan_fee, rep.epc, rep.adders, rep.r_r, rep.comm_rate, rep.net_epc, rep.credit, rep.rep_2," +
			"rep.net_comm, rep.draw_amt, rep.amt_paid, rep.balance, rep.dealer_code, rep.subtotal, rep.max_per_rep, rep.total_per_rep")
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
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func generateStatusConditionRep(statuses map[string]bool) string {
	var statusConditions []string

	for status, include := range statuses {
		if include {
			statusConditions = append(statusConditions, fmt.Sprintf("'%s'", status))
		}
	}

	if len(statusConditions) > 0 {
		return fmt.Sprintf(" sheet_type IN (%s)", strings.Join(statusConditions, ", "))
	}
	return ""
}
