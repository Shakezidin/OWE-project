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
	"regexp"
	"strconv"
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
		err         error
		dataReq     models.ProjectStatusReq
		data        []map[string]interface{}
		RecordCount int64
		roleFilter  string
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

	if userRole != string(types.RoleAccountManager) && userRole != string(types.RoleAccountExecutive) &&
		userRole != string(types.RoleAdmin) && userRole != string(types.RoleFinAdmin) &&
		userRole != string(types.RoleProjectManager) {
		roleFilter, err = HandleDataFilterOnUserRoles(dataReq.Email, userRole, "customers_customers_schema", dataReq.DealerNames)
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
	}

	searchValue := ""
	if len(dataReq.UniqueId) > 0 {
		searchValue = fmt.Sprintf(" AND (customers_customers_schema.customer_name ILIKE '%%%s%%' OR customers_customers_schema.unique_id ILIKE '%%%s%%') ", dataReq.UniqueId, dataReq.UniqueId)
	}

	saleMetricsQuery := models.ProjectMngmntRetrieveQueryFunc(roleFilter, searchValue)

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, saleMetricsQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, nil)
		return
	}

	projectList := models.ProjectListResponse{}

	for _, item := range data {
		var projectData models.ProjectResponse
		mapRowToStruct(item, &projectData)
		projectData.Epc = CheckFloat(extractAndParseCost(projectData.ContractAmount) / (projectData.SystemSize * 1000))
		projectData.AdderBreakDownAndTotal = cleanAdderBreakDownAndTotal(projectData.AdderBreakDownAndTotalString)
		projectData.AddersTotal = projectData.AdderBreakDownAndTotal["Total"]
		if projectData.AddersTotal == "" {
			adderBreakDown := cleanAdderBreakDownAndTotalTwo(projectData.AdderBreakDownAndTotalString)
			projectData.AddersTotal = getString(adderBreakDown, "Total")
		}
		projectList.ProjectList = append(projectList.ProjectList, projectData)
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

	linkQuery := models.QcNtpRetrieveQueryFunc() + fmt.Sprintf("WHERE customers_customers_schema.unique_id = '%s'", dataReq.UniqueId)
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, linkQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ProjectManagaement data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ProjectManagaement data from DB", http.StatusBadRequest, nil)
		return
	}
	if len(data) > 0 {
		var ntpDate string
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

		if NtpDates, ok := data[0]["ntp_date"].(time.Time); ok {
			ntpDate = NtpDates.Format("02-01-2006")
		} else {
			ntpDate = "" // or a default value
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

func cleanAdderBreakDownAndTotalTwo(data string) map[string]string {
	result := make(map[string]string)
	if len(data) == 0 {
		return result
	}

	// Remove '**' and clean the string
	data = strings.ReplaceAll(data, "**", "")

	// Regular expression to match key-value pairs like "key: value"
	re := regexp.MustCompile(`([A-Za-z0-9\s\-\(\)]+):\s*([0-9]+)`)

	// Find all matches of key-value pairs
	matches := re.FindAllStringSubmatch(data, -1)

	// Iterate over all matches and populate the result map
	for _, match := range matches {
		if len(match) == 3 {
			key := strings.TrimSpace(match[1])
			value := strings.TrimSpace(match[2])

			// If the key is 'Total', we capture the value for 'Total'
			if key == "Total" {
				result[key] = value
				break // Stop further processing once 'Total' is found
			}

			// Otherwise, just add the key-value pair to the map
			result[key] = value
		}
	}

	// Log the result for debugging
	// log.FuncErrorTrace(0, "data = %v ", result)

	return result
}

func getString(item map[string]string, key string) string {
	if value, ok := item[key]; ok {
		return value
	}
	return ""
}

func extractAndParseCost(totalSystemCost string) float64 {
	costStr := strings.TrimSpace(totalSystemCost)

	// log.FuncErrorTrace(0, "Unique ID: %s - Original Cost String: '%s'", uniqueID, costStr)

	// Step 1: Remove HTML tags
	re := regexp.MustCompile(`<.*?>`)
	costStr = re.ReplaceAllString(costStr, "")

	// Step 2: Remove BOM (\ufeff), non-breaking spaces (\u00a0), and other spaces
	costStr = strings.ReplaceAll(costStr, "\ufeff", "")
	costStr = strings.ReplaceAll(costStr, "\u00a0", "")
	costStr = strings.ReplaceAll(costStr, " ", "") // Remove spaces between numbers

	// Step 3: Remove dollar signs and trim
	costStr = strings.ReplaceAll(costStr, "$", "")
	costStr = strings.TrimSpace(costStr)

	// Step 4: Extract the first numeric value
	reNums := regexp.MustCompile(`\d+(?:,\d{3})*(?:\.\d+)?`)
	match := reNums.FindString(costStr) // Extract only the first match
	if match == "" {
		// log.FuncErrorTrace(0, "Unique ID: %s - No numeric value found, skipping parsing. val %v", uniqueID, totalSystemCost)
		return 0.0
	}

	// Step 5: Remove commas for float conversion
	numericPart := strings.ReplaceAll(match, ",", "")
	// log.FuncErrorTrace(0, "Unique ID: %s - Numeric Portion Extracted: '%s'", uniqueID, numericPart)

	// Step 6: Parse the numeric string into a float
	parsedCost, err := strconv.ParseFloat(numericPart, 64)
	if err == nil {
		// log.FuncErrorTrace(0, "Unique ID: %s - Parsed Float Value: %f", uniqueID, parsedCost)
		return parsedCost
	}

	return 0.0
}

func CheckFloat(value float64) float64 {
	if math.IsInf(value, 1) || math.IsInf(value, -1) || math.IsNaN(value) {
		return 0
	}
	return value
}
