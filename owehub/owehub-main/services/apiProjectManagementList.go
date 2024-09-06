/**************************************************************************
 * File       	   : apiGetPerfomanceProjectManagementList.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetProjectManagementRequest
* DESCRIPTION:     handler for get ProjectManagement data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPrjctMngmntListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		dataReq          models.ProjectStatusReq
		data             []map[string]interface{}
		whereEleList     []interface{}
		queryWithFiler   string
		filter           string
		rgnSalesMgrCheck bool
		SaleRepList      []interface{}
		role             string
	)

	log.EnterFn(0, "HandleGetPrjctMngmntListRequest")
	defer func() { log.ExitFn(0, "HandleGetPrjctMngmntListRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ProjectManagement data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ProjectManagement data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ProjectManagement data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get ProjectManagement data Request body", http.StatusBadRequest, nil)
		return
	}

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	saleMetricsQuery := models.SalesRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	email := req.Context().Value("emailid").(string)
	dataReq.Email = email
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist in DB 1", http.StatusBadRequest, nil)
		return
	}

	// Check whether the user is Admin, Dealer, Sales Rep
	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role = data[0]["role_name"].(string)
		name := data[0]["name"]
		dealerName := data[0]["dealer_name"]
		dataReq.DealerName = dealerName
		rgnSalesMgrCheck = false

		switch role {
		case "Admin", "Finance Admin":
			filter, whereEleList = PreparePrjtAdminDlrFilters(tableName, dataReq, true)
		case "Dealer Owner":
			filter, whereEleList = PreparePrjtAdminDlrFilters(tableName, dataReq, false)
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PreparePrjtSaleRepFilters(tableName, dataReq, SaleRepList)
		// this is for roles regional manager & sales manager
		default:
			SaleRepList = append(SaleRepList, name)
			rgnSalesMgrCheck = true
		}
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown is there are no sale rep are available under this particular user
		if len(SaleRepList) == 0 {
			log.FuncErrorTrace(0, "No projects or sale representatives: %v", err)
			FormAndSendHttpResp(resp, "No projects or sale representatives", http.StatusOK, []string{}, int64(0))
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

		filter, whereEleList = PreparePrjtSaleRepFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" || role == string(types.RoleAdmin) {
		queryWithFiler = saleMetricsQuery + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagement data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get ProjectManagement data from DB", http.StatusBadRequest, nil)
		return
	}

	projectList := []models.ProjectLstResponse{}
	for _, item := range data {
		UniqueId, ok := item["unique_id"].(string)
		if !ok {
			continue
		}
		Customer, ok := item["home_owner"].(string)
		if !ok {
			continue
		}
		projectList = append(projectList, models.ProjectLstResponse{
			UniqueId: UniqueId,
			Customer: Customer,
		})
	}

	recordLen := len(projectList)
	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v", len(projectList), recordLen)
	FormAndSendHttpResp(resp, "ProjectManagementStatus Data", http.StatusOK, projectList, int64(recordLen))
}

/******************************************************************************
* FUNCTION:		PreparePrjtAdminDlrFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PreparePrjtAdminDlrFilters(tableName string, dataFilter models.ProjectStatusReq, adminCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePrjtAdminDlrFilters")
	defer func() { log.ExitFn(0, "PreparePrjtAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

	if !adminCheck {
		if !whereAdded {
			filtersBuilder.WriteString(" WHERE ")
		} else {
			filtersBuilder.WriteString(" AND ")
		}
		filtersBuilder.WriteString(fmt.Sprintf("salMetSchema.dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
		whereAdded = true
	}

	if !whereAdded {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	} else {
		filtersBuilder.WriteString(" AND ")
	}
	// Add the always-included filters
	filtersBuilder.WriteString(` intOpsMetSchema.unique_id IS NOT NULL
			AND intOpsMetSchema.unique_id <> ''
			AND intOpsMetSchema.system_size IS NOT NULL
			AND intOpsMetSchema.system_size > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		if !whereAdded {
			filtersBuilder.WriteString(" WHERE ")
		} else {
			filtersBuilder.WriteString(" AND ")
		}
		whereAdded = true
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` salMetSchema.project_status IN (%s)`, statusList))
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PreparePrjtSaleRepFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PreparePrjtSaleRepFilters(tableName string, dataFilter models.ProjectStatusReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareProjectSaleRepFilters")
	defer func() { log.ExitFn(0, "PrepareProjectSaleRepFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Start with false, to determine if the WHERE clause should be added

	// Handle the primary sales rep filter
	if len(saleRepList) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString("salMetSchema.primary_sales_rep IN (")
		for i, sale := range saleRepList {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, sale)

			if i < len(saleRepList)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	// Handle the dealer filter
	if dataFilter.DealerName != "" {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(fmt.Sprintf("salMetSchema.dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	// Add additional conditions that don't depend on external inputs
	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}

	filtersBuilder.WriteString(`
		intOpsMetSchema.unique_id IS NOT NULL
		AND intOpsMetSchema.unique_id <> ''
		AND intOpsMetSchema.system_size IS NOT NULL
		AND intOpsMetSchema.system_size > 0`)

	// Handle the project status filter
	if len(dataFilter.ProjectStatus) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}

		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(" salMetSchema.project_status IN (%s)", statusList))
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
