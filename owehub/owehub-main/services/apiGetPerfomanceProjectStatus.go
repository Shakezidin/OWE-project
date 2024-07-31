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
	"math"
	"strings"
	"time"

	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetPerfomanceProjectStatusRequest
* DESCRIPTION:     handler for get InstallCost data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPerfomanceProjectStatusRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.PerfomanceStatusReq
		data         []map[string]interface{}
		whereEleList []interface{}
		// whereEleListCount  []interface{}
		queryWithFiler string
		filter         string
		// filterCount        string
		ContractD          string
		PermitD            string
		PvInstallCompleteD string
		PtoD               string
		SiteD              string
		InstallD           string
		rgnSalesMgrCheck   bool
		RecordCount        int64
		SaleRepList        []interface{}
	)

	log.EnterFn(0, "HandleGetPerfomanceProjectStatusRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceProjectStatusRequest", err) }()

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

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	saleMetricsQuery := models.SalesMetricsRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	// this sets the data interval bracket for querying
	dataReq.IntervalDays = "90"
	// Check whether the user is Admin, Dealer, Sales Rep

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
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, true, false, false)
		case "Dealer Owner":
			dataReq.DealerName = name
			filter, whereEleList = PrepareAdminDlrFilters(tableName, dataReq, false, false, false)
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			dataReq.DealerName = dealerName
			filter, whereEleList = PrepareSaleRepFilters(tableName, dataReq, SaleRepList)
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

		dealerName := data[0]["dealer_name"]
		dataReq.DealerName = dealerName
		filter, whereEleList = PrepareSaleRepFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" {
		queryWithFiler = saleMetricsQuery + filter
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
	paginatedData := PaginateData(data, dataReq)
	perfomanceList := models.PerfomanceListResponse{}

	for _, item := range paginatedData {
		// if no unique id is present we skip that project
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
			continue
		}

		Customer, ok := item["home_owner"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get Customer Item: %+v\n", item)
			continue
		}

		ContractDate, ok := item["contract_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get ContractDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			ContractD = ""
		} else {
			ContractD = ContractDate.Format("2006-01-02")
		}

		PermitApprovedDate, ok := item["permit_approved_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PermitApprovedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PermitD = ""
		} else {
			PermitD = PermitApprovedDate.Format("2006-01-02")
		}

		PvInstallCompletedDate, ok := item["pv_install_completed_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PvInstallCompletedDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCompleteD = ""
		} else {
			PvInstallCompleteD = PvInstallCompletedDate.Format("2006-01-02")
		}

		PtoDate, ok := item["pto_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PtoD = ""
		} else {
			PtoD = PtoDate.Format("2006-01-02")
		}

		SiteSurveyCompleteDate, ok := item["site_survey_completed_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get SiteSurverCompleteDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			SiteD = ""
		} else {
			SiteD = SiteSurveyCompleteDate.Format("2006-01-02")
		}

		InstallReadyDate, ok := item["install_ready_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get InstallReadyDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			InstallD = ""
		} else {
			InstallD = InstallReadyDate.Format("2006-01-02")
		}

		perfomanceResponse := models.PerfomanceResponse{
			UniqueId:               UniqueId,
			Customer:               Customer,
			ContractDate:           ContractD,
			PermitApprovedDate:     PermitD,
			PvInstallCompletedDate: PvInstallCompleteD,
			PtoDate:                PtoD,
			SiteSurveyCompleteDate: SiteD,
			InstallReadyDate:       InstallD,
		}
		perfomanceList.PerfomanceList = append(perfomanceList.PerfomanceList, perfomanceResponse)
	}

	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v", len(perfomanceList.PerfomanceList), perfomanceList)
	FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, perfomanceList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareAdminDlrFilters
* DESCRIPTION:
		PaginateData function paginates data directly from the returned data itself
		without setting any offset value. For large data sizes, using an offset
		was creating performance issues. This approach manages to keep the response
		time under 2 seconds.
******************************************************************************/

