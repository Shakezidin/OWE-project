/**************************************************************************
 * File       	   : apiGetPaindingQueueTileData.go
 * DESCRIPTION     : This file contains functions for get pendig queue tile data handler
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
		err             error
		dataReq         models.PendingQueueReq
		data            []map[string]interface{}
		RecordCount     int64
		QcPendingCount  int64
		NTPPendingCount int64
		CoPendingCount  int64
	)

	log.EnterFn(0, "HandleGetPendingQuesTileDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPendingQuesTileDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get pending queue tile data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get pending queue tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get pending queue tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get pending queue data tile Request body", http.StatusBadRequest, nil)
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

		for _, val := range data {
			dataReq.DealerNames = append(dataReq.DealerNames, val["data"].(string))
		}
	} else if userRole == string(types.RoleAdmin) || userRole == string(types.RoleFinAdmin) {
		query := "SELECT sales_partner_name as data FROM sales_partner_dbhub_schema"
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

	query := models.PendingActionPageTileQuery(roleFilter, searchValue)
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

	// Helper function to convert interface{} to int64
	toInt64 := func(v interface{}) int64 {
		switch value := v.(type) {
		case float64:
			return int64(value)
		case int64:
			return value
		default:
			return 0
		}
	}

	QcPendingCount = toInt64(data[0]["qc_count"])
	NTPPendingCount = toInt64(data[0]["ntp_count"])
	CoPendingCount = toInt64(data[0]["co_count"])

	pendingQueueTile := models.GetPendingQueueTileResp{
		QcPendingCount:  QcPendingCount,
		NTPPendingCount: NTPPendingCount,
		CoPendingCount:  CoPendingCount,
	}

	log.FuncInfoTrace(0, "Number of pending queue tile List fetched : %v list %+v", 1, pendingQueueTile)
	appserver.FormAndSendHttpResp(resp, "pending queue tile Data", http.StatusOK, pendingQueueTile, RecordCount)
}

func getPendingQueueStringValue(data map[string]interface{}, key string, ntp_date string, prospectId string) (string, int64) {
	if v, exists := data[key]; exists {
		switch key {
		case "production_discrepancy":
			if (v == "" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 1
			} else {
				return "Completed", 0
			}
		case "finance_ntp_of_project":
			if (v == "" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 1
			} else if (v == "❌  M1" || v == "❌  Approval" || v == "❌  Stips") && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "utility_bill_uploaded":
			if (v == "" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 1
			} else if v == "❌" && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "powerclerk_signatures_complete":
			if (v == "" || v == "❌  Pending CAD (SRP)" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 1
			} else if (v == "❌  Pending" || v == "❌  Pending Sending PC" || v == "❌ Pending Sending PC") && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "powerclerk_sent_az":
			if prospectId == "" {
				return "Completed", 0
			}
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" || v == nil {
					return "Pending", 1
				} else if v == "Pending Utility Account #" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "ach_waiver_sent_and_signed_cash_only":
			if prospectId == "" {
				return "Completed", 0
			}
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" || v == nil {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "green_area_nm_only":
			if prospectId == "" {
				return "Completed", 0
			}
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" || v == nil {
					return "Pending", 1
				} else if v == "❌ (Project DQ'd)" || v == "❌  (Project DQ'd)" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "finance_credit_approved_loan_or_lease":
			if prospectId == "" {
				return "Completed", 0
			}
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" || v == nil {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "finance_agreement_completed_loan_or_lease":
			if prospectId == "" {
				return "Completed", 0
			}
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" || v == nil {
					return "Pending", 1
				} else {
					return "Completed", 0
				}
			}
		case "owe_documents_completed":
			if prospectId == "" {
				return "Completed", 0
			}
			if v != "Not Needed" {
				if ntp_date != "" {
					return "Completed", 0
				}
				if v == "" || v == "NULL" || v == "<nil>" || v == nil {
					return "Pending", 1
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else {
					return "Completed", 0
				}
			}
		case "change_order_status":
			if v == "" || v == "<nil>" || v == nil {
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
