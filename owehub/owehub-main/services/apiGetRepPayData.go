// /**************************************************************************
//  * File       	   : apiGetRepPayFromView.go
//  * DESCRIPTION     : This file contains functions for get ApptSetters data handler
//  * DATE            : 22-Jan-2024
//  **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
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
	HomeOwner     string    `json:"home_owner"`
	CurrentStatus string    `json:"current_status"`
	StatusDate    time.Time `json:"status_date"`
	UniqueId      string    `json:"unique_id"`
	OweContractor string    `json:"owe_contractor"`
	DBA           string    `json:"dba"`
	Type          string    `json:"type"`
	Amount        float64   `json:"amount"`
	FinanceType   string    `json:"finance_type"`
	SysSize       float64   `json:"sys_size"`
	ContractTotal float64   `json:"contract_total"`
	LoanFee       float64   `json:"loan_fee"`
	EPC           float64   `json:"epc"`
	Adders        float64   `json:"adders"`
	RR            float64   `json:"r_r"`
	CommRate      float64   `json:"comm_rate"`
	NetEPC        float64   `json:"net_epc"`
	Credit        float64   `json:"credit"`
	Rep2          string    `json:"rep2"`
	NetComm       float64   `json:"net_comm"`
	DrawAmt       float64   `json:"draw_amt"`
	AmtPaid       float64   `json:"amt_paid"`
	Balance       float64   `json:"balance"`
	DealerCode    string    `json:"dealer_code"`
	Subtotal      float64   `json:"subtotal"`
	MaxPerRep     float64   `json:"max_per_rep"`
	TotalPerRep   float64   `json:"total_per_rep"`
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

	if dataReq.ReportType == "" {
		err = errors.New("empty input fields in api is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	dateFormat := "2006-01-02"
	if dataReq.UseCutoff == "YES" {
		parsedDate, err := time.Parse(dateFormat, dataReq.PayRollDate)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, "error parsing date", http.StatusBadRequest, nil)
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
		WHERE Amount != 'NaN' 
		GROUP BY owe_contractor;
	`
	totalPerRepQuery := `SELECT 
		owe_contractor, SUM(Amount) AS total_amount
		FROM ` + db.ViewName_REP_PAY + `
		WHERE Amount != 'NaN' 
		GROUP BY owe_contractor;
	`

	if dataReq.ReportType == "ACTIVE+" {
		filterData, err = db.ReteriveFromDB(db.OweHubDbIndex, maxPerRepQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get ACTIVE+ data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get ACTIVE+ data from DB", http.StatusBadRequest, nil)
			return
		}
	} else if dataReq.ReportType == "STANDARD" {
		filterData, err = db.ReteriveFromDB(db.OweHubDbIndex, totalPerRepQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get STANDARD data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get STANDARD data from DB", http.StatusBadRequest, nil)
			return
		}
	}

	filter, whereEleList = prepareRepPayFilters(tableName, dataReq, false, true)
	queryWithFiler = query + filter

	Finaldata, err := db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepPayData data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get RepPayData data from DB", http.StatusBadRequest, nil)
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
				if v, ok := value.(string); ok {
					repPay.HomeOwner = v
				} else {
					repPay.HomeOwner = ""
				}
			case "current_status":
				if v, ok := value.(string); ok {
					repPay.CurrentStatus = v
				} else {
					repPay.CurrentStatus = ""
				}
			case "status_date":
				if v, ok := value.(time.Time); ok {
					repPay.StatusDate = v
				} else {
					repPay.StatusDate = time.Time{}
				}
			case "unique_id":
				if v, ok := value.(string); ok {
					repPay.UniqueId = v
				} else {
					repPay.UniqueId = ""
				}
			case "owe_contractor":
				if v, ok := value.(string); ok {
					repPay.OweContractor = v
				} else {
					repPay.OweContractor = ""
				}
			case "DBA":
				if v, ok := value.(string); ok {
					repPay.DBA = v
				} else {
					repPay.DBA = ""
				}
			case "type":
				if v, ok := value.(string); ok {
					repPay.Type = v
				} else {
					repPay.Type = ""
				}
			case "Amount":
				if v, ok := value.(float64); ok {
					repPay.Amount = v
				} else {
					repPay.Amount = 0
				}
			case "finance_type":
				if v, ok := value.(string); ok {
					repPay.FinanceType = v
				} else {
					repPay.FinanceType = ""
				}
			case "sys_size":
				if v, ok := value.(float64); ok {
					repPay.SysSize = v
				} else {
					repPay.SysSize = 0
				}
			case "contract_total":
				repPay.ContractTotal = value.(float64)
				if v, ok := value.(float64); ok {
					repPay.ContractTotal = v
				} else {
					repPay.ContractTotal = 0
				}
			case "loan_fee":
				if v, ok := value.(float64); ok {
					repPay.LoanFee = v
				} else {
					repPay.LoanFee = 0
				}
			case "epc":
				if v, ok := value.(float64); ok {
					repPay.EPC = v
				} else {
					repPay.EPC = 0
				}
			case "adders":
				if v, ok := value.(float64); ok {
					repPay.Adders = v
				} else {
					repPay.Adders = 0
				}
			case "r_r":
				if v, ok := value.(float64); ok {
					repPay.RR = v
				} else {
					repPay.RR = 0
				}
			case "comm_rate":
				if v, ok := value.(float64); ok {
					repPay.CommRate = v
				} else {
					repPay.CommRate = 0
				}
			case "net_epc":
				if v, ok := value.(float64); ok {
					repPay.NetEPC = v
				} else {
					repPay.NetEPC = 0
				}
			case "credit":
				if v, ok := value.(float64); ok {
					repPay.Credit = v
				} else {
					repPay.Credit = 0
				}
			case "rep_2":
				if v, ok := value.(string); ok {
					repPay.Rep2 = v
				} else {
					repPay.Rep2 = ""
				}
			case "net_comm":
				if v, ok := value.(float64); ok {
					repPay.NetComm = v
				} else {
					repPay.NetComm = 0
				}
			case "draw_amt":
				if v, ok := value.(float64); ok {
					repPay.DrawAmt = v
				} else {
					repPay.DrawAmt = 0
				}
			case "amt_paid":
				if v, ok := value.(float64); ok {
					repPay.AmtPaid = v
				} else {
					repPay.AmtPaid = 0
				}
			case "balance":
				if v, ok := value.(float64); ok {
					repPay.Balance = v
				} else {
					repPay.Balance = 0
				}
			case "dealer_code":
				if v, ok := value.(string); ok {
					repPay.DealerCode = v
				} else {
					repPay.DealerCode = ""
				}
			case "subtotal":
				if v, ok := value.(float64); ok {
					repPay.Subtotal = v
				} else {
					repPay.Subtotal = 0
				}
			case "max_per_rep":
				if totalAmount, ok := oweContractorMap[repPay.OweContractor]; ok && dataReq.ReportType == "ACTIVE+" {
					if totalAmount > 0.01 {
						if v, ok := value.(float64); ok {
							repPay.MaxPerRep = v
						} else {
							skip = true
						}
					} else {
						skip = true
					}
				} else {
					if v, ok := value.(float64); ok {
						repPay.MaxPerRep = v
					}
				}
			case "total_per_rep":
				if totalAmount, ok := oweContractorMap[repPay.OweContractor]; ok && dataReq.ReportType == "STANDARD" {
					if totalAmount > 0.01 {
						if v, ok := value.(float64); ok {
							repPay.TotalPerRep = v
						} else {
							skip = true
						}
					} else {
						skip = true
					}
				} else {
					if v, ok := value.(float64); ok {
						repPay.TotalPerRep = v
					}
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
	filtersBuilder.WriteString(" WHERE net_comm != 'NaN' AND balance != 'NaN' AND")
	if reportFilter {
		switch dataFilter.ReportType {
		case "ALL":
			filtersBuilder.WriteString(" rep.status_date IS NOT NULL AND rep.unique_id IS NOT NULL")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "STANDARD":
			filtersBuilder.WriteString(" rep.status_date IS NOT NULL AND rep.rep_status = 'Active'")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "ACTIVE+":
			filtersBuilder.WriteString(" rep.status_date IS NOT NULL AND rep.rep_status = 'Active'")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "ACTIVE":
			filtersBuilder.WriteString(" rep.status_date IS NOT NULL AND rep.rep_status = 'Active'")
			// whereEleList = append(whereEleList, dataFilter.PayRollDate)
		case "INACTIVE":
			filtersBuilder.WriteString(" rep.status_date IS NOT NULL AND rep.rep_status != 'Active'")
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
		case "dba":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.DBA) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "type":
			filtersBuilder.WriteString(fmt.Sprintf(" LOWER(rep.type) %s LOWER($%d)", operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		case "amount":
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
		case "rep2":
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
			// case "max_per_rep":
			// 	filtersBuilder.WriteString(fmt.Sprintf(" rep.max_per_rep %s $%d", operator, len(whereEleList)+1))
			// 	whereEleList = append(whereEleList, value)
			// case "total_per_rep":
			// 	filtersBuilder.WriteString(fmt.Sprintf(" rep.total_per_rep %s $%d", operator, len(whereEleList)+1))
			// 	whereEleList = append(whereEleList, value)
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
