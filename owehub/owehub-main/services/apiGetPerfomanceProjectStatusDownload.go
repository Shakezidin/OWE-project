/**************************************************************************
 * File       	   : apiGetPerfomanceProjectStatus.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"io/ioutil"
	"strings"
	"time"

	"fmt"
	"net/http"
)

func HandleGetCsvDownloadRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		dataReq          models.GetCsvDownload
		data             []map[string]interface{}
		whereEleList     []interface{}
		queryWithFiler   string
		filter           string
		dealerName       interface{}
		rgnSalesMgrCheck bool
		RecordCount      int64
		SaleRepList      []interface{}
		query            string
		dealerIn         string
	)

	log.EnterFn(0, "HandleGetCsvDownloadRequest")
	defer func() { log.ExitFn(0, "HandleGetCsvDownloadRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceProjectStatus data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceProjectStatus data Request body", http.StatusBadRequest, nil)
		return
	}

	switch dataReq.Page {
	case "leaderboard":
		query = "SELECT unique_id,home_owner,customer_email,customer_phone_number,address,state,contract_total,system_size, contract_date FROM consolidated_data_view"
	case "performance":
		query = "SELECT unique_id,home_owner,customer_email,customer_phone_number,address,state,contract_total,system_size, contract_date,ntp_date, pv_install_completed_date, pto_date, cancelled_date FROM consolidated_data_view"
	}
	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	switch dataReq.Page {
	case "performance":
		whereEleList = append(whereEleList, dataReq.Email)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

		// This checks if the user is admin, sale rep or dealer
		if len(data) > 0 {
			role := data[0]["role_name"]
			name := data[0]["name"]
			dealerName = data[0]["dealer_name"]
			rgnSalesMgrCheck = false
			dataReq.Dealer = dealerName

			switch role {
			case "Admin", "Finance Admin":
				filter, whereEleList = PrepareAdminDlrCsvFilters(tableName, dataReq, true, false, false)
			case "Dealer Owner":
				filter, whereEleList = PrepareAdminDlrCsvFilters(tableName, dataReq, false, false, false)
			case "Sale Representative":
				SaleRepList = append(SaleRepList, name)
				filter, whereEleList = PrepareSaleRepCsvFilters(tableName, dataReq, SaleRepList)
			// this is for the roles regional manager and sales manager
			default:
				rgnSalesMgrCheck = true
			}
		} else {
			log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
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
				FormAndSendHttpResp(resp, "No projects or sale representatives", http.StatusOK, emptyPerfomanceList, int64(len(data)))
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
			filter, whereEleList = PrepareSaleRepCsvFilters(tableName, dataReq, SaleRepList)
		}
	case "leaderboard":
		if len(dataReq.DealerName) == 0 {
			errorResp := []string{}
			log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
			FormAndSendHttpResp(resp, "csv Data", http.StatusOK, errorResp, RecordCount)
			return
		}
		dealerIn = "dealer IN("
		for i, data := range dataReq.DealerName {
			if i > 0 {
				dealerIn += ","
			}
			escapedDealerName := strings.ReplaceAll(data, "'", "''")
			dealerIn += fmt.Sprintf("'%s'", escapedDealerName)
		}
		dealerIn += ")"
		filter, whereEleList = PrepareLeaderCsvDateFilters(dataReq, dealerIn)
	}

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))

	data = Paginate(data, int64(dataReq.PageSize), int64(dataReq.PageNumber))

	log.FuncInfoTrace(0, "Number of data List fetched : %v list %+v", len(data), data)
	FormAndSendHttpResp(resp, "csv Data", http.StatusOK, data, RecordCount)
}

/*
*****************************************************************************
  - FUNCTION:		PrepareAdminDlrFilters
  - DESCRIPTION:
    PaginateData function paginates data directly from the returned data itself
    without setting any offset value. For large data sizes, using an offset
    was creating performance issues. This approach manages to keep the response
    time under 2 seconds.

*****************************************************************************
*/

func PrepareAdminDlrCsvFilters(tableName string, dataFilter models.GetCsvDownload, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

	// Check if StartDate and EndDate are provided
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		filtersBuilder.WriteString(" WHERE")
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Add dealer filter if not adminCheck and not filterCheck
	if !adminCheck && !filterCheck {
		if whereAdded {
			filtersBuilder.WriteString(" AND")
		} else {
			filtersBuilder.WriteString(" WHERE")
			whereAdded = true
		}
		filtersBuilder.WriteString(fmt.Sprintf(" dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	// Always add the following filters
	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
	}
	filtersBuilder.WriteString(` unique_id IS NOT NULL
			AND unique_id <> ''
			AND system_size IS NOT NULL
			AND system_size > 0 
			AND project_status NOT IN ('CANCEL','PTO''d')`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PrepareInstallCostFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareSaleRepCsvFilters(tableName string, dataFilter models.GetCsvDownload, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

	// Start constructing the WHERE clause if the date range is provided
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Add sales representative filter
	if len(saleRepList) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" primary_sales_rep IN (")
		for i, sale := range saleRepList {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, sale)

			if i < len(saleRepList)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	// Add dealer filter
	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	filtersBuilder.WriteString(fmt.Sprintf(" dealer = $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	// Add the always-included filters
	filtersBuilder.WriteString(` AND unique_id IS NOT NULL
			AND unique_id <> ''
			AND system_size IS NOT NULL
			AND system_size > 0 
			AND project_status NOT IN ('CANCEL', 'PTO''d')`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func PrepareLeaderCsvDateFilters(dataReq models.GetCsvDownload, dealerIn string) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDateFilters")
	defer func() { log.ExitFn(0, "PrepareDateFilters", nil) }()

	var filtersBuilder strings.Builder

	if len(dealerIn) > 13 {
		filtersBuilder.WriteString(" WHERE ")
		filtersBuilder.WriteString(dealerIn)
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}
