/**************************************************************************
 * File       	   : apiGetPendingQueueData.go
 * DESCRIPTION     : This file contains functions for get pending queue data handler
 * DATE            : 04-Sep-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"encoding/json"
	"io/ioutil"
	"strings"
	"time"

	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetPendingQuesDataRequest
 * DESCRIPTION:     handler for get pending queue data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetPendingQuesDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.PendingQueueReq
		data        []map[string]interface{}
		RecordCount int64
		ntpD        string
		CoStatus    string
		prospectId  string
	)

	log.EnterFn(0, "HandleGetPendingQuesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPendingQuesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get pending queue data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get pending queue data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get pending queue data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get pending queue data Request body", http.StatusBadRequest, nil)
		return
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	userRole := req.Context().Value("rolename").(string)
	if len(userRole) == 0 {
		appserver.FormAndSendHttpResp(resp, "Unauthorized Role", http.StatusBadRequest, nil)
		return
	}

	if userRole == string(types.RoleAccountManager) || userRole == string(types.RoleAccountExecutive) {
		accountName, err := fetchAmAeName(dataReq.Email)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
			return
		}
		var roleBase string
		if userRole == "Account Manager" {
			roleBase = "account_manager"
		} else {
			roleBase = "account_executive"
		}
		query := fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncErrorTrace(0, "empty data set from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "pending queue Data", http.StatusOK, tileData, RecordCount)
			return
		}

		for _, val := range data {
			dataReq.DealerNames = append(dataReq.DealerNames, val["data"].(string))
		}
	} else if userRole == string(types.RoleAdmin) || userRole == string(types.RoleFinAdmin) {
		query := "SELECT sales_partner_name as data FROM sales_partner_dbhub_schema"
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncErrorTrace(0, "empty data set from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "pending queue Data", http.StatusOK, tileData, RecordCount)
			return
		}

		for _, val := range data {
			dataReq.DealerNames = append(dataReq.DealerNames, val["data"].(string))
		}
	}

	roleFilter, err := HandleDataFilterOnUserRoles(dataReq.Email, userRole, "customers_customers_schema", dataReq.DealerNames)
	if err != nil {
		if !strings.Contains(err.Error(), "<not an error>") && !strings.Contains(err.Error(), "<emptyerror>") {
			log.FuncErrorTrace(0, "error creating user role query %v", err)
			appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
			return
		} else if strings.Contains(err.Error(), "<emptyerror>") || strings.Contains(err.Error(), "<not an error>") {
			tileData := models.GetPendingQueueTileResp{}
			appserver.FormAndSendHttpResp(resp, "perfomance tile Data", http.StatusOK, tileData, RecordCount)
			return
		}
	}

	searchValue := ""
	if len(dataReq.UniqueIds) > 0 {
		searchValue = fmt.Sprintf(" AND (customers_customers_schema.customer_name ILIKE '%%%s%%' OR customers_customers_schema.unique_id ILIKE '%%%s%%') ", dataReq.UniqueIds[0], dataReq.UniqueIds[0])
	}

	if dataReq.SelectedPendingStage == "co" {
		query := models.PendingActionPageCoQuery(roleFilter, searchValue)
		data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncErrorTrace(0, "empty data set from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "pending queue Data", http.StatusOK, tileData, RecordCount)
			return
		}
	} else {
		query := models.PendingActionPageNtpQuery(roleFilter, searchValue)
		data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncErrorTrace(0, "empty data set from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "pending queue Data", http.StatusOK, tileData, RecordCount)
			return
		}
	}

	pendingqueueList := models.GetPendingQueueList{}

	for _, item := range data {
		// Fetch and validate UniqueId
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			UniqueId = ""
			log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
			continue
		}

		if val, ok := item["change_order_status"].(string); ok {
			CoStatus = val
		} else {
			CoStatus = "" // or a default value
		}

		// Fetch and validate HomeOwner
		HomeOwner, ok := item["home_owner"].(string)
		if !ok || HomeOwner == "" {
			HomeOwner = ""
			log.FuncErrorTrace(0, "Failed to get HomeOwner. Item: %+v\n", item)
		}

		ntpDate, ok := item["ntp_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			ntpD = ""
		} else {
			ntpD = ntpDate.Format("2006-01-02")
		}

		if val, ok := item["first_value"].(string); ok {
			prospectId = val
		} else {
			prospectId = "" // or a default value
		}

		ProductionDiscrepancy, _ := getPendingQueueStringValue(item, "production_discrepancy", ntpD, prospectId)
		FinanceNTPOfProject, _ := getPendingQueueStringValue(item, "finance_ntp_of_project", ntpD, prospectId)
		UtilityBillUploaded, _ := getPendingQueueStringValue(item, "utility_bill_uploaded", ntpD, prospectId)
		PowerClerkSignaturesComplete, _ := getPendingQueueStringValue(item, "powerclerk_signatures_complete", ntpD, prospectId)
		PowerClerk, _ := getPendingQueueStringValue(item, "powerclerk_sent_az", ntpD, prospectId)
		ACHWaiveSendandSignedCashOnly, _ := getPendingQueueStringValue(item, "ach_waiver_sent_and_signed_cash_only", ntpD, prospectId)
		GreenAreaNMOnly, _ := getPendingQueueStringValue(item, "green_area_nm_only", ntpD, prospectId)
		FinanceCreditApprovalLoanorLease, _ := getPendingQueueStringValue(item, "finance_credit_approved_loan_or_lease", ntpD, prospectId)
		FinanceAgreementCompletedLoanorLease, _ := getPendingQueueStringValue(item, "finance_agreement_completed_loan_or_lease", ntpD, prospectId)
		OWEDocumentsCompleted, _ := getPendingQueueStringValue(item, "owe_documents_completed", ntpD, prospectId)
		// CoStatus, _ := getPendingQueueStringValue(item, "change_order_status", ntpD, prospectId)
		PendingQueue := models.GetPendingQueue{
			UniqueId:  UniqueId,
			HomeOwner: HomeOwner,
			COStatus:  CoStatus,
			Ntp: models.PendingQueueNTP{
				ProductionDiscrepancy:        ProductionDiscrepancy,
				FinanceNTPOfProject:          FinanceNTPOfProject,
				UtilityBillUploaded:          UtilityBillUploaded,
				PowerClerkSignaturesComplete: PowerClerkSignaturesComplete,
			},
			Qc: models.PendingQueueQC{
				PowerClerk:                           PowerClerk,
				ACHWaiveSendandSignedCashOnly:        ACHWaiveSendandSignedCashOnly,
				GreenAreaNMOnly:                      GreenAreaNMOnly,
				FinanceCreditApprovalLoanorLease:     FinanceCreditApprovalLoanorLease,
				FinanceAgreementCompletedLoanorLease: FinanceAgreementCompletedLoanorLease,
				OWEDocumentsCompleted:                OWEDocumentsCompleted,
			},
		}
		// switch dataReq.SelectedPendingStage {
		// case "ntp":
		// 	if ntpProductionDiscripencyCount == 1 || ntpFinanceNtpOfProjectCount == 1 ||
		// 		ntputilityBillUploadedCount == 1 || ntpPowerClerkSignatutreCount == 1 {
		pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
		// 		}
		// 	case "qc":
		// 		if QcFinanceAggrementCount == 1 || QcPowerclerkSentAz == 1 || QcAchWaiverSendAndSignedCount == 1 ||
		// 			QcGreenAreaNmOnlyCount == 1 || QcFinanceCreditAPprovedCount == 1 || qcOweDocumentCount == 1 {
		// 			pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
		// 		}
		// 	case "co":
		// 		if coStatusCount == 1 {
		// 			pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
		// 		}
		// 	default:
		// 		pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
		// 	}
		// }
	}

	RecordCount = int64(len(pendingqueueList.PendingQueueList))

	paginatedData := Paginate(pendingqueueList.PendingQueueList, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	log.FuncInfoTrace(0, "Number of pending queue List fetched : %v list %+v", len(paginatedData), paginatedData)
	appserver.FormAndSendHttpResp(resp, "Pending queue Data", http.StatusOK, paginatedData, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAdminDlrPendingQueueFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func PrepareAdminDlrPendingQueueFilters(tableName string, dataFilter models.PendingQueueReq, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdminDlrPendingQueueFilters")
	defer func() { log.ExitFn(0, "PrepareAdminDlrPendingQueueFilters", nil) }()

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
		filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 && !filterCheck {
		// Start with a WHERE clause if none has been added yet
		if whereAdded {
			filtersBuilder.WriteString(" AND (") // Start a group for OR conditions
		} else {
			filtersBuilder.WriteString(" WHERE (") // Start a group for OR conditions
			whereAdded = true
		}

		// Add condition for LOWER(cv.unique_id) IN (...)
		filtersBuilder.WriteString("LOWER(customers_customers_schema.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for cv.unique_id ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(customers_customers_schema.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for cv.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR customers_customers_schema.customer_name ILIKE ANY (ARRAY[")
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

	if !adminCheck && !filterCheck {
		if len(dataFilter.DealerNames) > 0 { // Check if there are dealer names to filter
			if whereAdded {
				filtersBuilder.WriteString(" AND")
			} else {
				filtersBuilder.WriteString(" WHERE")
				whereAdded = true
			}

			// Prepare dealer names for SQL
			var dealerNames []string
			for _, dealer := range dataFilter.DealerNames {
				// Sanitize dealer names to prevent SQL injection
				sanitizedDealer := strings.ReplaceAll(dealer, "'", "''")
				dealerNames = append(dealerNames, fmt.Sprintf("'%s'", sanitizedDealer))
			}

			// Add the IN clause with dealer names directly in the query
			filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.dealer IN (%s)", strings.Join(dealerNames, ",")))
		}
	}

	// Always add the following filters
	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
	}
	filtersBuilder.WriteString(` customers_customers_schema.unique_id IS NOT NULL
			 AND customers_customers_schema.unique_id <> ''
			 AND system_customers_schema.contracted_system_size_parent IS NOT NULL
			 AND system_customers_schema.contracted_system_size_parent > 0
			 AND customers_customers_schema.project_status IN ('ACTIVE')`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
 * FUNCTION:		PrepareSaleRepPendingQueueFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareSaleRepPendingQueueFilters(tableName string, dataFilter models.PendingQueueReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareSaleRepPendingQueueFilters")
	defer func() { log.ExitFn(0, "PrepareSaleRepPendingQueueFilters", nil) }()

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

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE customers_customers_schema.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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
		filtersBuilder.WriteString("LOWER(customers_customers_schema.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(customers_customers_schema.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR customers_customers_schema.customer_name ILIKE ANY (ARRAY[")
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

		filtersBuilder.WriteString(" customers_customers_schema.primary_sales_rep IN (")
		for i, sale := range saleRepList {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, sale)

			if i < len(saleRepList)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(")")
	}

	if len(dataFilter.DealerNames) > 0 { // Check if there are dealer names to filter
		if whereAdded {
			filtersBuilder.WriteString(" AND")
		} else {
			filtersBuilder.WriteString(" WHERE")
			whereAdded = true
		}

		// Prepare dealer names for SQL
		var dealerNames []string
		for _, dealer := range dataFilter.DealerNames {
			// Sanitize dealer names to prevent SQL injection
			sanitizedDealer := strings.ReplaceAll(dealer, "'", "''")
			dealerNames = append(dealerNames, fmt.Sprintf("'%s'", sanitizedDealer))
		}

		// Add the IN clause with dealer names directly in the query
		filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.dealer IN (%s)", strings.Join(dealerNames, ",")))
	}

	// Add the always-included filters
	filtersBuilder.WriteString(` AND customers_customers_schema.unique_id IS NOT NULL
			 AND customers_customers_schema.unique_id <> ''
			 AND system_customers_schema.contracted_system_size_parent IS NOT NULL
			 AND system_customers_schema.contracted_system_size_parent > 0 
			 AND customers_customers_schema.project_status IN ('ACTIVE')`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		FetchPendingQueueProjectDealerForAmAe
* DESCRIPTION:  Retrieves a list of dealers for an Account Manager (AM) or Account Executive (AE)
*               based on the email provided in the request.
* INPUT:		dataReq - contains the request details including email.
*               role    - role of the user (Account Manager or Account Executive).
* RETURNS:		[]string - list of sales partner names.
*               error   - if any error occurs during the process.
******************************************************************************/
func FetchPendingQueueProjectDealerForAmAe(dataReq models.PendingQueueReq, userRole interface{}) ([]string, error) {
	log.EnterFn(0, "FetchPendingQueueProjectDealerForAmAe")
	defer func() { log.ExitFn(0, "FetchPendingQueueProjectDealerForAmAe", nil) }()

	var items []string

	accountName, err := fetchAmAeName(dataReq.Email)
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
