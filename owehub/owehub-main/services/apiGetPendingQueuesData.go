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
	"OWEApp/shared/types"
	"encoding/json"
	"io/ioutil"
	"strings"
	"time"

	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetPendingQuesTileDataRequest
 * DESCRIPTION:     handler for get pending queue data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetPendingQuesTileDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetPendingQuesTileDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPendingQuesTileDataRequest", err) }()

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
			emptyPerfomanceList := models.GetPendingQueueList{
				PendingQueueList: []models.GetPendingQueue{},
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
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))
	pendingqueueList := models.GetPendingQueueList{}

	for _, item := range data {
		var ntp models.NTP
		var qc models.QC
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

		ntp.ProductionDiscrepancy, _ = getStringValue(item, "production_discrepancy", ntpD)
		ntp.FinanceNTPOfProject, _ = getStringValue(item, "finance_ntp_of_project", ntpD)
		ntp.UtilityBillUploaded, _ = getStringValue(item, "utility_bill_uploaded", ntpD)
		ntp.PowerClerkSignaturesComplete, _ = getStringValue(item, "powerclerk_signatures_complete", ntpD)
		qc.PowerClerk, _ = getStringValue(item, "powerclerk_sent_az", ntpD)
		qc.ACHWaiveSendandSignedCashOnly, _ = getStringValue(item, "ach_waiver_sent_and_signed_cash_only", ntpD)
		qc.GreenAreaNMOnly, _ = getStringValue(item, "green_area_nm_only", ntpD)
		qc.FinanceCreditApprovalLoanorLease, _ = getStringValue(item, "finance_credit_approved_loan_or_lease", ntpD)
		qc.FinanceAgreementCompletedLoanorLease, _ = getStringValue(item, "finance_agreement_completed_loan_or_lease", ntpD)
		qc.OWEDocumentsCompleted, _ = getStringValue(item, "owe_documents_completed", ntpD)

		PendingQueue := models.GetPendingQueue{
			UniqueId:  UniqueId,
			HomeOwner: HomeOwner,
			Ntp:       ntp,
			Qc:        qc,
		}

		pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)
	}

	paginatedData := Paginate(pendingqueueList.PendingQueueList, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	log.FuncInfoTrace(0, "Number of pending queue List fetched : %v list %+v", len(paginatedData), paginatedData)
	FormAndSendHttpResp(resp, "Pending queue Data", http.StatusOK, paginatedData, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAdminDlrFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func PrepareAdminDlrPendingQueueFilters(tableName string, dataFilter models.PendingQueueReq, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
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
		filtersBuilder.WriteString(fmt.Sprintf(" cv.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 && !filterCheck {
		if whereAdded {
			filtersBuilder.WriteString(" AND")
		} else {
			filtersBuilder.WriteString(" WHERE")
			whereAdded = true
		}
		filtersBuilder.WriteString(" LOWER(cv.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")
	}

	if len(dataFilter.UniqueIds) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" OR ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" cv.home_owner ILIKE ANY (ARRAY[")
		for i, filter := range dataFilter.UniqueIds {
			// Wrap the filter in wildcards for pattern matching
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
			whereEleList = append(whereEleList, "%"+filter+"%") // Match anywhere in the string

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString("]) ")
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
 * FUNCTION:		PrepareInstallCostFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareSaleRepPendingQueueFilters(tableName string, dataFilter models.PendingQueueReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
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

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE cv.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	if len(dataFilter.UniqueIds) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(" LOWER(cv.unique_id) IN (")
		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("LOWER($%d)", len(whereEleList)+1))
			whereEleList = append(whereEleList, filter)

			if i < len(dataFilter.UniqueIds)-1 {
				filtersBuilder.WriteString(", ")
			}
		}
		filtersBuilder.WriteString(") ")
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

func getPendingQueueStringValue(data map[string]interface{}, key string, ntp_date string) (string, int64) {
	if v, exists := data[key]; exists {
		switch key {
		case "production_discrepancy":
			if (v == "" || v == "<nil>") && ntp_date == "" {
				return "Pending", 1
			} else {
				return "Completed", 0
			}
		case "finance_ntp_of_project":
			if (v == "" || v == "<nil>") && ntp_date == "" {
				return "Pending", 1
			} else if (v == "❌  M1" || v == "❌  Approval" || v == "❌  Stips") && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "utility_bill_uploaded":
			if (v == "" || v == "<nil>") && ntp_date == "" {
				return "Pending", 1
			} else if v == "❌" && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "powerclerk_signatures_complete":
			if (v == "" || v == "❌  Pending CAD (SRP)" || v == "<nil>") && ntp_date == "" {
				return "Pending", 1
			} else if (v == "❌  Pending" || v == "❌  Pending Sending PC" || v == "❌ Pending Sending PC") && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "powerclerk_sent_az":
			if v != "Not Needed" {
				if v == "" || v == "NULL" || v == "<nil>" || ntp_date == "" {
					return "Pending", 1
				} else if v == "Pending Utility Account #" || ntp_date == "" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "ach_waiver_sent_and_signed_cash_only":
			if v != "Not Needed" {
				if v == "" || v == "NULL" || v == "<nil>" || ntp_date == "" {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "green_area_nm_only":
			if v != "Not Needed" {
				if v == "" || v == "NULL" || v == "<nil>" || ntp_date == "" {
					return "Pending", 1
				} else if v == "❌ (Project DQ'd)" || v == "❌  (Project DQ'd)" || ntp_date == "" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "finance_credit_approved_loan_or_lease":
			if v != "Not Needed" {
				if v == "" || v == "NULL" || v == "<nil>" || ntp_date == "" {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "finance_agreement_completed_loan_or_lease":
			if v != "Not Needed" {
				if v == "" || v == "NULL" || v == "<nil>" || ntp_date == "" {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "owe_documents_completed":
			if v != "Not Needed" {
				if v == "" || v == "NULL" || v == "<nil>" || ntp_date == "" {
					return "Pending", 1
				} else if v == "❌" || ntp_date == "" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		}
	}
	return "", 0
}
