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
	"OWEApp/shared/models"
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
		Co          string
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

	if userRole == string(types.RoleAccountManager) || userRole == string(types.RoleAccountExecutive) ||
		userRole == string(types.RoleProjectManager) {
		accountName, err := fetchAmAeName(dataReq.Email)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
			return
		}
		var roleBase string
		if userRole == "Account Manager" {
			roleBase = "account_manager"
		}
		if userRole == "Account Executive" {
			roleBase = "account_executive"
		}
		if userRole == "Project Manager" {
			roleBase = "project_manager"
		}

		query := fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncWarnTrace(0, "No sales partner data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
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
			log.FuncWarnTrace(0, "No sales partner data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
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
			log.FuncWarnTrace(0, "No pending queue co data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
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
			log.FuncWarnTrace(0, "No pending queue ntp data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
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
			// continue
		}

		if val, ok := item["change_order_status"].(string); ok {
			Co = val
		} else {
			Co = "" // or a default value
		}

		if Co == "" {
			Co = "CO Requested - Working"
			item["change_order_status"] = "CO Requested - Working"
		}

		// Fetch and validate HomeOwner
		HomeOwner, ok := item["home_owner"].(string)
		if !ok || HomeOwner == "" {
			HomeOwner = ""
			log.FuncWarnTrace(0, "Failed to get HomeOwner. Item: %+v\n", item)
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
		CoStatus, _ := getPendingQueueStringValue(item, "change_order_status", ntpD, prospectId)
		PendingQueue := models.GetPendingQueue{
			UniqueId:  UniqueId,
			HomeOwner: HomeOwner,
			Co: models.PendingQueueCo{
				CoStatus: CoStatus,
				CO:       Co,
			},
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
		pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)

	}

	RecordCount = int64(len(pendingqueueList.PendingQueueList))

	paginatedData := Paginate(pendingqueueList.PendingQueueList, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	log.FuncInfoTrace(0, "Number of pending queue List fetched : %v list %+v", len(paginatedData), paginatedData)
	appserver.FormAndSendHttpResp(resp, "Pending queue Data", http.StatusOK, paginatedData, RecordCount)
}

// HandleGetNewPendingQuesDataRequest is a temporary handler that uses the new UI, whereas HandleNewPendingQuesDataRequest is based on the old UI.
func HandleGetNewPendingQuesDataRequest(resp http.ResponseWriter, req *http.Request) {

	var (
		err         error
		dataReq     models.PendingQueueReq
		data        []map[string]interface{}
		RecordCount int64
		ntpD        string
		Co          string
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

	if userRole == string(types.RoleAccountManager) || userRole == string(types.RoleAccountExecutive) ||
		userRole == string(types.RoleProjectManager) {
		accountName, err := fetchAmAeName(dataReq.Email)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
			return
		}
		var roleBase string
		if userRole == "Account Manager" {
			roleBase = "account_manager"
		}
		if userRole == "Account Executive" {
			roleBase = "account_executive"
		}
		if userRole == "Project Manager" {
			roleBase = "project_manager"
		}

		query := fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncWarnTrace(0, "No sales partner data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
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
			log.FuncWarnTrace(0, "No sales partner data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
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
		query := models.PendingActionPageCoQueryNew(roleFilter, searchValue, buildFilterQuery(dataReq.Filters))
		data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncWarnTrace(0, "No pending queue co data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
			appserver.FormAndSendHttpResp(resp, "pending queue Data", http.StatusOK, tileData, RecordCount)
			return
		}
	} else {
		query := models.PendingActionPageNtpQueryNew(roleFilter, searchValue, buildFilterQuery(dataReq.Filters))
		data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue data", http.StatusBadRequest, nil)
			return
		} else if len(data) == 0 {
			tileData := models.GetPendingQueueTileResp{}
			log.FuncWarnTrace(0, "No pending queue ntp data found for user (Email: %s, Role: %s). Possible reason: No matching records in the database.", dataReq.Email, userRole)
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
			// continue
		}

		var projectAgeDays string
		if UniqueId != "" {
			projectAgeDays, err = getProjectAgeDays(UniqueId)
			if err != nil {
				log.FuncWarnTrace(0, "Failed to get project age days for %s: %v", UniqueId, err)
			}
		}

		if val, ok := item["change_order_status"].(string); ok {
			Co = val
		} else {
			Co = "" // or a default value
		}

		if Co == "" {
			Co = "CO Requested - Working"
			item["change_order_status"] = "CO Requested - Working"
		}

		// Fetch and validate HomeOwner
		HomeOwner, ok := item["home_owner"].(string)
		if !ok || HomeOwner == "" {
			HomeOwner = ""
			log.FuncWarnTrace(0, "Failed to get HomeOwner. Item: %+v\n", item)
		}

		ntpDate, ok := item["ntp_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			ntpD = ""
		} else {
			ntpD = ntpDate.Format("02-01-2006") // dd-mm-yy format
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

		// Add the new field extraction from the DB result - direct extraction
		soldDate := ""
		if val, ok := item["sold_date"].(string); ok && val != "" {
			soldDate = val
		} else if val, ok := item["sold_date"].(time.Time); ok {
			soldDate = val.Format("02-01-2006") // dd-mm-yyyy format
		}

		appStatus := ""
		if val, ok := item["app_status"].(string); ok {
			appStatus = val
		}

		projectStatus := ""
		if val, ok := item["project_status"].(string); ok {
			projectStatus = val
		}

		salesRep := ""
		if val, ok := item["sales_rep"].(string); ok {
			salesRep = val
		}

		setter := ""
		if val, ok := item["setter"].(string); ok {
			setter = val
		}

		ntpDelayedBy := ""
		if val, ok := item["ntp_delayed_by"].(string); ok {
			ntpDelayedBy = val
		}

		ntpDelayNotes := ""
		if val, ok := item["ntp_delay_notes"].(string); ok {
			ntpDelayNotes = val
		}

		dealType := ""
		if val, ok := item["deal_type"].(string); ok {
			dealType = val
		}

		coType := ""
		if val, ok := item["co_notes"].(string); ok {
			coType = val
		}

		CoStatus, _ := getPendingQueueStringValue(item, "change_order_status", ntpD, prospectId)
		PendingQueue := models.GetPendingQueue{
			UniqueId:  UniqueId,
			HomeOwner: HomeOwner,
			Co: models.PendingQueueCo{
				CoStatus:       CoStatus,
				CO:             Co,
				SoldDate:       soldDate,
				AppStatus:      appStatus,
				ProjectStatus:  projectStatus,
				SalesRep:       salesRep,
				Setter:         setter,
				NtpDelayedBy:   []string{ntpDelayedBy},
				NtpDelayNotes:  ntpDelayNotes,
				ProjectAgeDays: projectAgeDays,
				DealType:       dealType,
				CoNotes:        coType,
				NtpDate:        ntpD,
			},
			Ntp: models.PendingQueueNTP{
				ProductionDiscrepancy:        ProductionDiscrepancy,
				FinanceNTPOfProject:          FinanceNTPOfProject,
				UtilityBillUploaded:          UtilityBillUploaded,
				PowerClerkSignaturesComplete: PowerClerkSignaturesComplete,
				SoldDate:                     soldDate,
				AppStatus:                    appStatus,
				ProjectStatus:                projectStatus,
				SalesRep:                     salesRep,
				Setter:                       setter,
				NtpDelayedBy:                 []string{ntpDelayedBy},
				NtpDelayNotes:                ntpDelayNotes,
				ProjectAgeDays:               projectAgeDays,
				DealType:                     dealType,
				CoNotes:                      coType,
				NtpDate:                      ntpD,
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
		pendingqueueList.PendingQueueList = append(pendingqueueList.PendingQueueList, PendingQueue)

	}

	RecordCount = int64(len(pendingqueueList.PendingQueueList))

	if len(dataReq.Filters) != 0 {
		pendingqueueList.PendingQueueList = filterByNtpStatus(pendingqueueList.PendingQueueList, dataReq.Filters)
		RecordCount = int64(len(pendingqueueList.PendingQueueList))
	}

	// It supports pagination for normal requests and returns all data when the export button is clicked
	var finalData []models.GetPendingQueue
	if dataReq.IsExport {
		finalData = pendingqueueList.PendingQueueList
	} else {
		finalData = Paginate(pendingqueueList.PendingQueueList, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	}

	log.FuncInfoTrace(0, "Number of pending queue List fetched : %v list %+v", len(finalData), finalData)
	appserver.FormAndSendHttpResp(resp, "Pending queue Data", http.StatusOK, finalData, RecordCount)
}

// ..function to fetch project age days
func getProjectAgeDays(uniqueId string) (string, error) {
	var projectAgeDays string

	query := fmt.Sprintf("SELECT project_age_days FROM aging_report WHERE unique_id = '%s'", uniqueId)
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get project_age_days for UniqueId %v. Error: %v", uniqueId, err)
		return "", err
	}

	if len(data) == 0 {
		return "", nil
	}

	if val, ok := data[0]["project_age_days"].(string); ok && val != "" {
		projectAgeDays = val
	} else if val, ok := data[0]["project_age_days"].(int); ok {
		projectAgeDays = fmt.Sprintf("%d", val)
	} else if val, ok := data[0]["project_age_days"].(int64); ok {
		projectAgeDays = fmt.Sprintf("%d", val)
	} else if val, ok := data[0]["project_age_days"].(float64); ok {
		projectAgeDays = fmt.Sprintf("%.0f", val) // Format as integer
	}

	return projectAgeDays, nil
}

func buildFilterQuery(filters []models.Filter) string {
	if len(filters) == 0 {
		return ""
	}
	var conditions []string

	// mapping column names to their respective tables
	columnMap := map[string]string{
		"uninque_id":     "customers_customers_schema.unique_id",
		"co_request":     "ntp_ntp_schema.change_order_status",
		"customer_name":  "customers_customers_schema.customer_name",
		"ntp_date":       "ntp_ntp_schema.ntp_complete_date",
		"sold_date":      "ntp_ntp_schema.sale_date",
		"app_status":     "ntp_ntp_schema.app_status",
		"project_status": "ntp_ntp_schema.project_status",
		"sales_rep":      "ntp_ntp_schema.sales_rep",
		"setter":         "sales_metrics_schema.setter",
		"deal_type":      "prospects_customers_schema.lead_source",
	}

	for _, filter := range filters {
		if filter.Column == "" || filter.Operation == "" {
			continue // skip invalid filters
		}

		tableColumn, exists := columnMap[filter.Column]
		if !exists {
			continue // skip unknown columns
		}

		operator := getFilterDBMapped(filter.Operation)

		// handle "BETWEEN" case for date range
		if filter.Operation == "btw" {
			conditions = append(conditions, fmt.Sprintf("%s BETWEEN '%s' AND '%s'", tableColumn, filter.StartDate, filter.EndDate))
			continue
		}

		value := fmt.Sprintf("%v", filter.Data)

		// handle LIKE-based operations
		if filter.Operation == "sw" || filter.Operation == "ew" || filter.Operation == "cont" {
			value = getFilterModifiedValue(filter.Operation, value)
		}

		conditions = append(conditions, fmt.Sprintf("LOWER(%s) %s LOWER('%s')", tableColumn, operator, value))
	}

	if len(conditions) == 0 {
		return "" // no filters applied
	}

	return "AND " + strings.Join(conditions, " AND ")
}

func getFilterDBMapped(operation string) string {
	switch operation {
	case "eqs":
		return "="
	case "lst":
		return "<"
	case "lsteqs":
		return "<="
	case "grt":
		return ">"
	case "grteqs":
		return ">="
	case "sw", "ew", "cont":
		return "ILIKE"
	case "btw":
		return "BETWEEN"
	default:
		return "="
	}
}

func getFilterModifiedValue(operation, data string) string {
	switch operation {
	case "sw":
		return fmt.Sprintf("%s%%", strings.ToLower(data))
	case "ew":
		return fmt.Sprintf("%%%s", strings.ToLower(data))
	case "cont":
		return fmt.Sprintf("%%%s%%", strings.ToLower(data))
	default:
		return data
	}
}

// filterByNtpStatus filters the pending queue list based on NTP "production", "powerclerk "finance_NTP", "utility_bill".
// It processes each filter, checks the respective field, and returns the filtered list.
// The function avoids duplicate entries by tracking processed UniqueIds.
func filterByNtpStatus(pendingQueueList []models.GetPendingQueue, filters []models.Filter) []models.GetPendingQueue {
	// check if any of the filters match expected columns; otherwise, return the full list
	validColumns := map[string]bool{
		"production":   true,
		"powerclerk":   true,
		"finance_NTP":  true,
		"utility_bill": true,
	}

	hasValidFilter := false
	for _, filter := range filters {
		if validColumns[filter.Column] {
			hasValidFilter = true
			break
		}
	}

	if !hasValidFilter {
		return pendingQueueList
	}

	var filteredData []models.GetPendingQueue
	seen := make(map[string]bool)

	for _, filter := range filters {
		filterData, ok := filter.Data.(string)
		if !ok || filterData == "" {
			continue
		}
		filterData = strings.ToLower(filterData)
		col := filter.Column

		for _, item := range pendingQueueList {
			itemID := item.UniqueId // Using UniqueId to track duplicates
			if seen[itemID] {       // Skip if already added
				continue
			}

			var isCompleted, isPending bool

			switch col {
			case "production":
				isCompleted = item.Ntp.ProductionDiscrepancy == "Completed"
				isPending = item.Ntp.ProductionDiscrepancy == "Pending" || item.Ntp.ProductionDiscrepancy == "Pending (Action Required)"
			case "powerclerk":
				isCompleted = item.Ntp.PowerClerkSignaturesComplete == "Completed"
				isPending = item.Ntp.PowerClerkSignaturesComplete == "Pending" || item.Ntp.PowerClerkSignaturesComplete == "Pending (Action Required)"
			case "finance_NTP":
				isCompleted = item.Ntp.FinanceNTPOfProject == "Completed"
				isPending = item.Ntp.FinanceNTPOfProject == "Pending" || item.Ntp.FinanceNTPOfProject == "Pending (Action Required)"
			case "utility_bill":
				isCompleted = item.Ntp.UtilityBillUploaded == "Completed"
				isPending = item.Ntp.UtilityBillUploaded == "Pending" || item.Ntp.UtilityBillUploaded == "Pending (Action Required)"
			default:
				isCompleted = item.Ntp.ProductionDiscrepancy == "Completed" || item.Ntp.PowerClerkSignaturesComplete == "Completed" || item.Ntp.FinanceNTPOfProject == "Completed" || item.Ntp.UtilityBillUploaded == "Completed"
				isPending = item.Ntp.ProductionDiscrepancy == "Pending" || item.Ntp.ProductionDiscrepancy == "Pending (Action Required)" ||
					item.Ntp.PowerClerkSignaturesComplete == "Pending" || item.Ntp.PowerClerkSignaturesComplete == "Pending (Action Required)" ||
					item.Ntp.FinanceNTPOfProject == "Pending" || item.Ntp.FinanceNTPOfProject == "Pending (Action Required)" ||
					item.Ntp.UtilityBillUploaded == "Pending" || item.Ntp.UtilityBillUploaded == "Pending (Action Required)"
			}

			if filterData == "completed" && isCompleted {
				filteredData = append(filteredData, item)
				seen[itemID] = true
			} else if (filterData == "pending" || filterData == "pending (action required)" || filterData == "action req" || filterData == "action") && isPending {
				filteredData = append(filteredData, item)
				seen[itemID] = true
			}
		}
	}

	return filteredData
}
