/**************************************************************************
 * File       	   : apiGetProjectManagement.go
 * DESCRIPTION     : This file contains functions for get project management data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"math"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"reflect"
)

/******************************************************************************
 * FUNCTION:		HandleGetProjectMngmntRequest
 * DESCRIPTION:     handler for get ProjectManagement data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetProjectMngmntRequest(resp http.ResponseWriter, req *http.Request) {
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
		uniqueId         string
		ntpDate          string
	)

	log.EnterFn(0, "HandleGetProjectMngmntRequest")
	defer func() { log.ExitFn(0, "HandleGetProjectMngmntRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ProjectManagement data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ProjectManagement data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ProjectManagement data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get ProjectManagement data Request body", http.StatusBadRequest, nil)
		return
	}

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	saleMetricsQuery := models.ProjectMngmntRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	// this error throws only if no email if received from context
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	dataReq.ProjectLimit = 100

	// Check whether the user is Admin, Dealer, Sales Rep
	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role = data[0]["role_name"].(string)
		name := data[0]["name"]
		dealerName := data[0]["dealer_name"]
		rgnSalesMgrCheck = false
		dataReq.DealerName = dealerName

		switch role {
		case "Admin", "Finance Admin":
			filter, whereEleList = PrepareProjectAdminDlrFilters(tableName, dataReq, true)
		case "Dealer Owner":
			filter, whereEleList = PrepareProjectAdminDlrFilters(tableName, dataReq, false)
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareProjectSaleRepFilters(tableName, dataReq, SaleRepList)
		// default handles Regional Manager & Sales Manager and is entryway to below if
		default:
			SaleRepList = append(SaleRepList, name)
			rgnSalesMgrCheck = true
		}
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and also for remaining roles
		if len(SaleRepList) == 0 {
			emptyPerfomanceList := models.ProjectListResponse{
				ProjectList: []models.ProjectResponse{},
			}
			log.FuncErrorTrace(0, "No sale representatives exist: %v", err)
			appserver.FormAndSendHttpResp(resp, "No sale representatives exist", http.StatusOK, emptyPerfomanceList, int64(0))
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

		// dealerName := data[0]["dealer_name"]
		// dataReq.DealerName = dealerName
		filter, whereEleList = PrepareProjectSaleRepFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" || role == string(types.RoleAdmin) {
		queryWithFiler = saleMetricsQuery + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, nil)
		return
	}

	projectList := models.ProjectListResponse{}

	for _, item := range data {
		var projectData models.ProjectResponse
		mapRowToStruct(item, &projectData)
		projectData.Epc = math.Round(projectData.Epc*100) / 100
		projectData.AdderBreakDownAndTotal = cleanAdderBreakDownAndTotal(projectData.AdderBreakDownAndTotalString)
		projectList.ProjectList = append(projectList.ProjectList, projectData)
		uniqueId = projectData.UniqueId
		ntpDate = projectData.NtpCompleted

	}

	if len(data) <= 0 {
		projectList := models.ProjectListResponse{
			ProjectList: []models.ProjectResponse{}, // Initialize as an empty array
		}
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, projectList)
		return
	}

	var ntp models.NTP
	var qc models.QC
	var actionRequiredCount, count int64

	linkQuery := models.QcNtpRetrieveQueryFunc() + fmt.Sprintf("WHERE customers_customers_schema.unique_id = '%s'", uniqueId)
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, linkQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, nil)
		return
	}
	if len(data) > 0 {
		if val, ok := data[0]["current_live_cad"].(string); ok {
			projectList.CADLink = val
		} else {
			projectList.CADLink = "" // or a default value
		}

		if val, ok := data[0]["system_sold_er"].(string); ok {
			projectList.DATLink = val
		} else {
			projectList.DATLink = "" // or a default value
		}

		if val, ok := data[0]["podio_link"].(string); ok {
			projectList.PodioLink = val
		} else {
			projectList.PodioLink = "" // or a default value
		}

		if val, ok := data[0]["change_order_status"].(string); ok {
			projectList.CoStatus = val
		} else {
			projectList.CoStatus = "" // or a default value
		}

		prospectId, prospectIdok := data[0]["first_value"].(string)
		if prospectId == "" || !prospectIdok {
			prospectId = ""
		}

		ntp.ProductionDiscrepancy, count = getStringValue(data[0], "production_discrepancy", ntpDate, prospectId)
		actionRequiredCount += count
		ntp.FinanceNTPOfProject, count = getStringValue(data[0], "finance_ntp_of_project", ntpDate, prospectId)
		actionRequiredCount += count
		ntp.UtilityBillUploaded, count = getStringValue(data[0], "utility_bill_uploaded", ntpDate, prospectId)
		actionRequiredCount += count
		ntp.PowerClerkSignaturesComplete, count = getStringValue(data[0], "powerclerk_signatures_complete", ntpDate, prospectId)
		actionRequiredCount += count
		ntp.ActionRequiredCount = actionRequiredCount
		actionRequiredCount = 0

		var flag bool
		if _, powerclerkSentAZOk := data[0]["powerclerk_sent_az"]; !powerclerkSentAZOk {
			if _, achWaiverOk := data[0]["ach_waiver_sent_and_signed_cash_only"]; !achWaiverOk {
				if _, greenAreaNMOk := data[0]["green_area_nm_only"]; !greenAreaNMOk {
					if _, financeCreditApprovedOk := data[0]["finance_credit_approved_loan_or_lease"]; !financeCreditApprovedOk {
						if _, financeAgreementCompletedOk := data[0]["finance_agreement_completed_loan_or_lease"]; !financeAgreementCompletedOk {
							if _, oweDocumentsCompletedOk := data[0]["owe_documents_completed"]; !oweDocumentsCompletedOk {
								qc.PowerClerk = "Completed"
								qc.ACHWaiveSendandSignedCashOnly = "Completed"
								qc.GreenAreaNMOnly = "Completed"
								qc.FinanceCreditApprovalLoanorLease = "Completed"
								qc.FinanceAgreementCompletedLoanorLease = "Completed"
								qc.OWEDocumentsCompleted = "Completed"
								flag = true

							}
						}
					}
				}
			}
		}

		if !flag {
			qc.PowerClerk, count = getStringValue(data[0], "powerclerk_sent_az", ntpDate, prospectId)
			actionRequiredCount += count
			qc.ACHWaiveSendandSignedCashOnly, count = getStringValue(data[0], "ach_waiver_sent_and_signed_cash_only", ntpDate, prospectId)
			actionRequiredCount += count
			qc.GreenAreaNMOnly, count = getStringValue(data[0], "green_area_nm_only", ntpDate, prospectId)
			actionRequiredCount += count
			qc.FinanceCreditApprovalLoanorLease, count = getStringValue(data[0], "finance_credit_approved_loan_or_lease", ntpDate, prospectId)
			actionRequiredCount += count
			qc.FinanceAgreementCompletedLoanorLease, count = getStringValue(data[0], "finance_agreement_completed_loan_or_lease", ntpDate, prospectId)
			actionRequiredCount += count
			qc.OWEDocumentsCompleted, count = getStringValue(data[0], "owe_documents_completed", ntpDate, prospectId)
			actionRequiredCount += count
			qc.ActionRequiredCount = actionRequiredCount
		}
	}

	projectList.Ntp = ntp
	projectList.Qc = qc

	// Send the response
	recordLen := len(data)
	log.FuncInfoTrace(0, "Number of project management data List fetched : %v list %+v", len(projectList.ProjectList), recordLen)
	appserver.FormAndSendHttpResp(resp, "Project Management Data", http.StatusOK, projectList, int64(recordLen))
}

/******************************************************************************
 * FUNCTION:		mapRowToStruct
 * DESCRIPTION:     handler for to map db to struct
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func mapRowToStruct(item map[string]interface{}, v interface{}) {
	val := reflect.ValueOf(v).Elem()
	columnToField := models.ColumnToField
	for dbColumn, structField := range columnToField {
		if dbValue, ok := item[dbColumn]; ok {
			field := val.FieldByName(structField)
			fieldValue := field.Interface()
			switch fieldValue.(type) {
			case string:
				if dbValueTime, ok := dbValue.(time.Time); ok {
					dbValueTimeString := dbValueTime.Format("2006-01-02")
					field.SetString(dbValueTimeString)
				} else if dbValueStr, ok := dbValue.(string); ok {
					field.SetString(dbValueStr)
				}
			case float64:
				if dbValueFloat, ok := dbValue.(float64); ok {
					field.SetFloat(dbValueFloat)
				}
			}
		}
	}
}

/******************************************************************************
 * FUNCTION:		cleanAdderBreakDownAndTotal
 * DESCRIPTION: to return cleaned breakdown value
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func cleanAdderBreakDownAndTotal(data string) map[string]string {
	result := make(map[string]string)
	if len(data) == 0 {
		return result
	}
	components := strings.Split(data, "\n")
	var finalComp []string

	if len(components) > 0 && components[0] != "" {
		finalComp = append(finalComp, components[0])
	}
	for _, val := range components[1:] {
		val = strings.TrimSpace(val)
		if val != "" {
			finalComp = append(finalComp, val)
		}
	}
	for _, val := range finalComp {
		cleanedData := strings.ReplaceAll(val, "**", "")
		parts := strings.SplitN(cleanedData, ":", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			value := strings.TrimSpace(parts[1])
			result[key] = value
		}
	}
	return result
}

/******************************************************************************
 * FUNCTION:		PrepareProjectAdminDlrFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareProjectAdminDlrFilters(tableName string, dataFilter models.ProjectStatusReq, adminCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareProjectAdminDlrFilters")
	defer func() { log.ExitFn(0, "PrepareProjectAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true

	filtersBuilder.WriteString(" WHERE")

	filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.unique_id = $%d", len(whereEleList)+1))
	filtersBuilder.WriteString(fmt.Sprintf(" OR customers_customers_schema.customer_name ILIKE $%d", len(whereEleList)+2))

	// Append parameters to whereEleList
	whereEleList = append(whereEleList, dataFilter.UniqueId)
	whereEleList = append(whereEleList, fmt.Sprintf("%%%s%%", dataFilter.UniqueId))

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 {

		filtersBuilder.WriteString(" AND ")
		filtersBuilder.WriteString(" customers_customers_schema.unique_id IN (")

		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
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

		filtersBuilder.WriteString(" customers_customers_schema.customer_name ILIKE ANY (ARRAY[")
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

	if !adminCheck {
		if !whereAdded {
			filtersBuilder.WriteString(" WHERE ")
		} else {
			filtersBuilder.WriteString(" AND ")
		}
		filtersBuilder.WriteString(fmt.Sprintf("customers_customers_schema.dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	filtersBuilder.WriteString(" customers_customers_schema.unique_id <> ''")
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
 * FUNCTION:		PrepareProjectSaleRepFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareProjectSaleRepFilters(tableName string, dataFilter models.ProjectStatusReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareProjectSaleRepFilters")
	defer func() { log.ExitFn(0, "PrepareProjectSaleRepFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true
	filtersBuilder.WriteString(" WHERE")

	filtersBuilder.WriteString(fmt.Sprintf(" customers_customers_schema.unique_id = $%d", len(whereEleList)+1))
	filtersBuilder.WriteString(fmt.Sprintf(" OR customers_customers_schema.customer_name ILIKE $%d", len(whereEleList)+2))

	// Append parameters to whereEleList
	whereEleList = append(whereEleList, dataFilter.UniqueId)
	whereEleList = append(whereEleList, fmt.Sprintf("%%%s%%", dataFilter.UniqueId))

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 {
		// whereAdded = true
		filtersBuilder.WriteString(" AND ")
		filtersBuilder.WriteString(" customers_customers_schema.unique_id IN (")

		for i, filter := range dataFilter.UniqueIds {
			filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
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

		filtersBuilder.WriteString(" customers_customers_schema.customer_name ILIKE ANY (ARRAY[")
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

	filtersBuilder.WriteString(fmt.Sprintf(") AND customers_customers_schema.dealer = $%d ", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	filtersBuilder.WriteString(" customers_customers_schema.unique_id <> ''")

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func getStringValue(data map[string]interface{}, key string, ntp_date string, prospectId string) (string, int64) {
	if v, exists := data[key]; exists {
		switch key {
		case "production_discrepancy":
			if (v == "" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 0
			} else {
				return "Completed", 0
			}
		case "finance_ntp_of_project":
			if (v == "" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 0
			} else if (v == "❌  M1" || v == "❌  Approval" || v == "❌  Stips") && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "utility_bill_uploaded":
			if (v == "" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 0
			} else if v == "❌" && ntp_date == "" {
				return "Pending (Action Required)", 1
			} else {
				return "Completed", 0
			}
		case "powerclerk_signatures_complete":
			fmt.Println(0, "=======================================================================")
			fmt.Println(0, "=====================														 ======================")
			fmt.Println(0, "=======================================================================")
			if (v == "" || v == "❌  Pending CAD (SRP)" || v == "<nil>" || v == nil) && ntp_date == "" {
				return "Pending", 0
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
					return "Pending", 0
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
					return "Pending", 0
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
					return "Pending", 0
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
					return "Pending", 0
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
					return "Pending", 0
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
					return "Pending", 0
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
