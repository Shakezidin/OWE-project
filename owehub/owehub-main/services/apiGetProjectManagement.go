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
 * FUNCTION:		HandleGetProjectManagementRequest
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
	)

	log.EnterFn(0, "HandleGetProjectManagementRequest")
	defer func() { log.ExitFn(0, "HandleGetProjectManagementRequest", err) }()

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
	saleMetricsQuery := models.ProjectMngmntRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	// this error throws only if no email if received from context
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
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
			rgnSalesMgrCheck = true
		}
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and also for remaining roles
		if len(data) == 0 {
			emptyPerfomanceList := models.ProjectListResponse{
				ProjectList: []models.ProjectResponse{},
			}
			log.FuncErrorTrace(0, "No projects or sale representatives: %v", err)
			FormAndSendHttpResp(resp, "No projects or sale representatives", http.StatusOK, emptyPerfomanceList, int64(0))
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

	if filter != "" || role == "Admin" {
		queryWithFiler = saleMetricsQuery + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, nil)
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

	}

	var filtersBuilder strings.Builder
	whereEleList = nil
	filtersBuilder.WriteString(fmt.Sprintf(
		"SELECT c.current_live_cad, c.system_sold_er, c.podio_link, n.production_discrepancy, n.sunpixel, n.lease_agreement_uploaded, "+
			"n.light_reach_design_verification, n.owe_agreement_uploaded, n.hof_uploaded,n.utility_acknowledgement_and_disclaimer_uploaded, "+
			"n.ach_waiver_cash_customers_only_uploaded, n.finance_ntp_of_project, n.f_ntp_approved, n.utility_bill_uploaded, n.powerclerk_signatures_complete,"+
			"n.over_net_3point6_per_w, n.premium_panel_adder_10c "+
			"FROM customers_customers_schema c "+
			"LEFT JOIN ntp_ntp_schema n ON c.unique_id = n.unique_id "+
			"WHERE c.unique_id = '%s'", uniqueId)) // Check if there are filters

	linkQuery := filtersBuilder.String()
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, linkQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, nil)
		return
	}
	projectList.CADLink = data[0]["current_live_cad"].(string)
	projectList.DATLink = data[0]["system_sold_er"].(string)
	projectList.PodioLink = data[0]["podio_link"].(string)

	var ntp models.NTP
	var qc models.QC
	var actionRequiredCount, count int64

	// Assign values from the data map to the struct fields
	ntp.ProductionDiscrepancy, count = getStringValue(data[0], "production_discrepancy")
	actionRequiredCount += count
	ntp.Sunpixel, count = getStringValue(data[0], "sunpixel")
	actionRequiredCount += count
	ntp.LeaseAgreementUploaded, count = getStringValue(data[0], "lease_agreement_uploaded")
	actionRequiredCount += count
	ntp.LightReachDesignVerification, count = getStringValue(data[0], "light_reach_design_verification")
	actionRequiredCount += count
	ntp.OWEAgreementUploaded, count = getStringValue(data[0], "owe_agreement_uploaded")
	actionRequiredCount += count
	ntp.HOFUploaded, count = getStringValue(data[0], "hof_uploaded")
	actionRequiredCount += count
	ntp.UtilityAcknowledgementAndDisclaimerUploaded, count = getStringValue(data[0], "utility_acknowledgement_and_disclaimer_uploaded")
	actionRequiredCount += count
	ntp.ACHWaiverCashCustomerOnlyUploaded, count = getStringValue(data[0], "ach_waiver_cash_customers_only_uploaded")
	actionRequiredCount += count
	ntp.FinanceNTPOfProject, count = getStringValue(data[0], "finance_ntp_of_project")
	actionRequiredCount += count
	ntp.FntpApproved, count = getStringValue(data[0], "f_ntp_approved")
	actionRequiredCount += count
	ntp.UtilityBillUploaded, count = getStringValue(data[0], "utility_bill_uploaded")
	actionRequiredCount += count
	ntp.PowerClerkSignaturesComplete, count = getStringValue(data[0], "powerclerk_signatures_complete")
	actionRequiredCount += count
	ntp.ActionRequiredCount = actionRequiredCount
	actionRequiredCount = 0

	var filtersBuilders strings.Builder
	whereEleList = nil

	filtersBuilders.WriteString(fmt.Sprintf(
		`WITH extracted_values AS (
        SELECT
            unique_id,  -- Include unique_id in the CTE
            split_part(prospectid_dealerid_salesrepid, ',', 1) AS first_value
        FROM
            consolidated_data_view
        WHERE
            unique_id = '%v'
    )
    SELECT
        e.first_value,
        p.powerclerk_sent_az, p.ach_waiver_sent_and_signed_cash_only, p.green_area_nm_only, p.finance_credit_approved_loan_or_lease, 
		p.finance_agreement_completed_loan_or_lease, p.owe_documents_completed 
    FROM
        extracted_values e
    JOIN
        prospects_customers_schema p
    ON
        e.first_value = p.item_id::text;`, uniqueId))

	linkQuery = filtersBuilders.String()
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, linkQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, nil)
		return
	}

	qc.PowerClerk, count = getStringValue(data[0], "powerclerk_sent_az")
	actionRequiredCount += count
	qc.ACHWaiveSendandSignedCashOnly, count = getStringValue(data[0], "ach_waiver_sent_and_signed_cash_only")
	actionRequiredCount += count
	qc.GreenAreaNMOnly, count = getStringValue(data[0], "green_area_nm_only")
	actionRequiredCount += count
	qc.FinanceCreditApprovalLoanorLease, count = getStringValue(data[0], "finance_credit_approved_loan_or_lease")
	actionRequiredCount += count
	qc.FinanceAgreementCompletedLoanorLease, count = getStringValue(data[0], "finance_agreement_completed_loan_or_lease")
	actionRequiredCount += count
	qc.OWEDocumentsCompleted, count = getStringValue(data[0], "owe_documents_completed")
	actionRequiredCount += count
	qc.ActionRequiredCount = actionRequiredCount

	projectList.Ntp = ntp
	projectList.Qc = qc

	// Send the response
	recordLen := len(data)
	log.FuncInfoTrace(0, "Number of PerfomanceProjectStatus List fetched : %v list %+v", len(projectList.ProjectList), recordLen)
	FormAndSendHttpResp(resp, "PerfomanceProjectStatus Data", http.StatusOK, projectList, int64(recordLen))
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

	filtersBuilder.WriteString(fmt.Sprintf(" unique_id = $%d", len(whereEleList)+1))
	filtersBuilder.WriteString(fmt.Sprintf(" OR home_owner ILIKE $%d", len(whereEleList)+2))

	// Append parameters to whereEleList
	whereEleList = append(whereEleList, dataFilter.UniqueId)
	whereEleList = append(whereEleList, fmt.Sprintf("%%%s%%", dataFilter.UniqueId))

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 {

		filtersBuilder.WriteString(" AND ")
		filtersBuilder.WriteString(" unique_id IN (")

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

		filtersBuilder.WriteString(" home_owner ILIKE ANY (ARRAY[")
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
		filtersBuilder.WriteString(fmt.Sprintf("dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	filtersBuilder.WriteString(fmt.Sprintf(" LIMIT $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.ProjectLimit)
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

	filtersBuilder.WriteString(fmt.Sprintf(" unique_id = $%d", len(whereEleList)+1))
	filtersBuilder.WriteString(fmt.Sprintf(" OR home_owner ILIKE $%d", len(whereEleList)+2))

	// Append parameters to whereEleList
	whereEleList = append(whereEleList, dataFilter.UniqueId)
	whereEleList = append(whereEleList, fmt.Sprintf("%%%s%%", dataFilter.UniqueId))

	// Check if there are filters
	if len(dataFilter.UniqueIds) > 0 {
		// whereAdded = true
		filtersBuilder.WriteString(" AND ")
		filtersBuilder.WriteString(" unique_id IN (")

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

		filtersBuilder.WriteString(" home_owner ILIKE ANY (ARRAY[")
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
	}

	filtersBuilder.WriteString(" primary_sales_rep IN (")
	for i, sale := range saleRepList {
		filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, sale)

		if i < len(saleRepList)-1 {
			filtersBuilder.WriteString(", ")
		}
	}

	filtersBuilder.WriteString(fmt.Sprintf(") AND dealer = $%d LIMIT $%d", len(whereEleList)+1, len(whereEleList)+2))
	whereEleList = append(whereEleList, dataFilter.DealerName, dataFilter.ProjectLimit)
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

func getStringValue(data map[string]interface{}, key string) (string, int64) {
	if value, exists := data[key]; exists {
		switch v := value.(type) {
		case string:
			switch key {
			case "production_discrepancy":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Completed", 0
				}

			case "sunpixel":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" || v == "✔" || v == "✔ N/A" || v == "✔  N/A" || v == " ✔" {
					return "Completed", 0
				}

			case "lease_agreement_uploaded":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}

			case "light_reach_design_verification":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "owe_agreement_uploaded":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "hof_uploaded":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "utility_acknowledgement_and_disclaimer_uploaded":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "ach_waiver_cash_customers_only_uploaded":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" || v == "❌" {
					return "Completed", 0
				}
			case "finance_ntp_of_project":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌  M1" || v == "❌  Approval" || v == "❌  Stips" {
					return "Pending (Action Required)", 1
				} else if v == "✔" {
					return "Completed", 0
				}
			case "utility_bill_uploaded":
				if v == "" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "powerclerk_signatures_complete":
				if v == "" || v == "❌  Pending CAD (SRP)" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌  Pending" || v == "❌  Pending Sending PC" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "powerclerk_sent_az":
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 0
				} else if v == "Pending Utility Account #" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "ach_waiver_sent_and_signed_cash_only":
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 0
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" || v == "❌" {
					return "Completed", 0
				}
			case "green_area_nm_only":
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌  (Project DQ'd)" {
					return "Pending (Action Required)", 1
				} else if v == "✔" || v == "✔ N/A" || v == "✔  N/A" {
					return "Completed", 0
				}
			case "finance_credit_approved_loan_or_lease":
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 0
				} else if v == "✔" || v == "✔ CASH - N/A" {
					return "Completed", 0
				}
			case "finance_agreement_completed_loan_or_lease":
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 0
				} else if v == "✔" || v == "✔ CASH - N/A" {
					return "Completed", 0
				}
			case "owe_documents_completed":
				if v == "" || v == "NULL" || v == "<nil>" {
					return "Pending", 0
				} else if v == "❌" {
					return "Pending (Action Required)", 1
				} else if v == "✔" {
					return "Completed", 0
				}
			default:
				return "", 0
			}
		case time.Time:
			if !v.IsZero() {
				return "Completed", 0
			} else {
				return "Pending", 0
			}
		}
	}
	return "Pending", 0
}
