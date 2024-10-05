/**************************************************************************
 * File       	   : apiGetPerfomanceTileData.go
 * DESCRIPTION     : This file contains functions for get performance tile data handler
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
 * FUNCTION:		HandleManagePerformanceTileDataRequest
 * DESCRIPTION:     handler for get performance tile data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleManagePerformanceTileDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		data             []map[string]interface{}
		dataReq          models.GetPerformanceTileDataReq
		query            string
		whereEleList     []interface{}
		rgnSalesMgrCheck bool
		filter           string
		SaleRepList      []interface{}
	)

	log.EnterFn(0, "HandleManagePerformanceTileDataRequest")
	defer func() { log.ExitFn(0, "HandleManagePerformanceTileDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get perfomance tile data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get perfomance tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get perfomance tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get perfomance tile data Request body", http.StatusBadRequest, nil)
		return
	}

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	// change table name here
	//tableName := db.ViewName_REP_PAY
	var tableName string
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role, _ := data[0]["role_name"].(string)
		name, _ := data[0]["name"].(string)
		dealerName, _ := data[0]["dealer_name"].(string)
		rgnSalesMgrCheck = false

		switch role {
		case "Admin":
			filter, whereEleList = PreparePerfromanceAdminDlrFilters(tableName, dataReq, true, false, false)
			break
		case "Dealer Owner":
			dataReq.DealerName = name
			filter, whereEleList = PreparePerfromanceAdminDlrFilters(tableName, dataReq, false, false, false)
			break
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			dataReq.DealerName = dealerName
			filter, whereEleList = PreparePerformanceSaleRepFilters(tableName, dataReq, SaleRepList)
			break
		// this is for the roles regional manager and sales manager
		default:
			rgnSalesMgrCheck = true
		}
	} else {
		log.FuncErrorTrace(0, "Failed to get perfomance tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get perfomance tile data", http.StatusBadRequest, nil)
		return
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and for other user roles
		if len(data) == 0 {
			emptyPerfomanceList := models.PerfomanceListResponse{
				PerfomanceList: []models.PerfomanceResponse{},
			}
			log.FuncErrorTrace(0, "No projects or sale representatives: %v", err)
			appserver.FormAndSendHttpResp(resp, "No projects or sale representatives", http.StatusOK, emptyPerfomanceList, int64(len(data)))
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

		dealerName := data[0]["dealer_name"].(string)
		dataReq.DealerName = dealerName
		filter, whereEleList = PreparePerformanceSaleRepFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" {
		query = fmt.Sprintf(
			`SELECT 
				(SELECT SUM(net_comm) FROM rep_pay_pr_data %s) AS all_sales, 
				(SELECT SUM(net_comm) FROM rep_pay_pr_data %s AND current_status = 'INSTALL') AS total_installation, 
				(SELECT SUM(net_comm) FROM rep_pay_pr_data %s AND current_status = 'CANCEL') AS total_cancellation`,
			filter, filter, filter)
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get reppay tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get reppay tile data from DB", http.StatusBadRequest, nil)
		return
	}

	allSales, _ := data[0]["all_sales"].(float64)
	totalCancellation, _ := data[0]["total_installation"].(float64)
	totalInstallation, _ := data[0]["total_cancellation"].(float64)

	// Prepare response data structure
	dealerPayTileData := models.GetPerformanceTileData{
		AllSales:          allSales,
		TotalCancellation: totalCancellation,
		TotalInstallation: totalInstallation,
	}

	// Log the data being sent
	log.FuncDebugTrace(0, "performance tiles data: %+v", dealerPayTileData)

	// Send response using appserver.FormAndSendHttpResp function
	appserver.FormAndSendHttpResp(resp, "performance tile data retrieved successfully", http.StatusOK, dealerPayTileData)
}

/******************************************************************************
 * FUNCTION:		PreparePerfromanceAdminDlrFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PreparePerfromanceAdminDlrFilters(tableName string, dataFilter models.GetPerformanceTileDataReq, adminCheck, fitlterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePerfromanceAdminDlrFilters")
	defer func() { log.ExitFn(0, "PreparePerfromanceAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Change to false since WHERE clause is being added dynamically

	startDate, err := time.Parse("2006-01-02", dataFilter.StartDate) // Correct date format for parsing
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting date")
	}
	endDate, err := time.Parse("2006-01-02", dataFilter.EndDate) // Correct date format for parsing
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting date")
	}

	endDate = endDate.Add(24*time.Hour - time.Second)

	whereEleList = append(whereEleList,
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	)

	// contract_date, pv_installdate, cancel_date
	if !whereAdded {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	filtersBuilder.WriteString(fmt.Sprintf(" (rep_pay_pr_data.wc BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-5, len(whereEleList)-4))
	filtersBuilder.WriteString(fmt.Sprintf(" OR rep_pay_pr_data.pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-3, len(whereEleList)-2))
	filtersBuilder.WriteString(fmt.Sprintf(" OR rep_pay_pr_data.cancel_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS'))", len(whereEleList)-1, len(whereEleList)))

	if !adminCheck && !fitlterCheck {
		filtersBuilder.WriteString(fmt.Sprintf(" AND rep_pay_pr_data.dealer_code = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

// /******************************************************************************
//   - FUNCTION:		PreparePerformanceSaleRepFilters
//   - DESCRIPTION:     handler for prepare filter
//   - INPUT:			resp, req
//   - RETURNS:    		void
//     ******************************************************************************/
func PreparePerformanceSaleRepFilters(tableName string, dataFilter models.GetPerformanceTileDataReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePerformanceSaleRepFilters")
	defer func() { log.ExitFn(0, "PreparePerformanceSaleRepFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Change to false since WHERE clause is being added dynamically

	startDate, err := time.Parse("2006-01-02", dataFilter.StartDate) // Correct date format for parsing
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting date")
	}
	endDate, err := time.Parse("2006-01-02", dataFilter.EndDate) // Correct date format for parsing
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting date")
	}

	endDate = endDate.Add(24*time.Hour - time.Second)

	whereEleList = append(whereEleList,
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	)

	// contract_date, pv_installdate, cancel_date
	if !whereAdded {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}

	filtersBuilder.WriteString(fmt.Sprintf(" (rep_pay_pr_data.wc BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-5, len(whereEleList)-4))
	filtersBuilder.WriteString(fmt.Sprintf(" OR rep_pay_pr_data.pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-3, len(whereEleList)-2))
	filtersBuilder.WriteString(fmt.Sprintf(" OR rep_pay_pr_data.cancel_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS'))", len(whereEleList)-1, len(whereEleList)))

	filtersBuilder.WriteString(" AND rep_pay_pr_data.owe_contractor IN (")
	for i, sale := range saleRepList {
		filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, sale)

		if i < len(saleRepList)-1 {
			filtersBuilder.WriteString(", ")
		}
	}

	filtersBuilder.WriteString(fmt.Sprintf(") AND rep_pay_pr_data.dealer_code = $%d AND rep_pay_pr_data.unique_id != '' ", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
