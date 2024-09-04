/**************************************************************************
 * File       	   : apiGetPaindingQueueTileData.go
 * DESCRIPTION     : This file contains functions for get pendig queue tile data handler
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
		QcPendingCount   int64
		NTPPendingCount  int64
		CoPendingCount   int64
	)

	log.EnterFn(0, "HandleGetPendingQuesTileDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPendingQuesTileDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get pending queue tile data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get pending queue tile data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get pending queue tile data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get pending queue data tile Request body", http.StatusBadRequest, nil)
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
		log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get pending queue tile data", http.StatusBadRequest, nil)
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
		log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get pending queue tile data", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {

		ntpDate, ok := item["ntp_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			ntpD = ""
		} else {
			ntpD = ntpDate.Format("2006-01-02")
		}

		_, count := getPendingQueueStringValue(item, "production_discrepancy", ntpD)
		NTPPendingCount += count
		_, count = getPendingQueueStringValue(item, "finance_ntp_of_project", ntpD)
		NTPPendingCount += count
		_, count = getPendingQueueStringValue(item, "utility_bill_uploaded", ntpD)
		NTPPendingCount += count
		_, count = getPendingQueueStringValue(item, "powerclerk_signatures_complete", ntpD)
		QcPendingCount += count
		_, count = getPendingQueueStringValue(item, "powerclerk_sent_az", ntpD)
		QcPendingCount += count
		_, count = getPendingQueueStringValue(item, "ach_waiver_sent_and_signed_cash_only", ntpD)
		QcPendingCount += count
		_, count = getPendingQueueStringValue(item, "green_area_nm_only", ntpD)
		QcPendingCount += count
		_, count = getPendingQueueStringValue(item, "finance_credit_approved_loan_or_lease", ntpD)
		QcPendingCount += count
		_, count = getPendingQueueStringValue(item, "finance_agreement_completed_loan_or_lease", ntpD)
		QcPendingCount += count
		_, count = getPendingQueueStringValue(item, "owe_documents_completed", ntpD)
		QcPendingCount += count
		_, count = getPendingQueueStringValue(item, "change_order_status", ntpD)
		CoPendingCount += count
	}

	pendingQueueTile := models.GetPendingQueueTileResp{
		QcPendingCount:  QcPendingCount,
		NTPPendingCount: NTPPendingCount,
		CoPendingCount:  CoPendingCount,
	}

	log.FuncInfoTrace(0, "Number of pending queue tile List fetched : %v list %+v", 1, pendingQueueTile)
	FormAndSendHttpResp(resp, "pending queue tile Data", http.StatusOK, pendingQueueTile, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAdminDlrPendingQueueTileFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func PrepareAdminDlrPendingQueueTileFilters(tableName string, dataFilter models.PendingQueueReq, adminCheck, filterCheck, dataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdminDlrPendingQueueTileFilters")
	defer func() { log.ExitFn(0, "PrepareAdminDlrPendingQueueTileFilters", nil) }()

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
 * FUNCTION:		PrepareSaleRepPendingQueueTileFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareSaleRepPendingQueueTileFilters(tableName string, dataFilter models.PendingQueueReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareSaleRepPendingQueueTileFilters")
	defer func() { log.ExitFn(0, "PrepareSaleRepPendingQueueTileFilters", nil) }()

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
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 1
				} else if v == "Pending Utility Account #" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "ach_waiver_sent_and_signed_cash_only":
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "green_area_nm_only":
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 1
				} else if v == "❌ (Project DQ'd)" || v == "❌  (Project DQ'd)" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "finance_credit_approved_loan_or_lease":
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "finance_agreement_completed_loan_or_lease":
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "owe_documents_completed":
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 1
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "change_order_status":
			if v == "" {
				return "", 0
			} else if v == "CO Complete" {
				return "Completed", 0
			} else {
				return "Pending", 1
			}
		}
	}
	return "", 0
}
