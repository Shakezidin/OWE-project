/**************************************************************************
 * File       	   : apiGetPerfomanceSales.go
 * DESCRIPTION     : This file contains functions for get PerfomanceSales handler
 * DATE            : 03-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetPerfomanceSalesRequest
* DESCRIPTION:     handler for get PerfomanceSales request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPerfomanceSalesRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.GetPerfomanceReq
		data           []map[string]interface{}
		whereEleList   []interface{}
		query          string
		queryWithFiler string
		filter         string
		dates          []string
	)

	log.EnterFn(0, "HandleGetRateAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleGetRateAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get perfomance sales request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get perfomance sales request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get perfomance sales request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get perfomance sales Request body", http.StatusBadRequest, nil)
		return
	}
	query = `
	SELECT SUM(system_size) AS sales_kw, COUNT(system_size) AS sales  FROM sales_metrics_schema`

	allDatas := make(map[string][]map[string]interface{}, 0)
	dates = append(dates, "contract_date", "ntp_date", "cancelled_date", "pv_install_completed_date")
	for _, date := range dates {
		filter, whereEleList = PreparePerfomanceFilters(queryWithFiler, date, dataReq)
		if filter != "" {
			queryWithFiler = query + filter
		}

		data, err = db.ReteriveFromDB(queryWithFiler, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get perfomance sales from DB for %v err: %v", date, err)
			FormAndSendHttpResp(resp, "Failed to get perfomance sales from DB for %v", http.StatusBadRequest, date)
			return
		}
		allDatas[date] = data
	}

	perfomanceData := []models.PerfomanceSales{}
	for date, data := range allDatas {
		Sales, ok := data[0]["sales"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get total sales count data for %+v\n: %+v\n", date, data[0])
			Sales = 0.0
		}

		SalesKw, ok := data[0]["sales_kw"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get total sales kw count data for %+v\n: %+v\n", date, data[0])
			SalesKw = 0.0
		}
		perfomanceData = append(perfomanceData, models.PerfomanceSales{
			Type:    date,
			Sales:   Sales,
			SalesKw: SalesKw,
		})
	}
	log.FuncInfoTrace(0, "total perfomance report list %+v", len(perfomanceData))
	FormAndSendHttpResp(resp, "perfomance report", http.StatusOK, perfomanceData)
}

/******************************************************************************
* FUNCTION:		PreparePerfomanceFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PreparePerfomanceFilters(tableName, columnName string, dataFilter models.GetPerfomanceReq) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePerfomanceFilters")
	defer func() { log.ExitFn(0, "PreparePerfomanceFilters", nil) }()

	var startDate, endDate string
	startDate = dataFilter.StartDate
	endDate = dataFilter.EndDate

	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(" WHERE ")

	// This will added if the default date is confirmed
	// if startDate.IsZero() || endDate.IsZero() {
	// default start date
	// default end date
	// }
	switch columnName {
	case "contract_date":
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date >= $%d AND contract_date <= $%d", len(whereEleList)+1, len(whereEleList)+2))
		whereEleList = append(whereEleList, startDate, endDate)
	case "ntp_date":
		filtersBuilder.WriteString(fmt.Sprintf(" ntp_date >= $%d AND ntp_date <= $%d", len(whereEleList)+1, len(whereEleList)+2))
		whereEleList = append(whereEleList, startDate, endDate)
	case "cancelled_date":
		filtersBuilder.WriteString(fmt.Sprintf(" cancelled_date >= $%d AND cancelled_date <= $%d", len(whereEleList)+1, len(whereEleList)+2))
		whereEleList = append(whereEleList, startDate, endDate)
	case "pv_install_completed_date":
		filtersBuilder.WriteString(fmt.Sprintf(" pv_install_completed_date >= $%d AND pv_install_completed_date <= $%d", len(whereEleList)+1, len(whereEleList)+2))
		whereEleList = append(whereEleList, startDate, endDate)
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s", tableName)
	return filters, whereEleList
}
