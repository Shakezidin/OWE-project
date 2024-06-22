// // /**************************************************************************
// //  * File       	   : apiGetRepPayFromView.go
// //  * DESCRIPTION     : This file contains functions for get ApptSetters data handler
// //  * DATE            : 22-Jan-2024
// //  **************************************************************************/

package services

// import (
// 	// 	// 	"OWEApp/shared/db"
// 	// 	// 	log "OWEApp/shared/logger"
// 	models "OWEApp/shared/models"
// 	"strings"
// 	"time"

// 	// 	// 	"time"

// 	// 	// 	"encoding/json"
// 	// 	// 	"fmt"

// 	log "OWEApp/shared/logger"
// 	"encoding/json"
// 	"fmt"
// 	"io/ioutil"
// 	"net/http"
// )

// // /******************************************************************************
// // * FUNCTION:		GetRepPayFromView
// // * DESCRIPTION:     handler for get ApptSetters data request
// // * INPUT:			resp, req
// // * RETURNS:    		void
// // ******************************************************************************/

// func GetRepPayDataFromView(resp http.ResponseWriter, req *http.Request) {
// 	var (
// 		err          error
// 		dataReq      models.RepPayRequest
// 		data         []map[string]interface{}
// 		whereEleList []interface{}
// 		query        string
// 		// queryForAlldata string
// 		// filter string
// 		// RecordCount     int64
// 	)

// 	log.EnterFn(0, "GetRepPayFromView")
// 	defer func() { log.ExitFn(0, "GetRepPayFromView", err) }()

// 	if req.Body == nil {
// 		err = fmt.Errorf("HTTP Request body is null in get ar data request")
// 		log.FuncErrorTrace(0, "%v", err)
// 		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
// 		return
// 	}

// 	reqBody, err := ioutil.ReadAll(req.Body)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar data request err: %v", err)
// 		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	err = json.Unmarshal(reqBody, &dataReq)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to unmarshal get ar data request err: %v", err)
// 		FormAndSendHttpResp(resp, "Failed to unmarshal get ar data Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	if dataReq.ReportType == "" {
// 		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
// 		log.FuncErrorTrace(0, "%v", err)
// 		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
// 		return
// 	}

// 	sortByList := dataReq.SortBy

// 	dateFormat := "2006-01-02"
// 	if dataReq.UseCutoff == "YES" {
// 		parsedDate, err := time.Parse(dateFormat, dataReq.PayRollDate)
// 		if err != nil {
// 			fmt.Println("Error parsing date:", err)
// 			return
// 		}
// 		adjustedDate := parsedDate.AddDate(0, 0, -5)
// 		dataReq.PayRollDate = adjustedDate.Format(dateFormat)
// 	}

// 	query = `SELECT pay.status_date

// 		FROM rep_pay_pr_data rep
// 	`

// 	prepareRepPayFilters("", dataReq, false, true)
// 	// //* payroll date
// 	//* condition for rep status
// }

// type FilterResponse struct {
// }

// func prepareRepPayFilters(tableName string, dataFilter models.RepPayRequest, forDataCount, reportFilter bool) (filters string) {
// 	log.EnterFn(0, "PrepareDealerCreditFilters")
// 	defer func() { log.ExitFn(0, "PrepareDealerCreditFilters", nil) }()

// 	var filtersBuilder strings.Builder
// 	if reportFilter {
// 		filtersBuilder.WriteString("")
// 		switch dataFilter.ReportType {
// 		case "ALL":
// 			filtersBuilder.WriteString(" rep.status_date <= $1")
// 		case "STANDARD":
// 			filtersBuilder.WriteString(" rep.status_date <= $1 AND rep.rep_status = $2")
// 		case "ACTIVE+":
// 			filtersBuilder.WriteString(" rep.status_date <= $1")
// 		case "ACTIVE":
// 			filtersBuilder.WriteString(" rep.status_date <= $1")
// 		case "INACTIVE":
// 			filtersBuilder.WriteString(" rep.status_date <= $1")
// 		}
// 	}

// 	if forDataCount {
// 		filtersBuilder.WriteString(" GROUP BY unique_id, home_owner, current_status, status_date, dealer, type, amount, sys_size, rl, contract_$$, loan_fee, epc, net_epc, other_adders, credit, rep_1, rep_2, rep_pay, net_rev, draw_amt, amt_paid, balance, st, contract_date, commission_model")
// 	} else {
// 		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
// 			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
// 			filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
// 		}
// 	}

// 	filters = filtersBuilder.String()
// 	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
// 	return filters
// }
