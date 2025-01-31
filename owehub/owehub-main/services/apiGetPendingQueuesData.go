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
			// continue
		}

		if val, ok := item["change_order_status"].(string); ok {
			Co = val
		} else {
			Co = "" // or a default value
		}

		if Co == "" {
			Co = "CO Requested - Working"
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