func PaginateData(data []map[string]interface{}, req models.PerfomanceStatusReq) []map[string]interface{} {
	paginatedData := make([]map[string]interface{}, 0, req.PageSize)

	startIndex := (req.PageNumber - 1) * req.PageSize
	endIndex := int(math.Min(float64(startIndex+req.PageSize), float64(len(data))))

	if startIndex >= len(data) || startIndex >= endIndex {
		return make([]map[string]interface{}, 0)
	}

	paginatedData = append(paginatedData, data[startIndex:endIndex]...)
	return paginatedData
}

/******************************************************************************
* FUNCTION:		PrepareAdminDlrFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareAdminDlrFilters(tableName string, dataFilter models.PerfomanceStatusReq, adminCheck, fitlterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true

	filtersBuilder.WriteString(" WHERE")

	startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
	endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

	endDate = endDate.Add(24*time.Hour - time.Second)

	whereEleList = append(whereEleList,
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	)

	filtersBuilder.WriteString(fmt.Sprintf(" (salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-11, len(whereEleList)-10))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.permit_approved_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-9, len(whereEleList)-8))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-7, len(whereEleList)-6))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.pto_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-5, len(whereEleList)-4))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.site_survey_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-3, len(whereEleList)-2))
	filtersBuilder.WriteString(fmt.Sprintf(" OR fieldOpsSchema.install_ready_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS'))", len(whereEleList)-1, len(whereEleList)))

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 && !fitlterCheck {
		filtersBuilder.WriteString(" AND intOpsMetSchema.unique_id IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")
	}

	if !adminCheck && !fitlterCheck {
		if !whereAdded {
			filtersBuilder.WriteString(" WHERE ")
		} else {
			filtersBuilder.WriteString(" AND ")
		}
		filtersBuilder.WriteString(fmt.Sprintf("salMetSchema.dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	if !whereAdded {
		filtersBuilder.WriteString(` WHERE intOpsMetSchema.unique_id IS NOT NULL
			 AND intOpsMetSchema.unique_id <> ''
			 AND intOpsMetSchema.system_size IS NOT NULL
			 AND intOpsMetSchema.system_size > 0 `)
	} else {
		filtersBuilder.WriteString(` AND intOpsMetSchema.unique_id IS NOT NULL
			 AND intOpsMetSchema.unique_id <> ''
			 AND intOpsMetSchema.system_size IS NOT NULL
			 AND intOpsMetSchema.system_size > 0 `)
	}

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
func PrepareSaleRepFilters(tableName string, dataFilter models.PerfomanceStatusReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true
	filtersBuilder.WriteString(" WHERE")

	startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
	endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

	endDate = endDate.Add(24*time.Hour - time.Second)

	whereEleList = append(whereEleList,
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	)

	filtersBuilder.WriteString(fmt.Sprintf(" (salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-11, len(whereEleList)-10))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.permit_approved_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-9, len(whereEleList)-8))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-7, len(whereEleList)-6))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.pto_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-5, len(whereEleList)-4))
	filtersBuilder.WriteString(fmt.Sprintf(" OR intOpsMetSchema.site_survey_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-3, len(whereEleList)-2))
	filtersBuilder.WriteString(fmt.Sprintf(" OR fieldOpsSchema.install_ready_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS'))", len(whereEleList)-1, len(whereEleList)))

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 {
		// whereAdded = true
		filtersBuilder.WriteString(" AND ")
		filtersBuilder.WriteString(" intOpsMetSchema.unique_id IN (")

		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")
	}

	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
	}

	filtersBuilder.WriteString(" salMetSchema.primary_sales_rep IN (")
	for i, sale := range saleRepList {
		filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, sale)

		if i < len(saleRepList)-1 {
			filtersBuilder.WriteString(", ")
		}
	}

	filtersBuilder.WriteString(fmt.Sprintf(") AND salMetSchema.dealer = $%d ", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	if !whereAdded {
		filtersBuilder.WriteString(` WHERE intOpsMetSchema.unique_id IS NOT NULL
			 AND intOpsMetSchema.unique_id <> ''
			 AND intOpsMetSchema.system_size IS NOT NULL
			 AND intOpsMetSchema.system_size > 0 `)
	} else {
		filtersBuilder.WriteString(` AND intOpsMetSchema.unique_id IS NOT NULL
			 AND intOpsMetSchema.unique_id <> ''
			 AND intOpsMetSchema.system_size IS NOT NULL
			 AND intOpsMetSchema.system_size > 0 `)
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
