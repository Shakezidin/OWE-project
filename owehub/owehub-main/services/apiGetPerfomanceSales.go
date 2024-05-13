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
		err              error
		dataReq          models.GetPerfomanceReq
		data             []map[string]interface{}
		whereEleList     []interface{}
		query            string
		queryWithFiler   string
		filter           string
		firstFilter      string
		dates            []string
		rgnSalesMgrCheck bool
		SaleRepList      []interface{}
	)

	log.EnterFn(0, "HandleGetPerfomanceSalesRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceSalesRequest", err) }()

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

	// change table name here
	tableName := db.TableName_sales_metrics_schema
	dataReq.Email = req.Context().Value("emailid").(string)

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role := data[0]["role_name"]
		name := data[0]["name"]
		dealerName := data[0]["dealer_name"]
		rgnSalesMgrCheck = false

		switch role {
		case "Admin":
			filter, whereEleList = PreparePerfomanceAdminDlrFilters(tableName, dataReq, true)
		case "Dealer Owner":
			dataReq.DealerName = name
			filter, whereEleList = PreparePerfomanceAdminDlrFilters(tableName, dataReq, false)
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			dataReq.DealerName = dealerName
			filter, whereEleList = PrepareSaleRepPerfFilters(tableName, dataReq, SaleRepList)
		default:
			rgnSalesMgrCheck = true
		}
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown is there are no sale rep are available under this particular user
		if len(data) == 0 {
			log.FuncErrorTrace(0, "No sale representative available under user: %v", err)
			FormAndSendHttpResp(resp, "No sale representative available under user", http.StatusBadRequest, nil)
			return
		}

		// this loops through sales rep under regional or sales manager
		for _, item := range data {
			SaleRepName, Ok := item["name"]
			if !Ok || SaleRepName == "" {
				log.FuncErrorTrace(0, "Failed to get name. Item: %+v\n", item)
				continue
			}
			SaleRepList = append(SaleRepList, SaleRepName)
		}

		dealerName := data[0]["dealer_name"]
		dataReq.DealerName = dealerName
		filter, whereEleList = PrepareSaleRepPerfFilters(tableName, dataReq, SaleRepList)
	}

	if filter == "" {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	allDatas := make(map[string][]map[string]interface{}, 0)
	dates = append(dates, "contract_date", "ntp_date", "cancelled_date", "pv_install_completed_date")
	for _, date := range dates {
		firstFilter = PrepareDateFilters(date)
		queryWithFiler = query + firstFilter + filter

		data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get perfomance sales from DB for %v err: %v", date, err)
			FormAndSendHttpResp(resp, "Failed to get perfomance sales from DB for %v", http.StatusBadRequest, date)
			return
		}
		allDatas[date] = data
	}

	perfomanceData := models.PerfomanceMetricsResp{}
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
		perfomanceData.PerfomanceSalesMetrics = append(perfomanceData.PerfomanceSalesMetrics, models.PerfomanceSales{
			Type:    date,
			Sales:   Sales,
			SalesKw: SalesKw,
		})
	}

	// this will give zero value and will be modified once the rep pay calculations are done
	perfomanceData.PerfomanceCommissionMetrics.CancellationPeriod = 0
	perfomanceData.PerfomanceCommissionMetrics.InstallationPeriod = 0
	perfomanceData.PerfomanceCommissionMetrics.SalesPeriod = 0

	log.FuncInfoTrace(0, "total perfomance report list %+v", len(perfomanceData.PerfomanceSalesMetrics))
	FormAndSendHttpResp(resp, "perfomance report", http.StatusOK, perfomanceData)
}

/******************************************************************************
* FUNCTION:		PreparePerfomanceFilters
* DESCRIPTION:     handler for secondary filter for admin and dealer
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PreparePerfomanceAdminDlrFilters(columnName string, dataFilter models.GetPerfomanceReq, adminCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePerfomanceAdminDlrFilters")
	defer func() { log.ExitFn(0, "PreparePerfomanceAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true

	if !adminCheck {
		if !whereAdded {
			filtersBuilder.WriteString(" WHERE ")
		} else {
			filtersBuilder.WriteString(" AND ")
		}
		filtersBuilder.WriteString(fmt.Sprintf("dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}

/*
*****************************************************************************
  - FUNCTION:		PrepareSaleRepPerfFilters
  - DESCRIPTION:    handler for secondary filter for regional, sales manager and
    sale rep
  - INPUT:			resp, req
  - RETURNS:    		void

*****************************************************************************
*/
func PrepareSaleRepPerfFilters(tableName string, dataFilter models.GetPerfomanceReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true

	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
	}

	filtersBuilder.WriteString(" primary_sales_rep IN (")
	for i, sale := range saleRepList {
		filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, sale)

		if i < len(saleRepList)-1 {
			filtersBuilder.WriteString(", ")
		}
	}

	filtersBuilder.WriteString(fmt.Sprintf(") AND dealer = $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PrepareDateFilters
* DESCRIPTION:     handler for prepare primary filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareDateFilters(columnName string) (filters string) {
	log.EnterFn(0, "PrepareDateFilters")
	defer func() { log.ExitFn(0, "PrepareDateFilters", nil) }()

	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(" WHERE ")

	switch columnName {
	case "contract_date":
		filtersBuilder.WriteString(" contract_date BETWEEN current_date - interval '90 days' AND current_date")
	case "ntp_date":
		filtersBuilder.WriteString(" ntp_date BETWEEN current_date - interval '90 days' AND current_date")
	case "cancelled_date":
		filtersBuilder.WriteString(" cancelled_date BETWEEN current_date - interval '90 days' AND current_date")
	case "pv_install_completed_date":
		filtersBuilder.WriteString(" pv_install_completed_date BETWEEN current_date - interval '90 days' AND current_date")
	}
	filters = filtersBuilder.String()
	return filters
}
