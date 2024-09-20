/**************************************************************************
 * File       	   : apiGetUserAddressData.go
 * DESCRIPTION     : This file contains functions for get user address data handler
 * DATE            : 19-Sep-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetUserAddressDataRequest
 * DESCRIPTION:     handler for get user address data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetUserAddressDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		dataReq          models.GetUserAddressReq
		data             []map[string]interface{}
		whereEleList     []interface{}
		query            string
		RecordCount      int64
		rgnSalesMgrCheck bool
		filter           string
		SaleRepList      []interface{}
		queryWithFiler   string
	)

	log.EnterFn(0, "HandleGetUserAddressDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUserAddressDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get user address data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get user address request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get user address data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get user address data Request body", http.StatusBadRequest, nil)
		return
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

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role := data[0]["role_name"]
		name := data[0]["name"]
		dealerName, ok := data[0]["dealer_name"].(string)
		if !ok || dealerName == "" {
			dealerName = ""
		} else {
			dataReq.DealerNames = append(dataReq.DealerNames, dealerName)
		}
		rgnSalesMgrCheck = false

		switch role {
		case string(types.RoleAdmin), string(types.RoleFinAdmin):
			filter, whereEleList = PrepareAdminDlrAddressFilters(tableName, dataReq, false, false)
		case string(types.RoleDealerOwner):
			filter, whereEleList = PrepareAdminDlrAddressFilters(tableName, dataReq, false, false)
		case string(types.RoleAccountManager), string(types.RoleAccountExecutive):
			dealerNames, err := FetchProjectDealerForAmAndAe(dataReq.Email, role)
			if err != nil {
				FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
				return
			}

			if len(dealerNames) == 0 {
				FormAndSendHttpResp(resp, "No dealer list present for this user", http.StatusOK, []string{}, RecordCount)
				return
			} else {
				dataReq.DealerNames = dealerNames
			}
			filter, whereEleList = PrepareAdminDlrAddressFilters(tableName, dataReq, false, false)
		case string(types.RoleSalesRep):
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareSaleRepAddressFilters(tableName, dataReq, SaleRepList)
		// this is for the roles regional manager and sales manager
		default:
			SaleRepList = append(SaleRepList, name)
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
		if len(SaleRepList) == 0 {
			emptyPerfomanceList := models.PerfomanceListResponse{
				PerfomanceList: []models.PerfomanceResponse{},
			}
			log.FuncErrorTrace(0, "No sale representatives exist: %v", err)
			FormAndSendHttpResp(resp, "No sale representatives exist", http.StatusOK, emptyPerfomanceList, int64(len(data)))
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

		// dealerName = data[0]["dealer_name"]
		// dataReq.DealerName = dealerName
		filter, whereEleList = PrepareSaleRepAddressFilters(tableName, dataReq, SaleRepList)
	}

	query = `SELECT c.unique_id, c.address, c.home_owner, c.project_status, cs.address_lat, cs.address_lng
			FROM consolidated_data_view c
			LEFT JOIN customers_customers_schema cs ON c.unique_id = cs.unique_id `

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepType data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get RepType data from DB", http.StatusBadRequest, nil)
		return
	}

	UserAddressList := models.GetUserAddressList{}

	for _, item := range data {
		UniqueId, ok := item["unique_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", UniqueId, item)
			continue
		}
		Address, ok := item["address"].(string)
		if !ok || Address == "" {
			log.FuncErrorTrace(0, "Failed to get Address for Record ID %v. Item: %+v\n", UniqueId, item)
			Address = ""
		}
		HomeOwner, ok := item["home_owner"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get HomeOwner for Record ID %v. Item: %+v\n", UniqueId, item)
			HomeOwner = ""
		}

		Latitude, ok := item["address_lat"].(float64)
		if !ok || Latitude == 0.0 {
			log.FuncErrorTrace(0, "Failed to get latitude for Record ID %v. Item: %+v\n", UniqueId, item)
			Latitude = 0.0
		}

		Longitude, ok := item["address_lng"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Longitude for Record ID %v. Item: %+v\n", UniqueId, item)
			Longitude = 0.0
		}

		ProjectStatus, ok := item["project_status"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get ProjectStatus for Record ID %v. Item: %+v\n", UniqueId, item)
			ProjectStatus = ""
		}

		UserAddress := models.GetUserAddressData{
			UniqueId:      UniqueId,
			HomeOwner:     HomeOwner,
			Address:       Address,
			Latitute:      Latitude,
			Longitude:     Longitude,
			ProjectStatus: ProjectStatus,
		}

		UserAddressList.UserAddressList = append(UserAddressList.UserAddressList, UserAddress)
	}

	RecordCount = int64(len(data))

	result := Paginate(UserAddressList.UserAddressList, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	// Send the response
	log.FuncInfoTrace(0, "Number of user address List fetched : %v list %+v", len(result), result)
	FormAndSendHttpResp(resp, "user address Data", http.StatusOK, result, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareAdminDlrAddressFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareAdminDlrAddressFilters(tableName string, dataFilter models.GetUserAddressReq, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdminDlrAddressFilters")
	defer func() { log.ExitFn(0, "PrepareAdminDlrAddressFilters", nil) }()

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
		filtersBuilder.WriteString(fmt.Sprintf(" c.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 && !filterCheck {
		// Start with WHERE if none has been added
		if whereAdded {
			filtersBuilder.WriteString(" AND (") // Begin a group for the OR conditions
		} else {
			filtersBuilder.WriteString(" WHERE (") // Begin a group for the OR conditions
			whereAdded = true
		}

		// Add condition for LOWER(unique_id) IN (...)
		filtersBuilder.WriteString("LOWER(c.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(c.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR c.home_owner ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			// Wrap the filter in wildcards for pattern matching
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("]) ")

		// Close the OR group
		filtersBuilder.WriteString(")")
	}

	// Add dealer filter if not adminCheck and not filterCheck
	if len(dataFilter.DealerNames) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}
		filtersBuilder.WriteString(fmt.Sprintf(" c.dealer IN (%s) ", strings.Join(dataFilter.DealerNames, ",")))
		for _, dealer := range dataFilter.DealerNames {
			whereEleList = append(whereEleList, dealer)
		}
	}

	// Always add the following filters
	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
	}
	filtersBuilder.WriteString(` c.project_status != 'DUPLICATE'`)

	// filtersBuilder.WriteString(` unique_id IS NOT NULL
	// 		AND unique_id <> ''
	// 		AND system_size IS NOT NULL
	// 		AND system_size > 0`)

	// if len(dataFilter.ProjectStatus) > 0 {
	// 	// Prepare the values for the IN clause
	// 	var statusValues []string
	// 	for _, val := range dataFilter.ProjectStatus {
	// 		statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
	// 	}
	// 	// Join the values with commas
	// 	statusList := strings.Join(statusValues, ", ")

	// 	// Append the IN clause to the filters
	// 	filtersBuilder.WriteString(fmt.Sprintf(` AND project_status IN (%s)`, statusList))
	// } else {
	// 	filtersBuilder.WriteString(` AND project_status IN ('ACTIVE')`)

	// }

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PrepareSaleRepAddressFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareSaleRepAddressFilters(tableName string, dataFilter models.GetUserAddressReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareSaleRepAddressFilters")
	defer func() { log.ExitFn(0, "PrepareSaleRepAddressFilters", nil) }()

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

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE c.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 {
		// Start with WHERE if none has been added
		if whereAdded {
			filtersBuilder.WriteString(" AND (") // Begin a group for the OR conditions
		} else {
			filtersBuilder.WriteString(" WHERE (") // Begin a group for the OR conditions
			whereAdded = true
		}

		// Add condition for LOWER(intOpsMetSchema.unique_id) IN (...)
		filtersBuilder.WriteString("LOWER(c.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(c.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR c.home_owner ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			// Wrap the filter in wildcards for pattern matching
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("]) ")

		// Close the OR group
		filtersBuilder.WriteString(")")
	}

	// Add sales representative filter
	if len(saleRepList) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" c.primary_sales_rep IN (")
		for i, sale := range saleRepList {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, sale)

			if i < len(saleRepList)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	// Add dealer filter if not adminCheck and not filterCheck
	if len(dataFilter.DealerNames) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}
		filtersBuilder.WriteString(fmt.Sprintf(" c.dealer IN (%s) ", strings.Join(dataFilter.DealerNames, ",")))
		for _, dealer := range dataFilter.DealerNames {
			whereEleList = append(whereEleList, dealer)
		}
	}

	filtersBuilder.WriteString(` AND c.project_status != 'DUPLICATE'`)

	// // Add the always-included filters
	// filtersBuilder.WriteString(` AND unique_id IS NOT NULL
	// 		AND unique_id <> ''
	// 		AND system_size IS NOT NULL
	// 		AND system_size > 0`)

	// if len(dataFilter.ProjectStatus) > 0 {
	// 	// Prepare the values for the IN clause
	// 	var statusValues []string
	// 	for _, val := range dataFilter.ProjectStatus {
	// 		statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
	// 	}
	// 	// Join the values with commas
	// 	statusList := strings.Join(statusValues, ", ")

	// 	// Append the IN clause to the filters
	// 	filtersBuilder.WriteString(fmt.Sprintf(` AND project_status IN (%s)`, statusList))
	// } else {
	// 	filtersBuilder.WriteString(` AND project_status IN ('ACTIVE')`)
	// }

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		FetchProjectStatusDealerForAmAe
* DESCRIPTION:  Retrieves a list of dealers for an Account Manager (AM) or Account Executive (AE)
*               based on the email provided in the request.
* INPUT:		dataReq - contains the request details including email.
*               role    - role of the user (Account Manager or Account Executive).
* RETURNS:		[]string - list of sales partner names.
*               error   - if any error occurs during the process.
******************************************************************************/
func FetchProjectDealerForAmAndAe(Email string, userRole interface{}) ([]string, error) {
	log.EnterFn(0, "FetchProjectDealerAddressForAmAe")
	defer func() { log.ExitFn(0, "FetchProjectDealerAddressForAmAe", nil) }()

	var items []string

	accountName, err := fetchAmAeName(Email)
	if err != nil {
		log.FuncErrorTrace(0, "Unable to fetch name for Account Manager/Account Executive; err: %v", err)
		return nil, fmt.Errorf("unable to fetch name for account manager / account executive; err: %v", err)
	}

	var roleBase string
	role, _ := userRole.(string)
	if role == "Account Manager" {
		roleBase = "account_manager"
	} else {
		roleBase = "account_executive"
	}

	log.FuncInfoTrace(0, "Logged user %v is %v", accountName, roleBase)

	query := fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get partner_name from sales_partner_dbhub_schema; err: %v", err)
		return nil, fmt.Errorf("failed to get partner_name from sales_partner_dbhub_schema; err: %v", err)
	}

	for _, item := range data {
		name, ok := item["data"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to parse 'data' item: %+v", item)
			continue
		}
		items = append(items, name)
	}

	return items, nil
}
