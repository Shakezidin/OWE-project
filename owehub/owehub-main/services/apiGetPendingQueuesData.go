/**************************************************************************
 * File       	   : apiGetPendingQueueData.go
 * DESCRIPTION     : This file contains functions for get pending queue data handler
 * DATE            : 04-Sep-2024
 **************************************************************************/

package services

import (
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
		err              error
		dataReq          models.PendingQueueReq
		data             []map[string]interface{}
		whereEleList     []interface{}
		queryWithFiler   string
		filter           string
		dealerName       interface{}
		rgnSalesMgrCheck bool
		RecordCount      int64
		SaleRepList      []interface{}
		ntpD             string
	)

	log.EnterFn(0, "HandleGetPendingQuesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPendingQuesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get pending queue data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get pending queue data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get pending queue data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get pending queue data Request body", http.StatusBadRequest, nil)
		return
	}

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	qcNTPQuery := models.QcNtpRetrieveQueryFunc()
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
		dealerName = data[0]["dealer_name"]
		rgnSalesMgrCheck = false
		dataReq.DealerName = dealerName

		switch role {
		case string(types.RoleAdmin), string(types.RoleFinAdmin):
			filter, whereEleList = PrepareAdminDlrPendingQueueFilters(tableName, dataReq, true, false, false)
		case string(types.RoleDealerOwner):
			filter, whereEleList = PrepareAdminDlrPendingQueueFilters(tableName, dataReq, false, false, false)
		case string(types.RoleSalesRep):
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareSaleRepPendingQueueFilters(tableName, dataReq, SaleRepList)
		// this is for the roles regional manager and sales manager
		default:
			SaleRepList = append(SaleRepList, name)
			rgnSalesMgrCheck = true
		}
	} else {
		log.FuncErrorTrace(0, "Failed to get pending queue data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
		return
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and for other user roles
		if len(SaleRepList) == 0 {
			emptyPerfomanceList := models.GetPendingQueueList{
				PendingQueueList: []models.GetPendingQueue{},
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

		filter, whereEleList = PrepareSaleRepPendingQueueFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" {
		queryWithFiler = qcNTPQuery + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get pending queue data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
		return
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

		ProductionDiscrepancy, ntpProductionDiscripencyCount := getPendingQueueStringValue(item, "production_discrepancy", ntpD)
		FinanceNTPOfProject, ntpFinanceNtpOfProjectCount := getPendingQueueStringValue(item, "finance_ntp_of_project", ntpD)
		UtilityBillUploaded, ntputilityBillUploadedCount := getPendingQueueStringValue(item, "utility_bill_uploaded", ntpD)
		PowerClerkSignaturesComplete, ntpPowerClerkSignatutreCount := getPendingQueueStringValue(item, "powerclerk_signatures_complete", ntpD)
		PowerClerk, QcPowerclerkSentAz := getPendingQueueStringValue(item, "powerclerk_sent_az", ntpD)
		ACHWaiveSendandSignedCashOnly, QcAchWaiverSendAndSignedCount := getPendingQueueStringValue(item, "ach_waiver_sent_and_signed_cash_only", ntpD)
		GreenAreaNMOnly, QcGreenAreaNmOnlyCount := getPendingQueueStringValue(item, "green_area_nm_only", ntpD)
		FinanceCreditApprovalLoanorLease, QcFinanceCreditAPprovedCount := getPendingQueueStringValue(item, "finance_credit_approved_loan_or_lease", ntpD)
		FinanceAgreementCompletedLoanorLease, QcFinanceAggrementCount := getPendingQueueStringValue(item, "finance_agreement_completed_loan_or_lease", ntpD)
		OWEDocumentsCompleted, qcOweDocumentCount := getPendingQueueStringValue(item, "owe_documents_completed", ntpD)
		CoStatus, coStatusCount := getPendingQueueStringValue(item, "change_order_status", ntpD)
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
		switch dataReq.SelectedPendingStage {
		case "ntp":
			if ntpProductionDiscripencyCount == 1 || ntpFinanceNtpOfProjectCount == 1 ||
				ntputilityBillUploadedCount == 1 || ntpPowerClerkSignatutreCount == 1 {
				pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
			}
		case "qc":
			if QcFinanceAggrementCount == 1 || QcPowerclerkSentAz == 1 || QcAchWaiverSendAndSignedCount == 1 ||
				QcGreenAreaNmOnlyCount == 1 || QcFinanceCreditAPprovedCount == 1 || qcOweDocumentCount == 1 {
				pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
			}
		case "co":
			if coStatusCount == 1 {
				pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
			}
		default:
			pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
		}
	}

	RecordCount = int64(len(pendingqueueList.PendingQueueList))

	paginatedData := Paginate(pendingqueueList.PendingQueueList, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	log.FuncInfoTrace(0, "Number of pending queue List fetched : %v list %+v", len(paginatedData), paginatedData)
	FormAndSendHttpResp(resp, "Pending queue Data", http.StatusOK, paginatedData, RecordCount)
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
		filtersBuilder.WriteString(fmt.Sprintf(" cv.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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
		filtersBuilder.WriteString("LOWER(cv.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for cv.unique_id ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(cv.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for cv.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR cv.home_owner ILIKE ANY (ARRAY[")
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
	if !adminCheck && !filterCheck {
		if whereAdded {
			filtersBuilder.WriteString(" AND")
		} else {
			filtersBuilder.WriteString(" WHERE")
			whereAdded = true
		}
		filtersBuilder.WriteString(fmt.Sprintf(" cv.dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	// Always add the following filters
	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
	}
	filtersBuilder.WriteString(` cv.unique_id IS NOT NULL
			 AND cv.unique_id <> ''
			 AND cv.system_size IS NOT NULL
			 AND cv.system_size > 0
			 AND cv.project_status IN ('BLOCKED','HOLD','HOLD - Exceptions','JEOPARDY','Unresponsive','Unworkable')`)

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

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE cv.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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
		filtersBuilder.WriteString("LOWER(cv.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")

		// Add OR condition for LOWER(cv.unique_id) ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR LOWER(cv.unique_id) ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("])")

		// Add OR condition for intOpsMetSchema.home_owner ILIKE ANY (ARRAY[...])
		filtersBuilder.WriteString(" OR cv.home_owner ILIKE ANY (ARRAY[")
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

		filtersBuilder.WriteString(" cv.primary_sales_rep IN (")
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
	filtersBuilder.WriteString(fmt.Sprintf(" cv.dealer = $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	// Add the always-included filters
	filtersBuilder.WriteString(` AND cv.unique_id IS NOT NULL
			 AND cv.unique_id <> ''
			 AND cv.system_size IS NOT NULL
			 AND cv.system_size > 0 
			 AND cv.project_status IN ('BLOCKED','HOLD','HOLD - Exceptions','JEOPARDY','Unresponsive','Unworkable')`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
