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
	"sort"
	"strings"
	"time"

	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetCalenderDataRequest
 * DESCRIPTION:     handler for get pending queue data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetCalenderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.GetCalenderDataReq
		data           []map[string]interface{}
		whereEleList   []interface{}
		queryWithFiler string
		filter         string
		RecordCount    int64
		SaleRepList    []interface{}
	)

	log.EnterFn(0, "HandleGetCalenderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetCalenderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get calender data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get calender data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get calender data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get calender data Request body", http.StatusBadRequest, nil)
		return
	}

	dataReq.Role = req.Context().Value("rolename").(string)
	if dataReq.Role == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	saleRepNameQuery := fmt.Sprintf("SELECT name FROM user_details where email_id = '%v'", dataReq.Email)
	query := (`SELECT customers_customers_schema.sale_date AS contract_date, pv_install_install_subcontracting_schema.created_on AS pv_install_created_date, 
pv_install_install_subcontracting_schema.pv_completion_date AS pv_install_completed_date, customers_customers_schema.customer_name AS home_owner, 
customers_customers_schema.address, customers_customers_schema.unique_id, survey_survey_schema.original_survey_scheduled_date AS site_survey_scheduled_date, 
survey_survey_schema.survey_completion_date AS site_survey_completed_date, batteries_service_electrical_schema.battery_installation_date AS battery_scheduled_date, 
batteries_service_electrical_schema.completion_date AS battery_complete_date, permit_fin_pv_permits_schema.pv_approved AS permit_approved_date, 
ic_ic_pto_schema.ic_approved_date
FROM 
            customers_customers_schema
        LEFT JOIN survey_survey_schema 
            ON survey_survey_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN permit_fin_pv_permits_schema 
            ON permit_fin_pv_permits_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN ic_ic_pto_schema 
            ON ic_ic_pto_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN pv_install_install_subcontracting_schema 
            ON pv_install_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
        LEFT JOIN batteries_service_electrical_schema 
            ON batteries_service_electrical_schema.customer_unique_id = customers_customers_schema.unique_id where customers_customers_schema.unique_id != ''
         `)

	// retrieving value from owe_db from here
	if dataReq.Role != string(types.RoleAdmin) && dataReq.Role != string(types.RoleFinAdmin) {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, saleRepNameQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue tile data", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			name, ok := data[0]["name"].(string)
			if !ok || name == "" {
				name = ""
			}
			SaleRepList = append(SaleRepList, name)
		}
	}

	tableName := db.ViewName_ConsolidatedDataView

	filter, whereEleList = PrepareCalenderFilters(tableName, dataReq, SaleRepList)

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get pending queue tile data", http.StatusBadRequest, nil)
		return
	}

	calenderDataList := models.GetCalenderDataList{}
	for _, item := range data {
		// if no unique id is present we skip that project
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId. Item: %+v\n", item)
			continue
		}

		HomeOwner, ok := item["home_owner"].(string)
		if !ok || HomeOwner == "" {
			log.FuncErrorTrace(0, "Failed to get HomeOwner Item: %+v\n", item)
			// continue
		}

		Address, ok := item["address"].(string)
		if !ok || Address == "" {
			log.FuncErrorTrace(0, "Failed to get Address Item: %+v\n", item)
			// continue
		}

		// ContractDate, _ := item["contract_date"].(time.Time)
		PvInstallCreateDate, _ := item["pv_install_created_date"].(time.Time)
		PvInstallCompleteDate, _ := item["pv_install_completed_date"].(time.Time)
		SiteSurevyDate, _ := item["site_survey_scheduled_date"].(time.Time)
		siteSurveyCmpletedDate, _ := item["site_survey_completed_date"].(time.Time)
		BatteryScheduleDate, _ := item["battery_scheduled_date"].(time.Time)
		BatteryCompleteDate, _ := item["battery_complete_date"].(time.Time)
		// PermitApprovedDate, _ := item["permit_approved_date"].(time.Time)
		// IcAPprovedDate, _ := item["ic_approved_date"].(time.Time)

		_, surveyDate, surveryStatus := getSurveyColor(SiteSurevyDate, siteSurveyCmpletedDate)
		_, installDate, installStatus := installColor(PvInstallCreateDate, BatteryScheduleDate, BatteryCompleteDate, PvInstallCompleteDate)

		if dataReq.StartDate != "" && dataReq.EndDate != "" && (!installDate.IsZero() || !surveyDate.IsZero()) {
			// Parse StartDate and EndDate
			startDate, err1 := time.Parse("2006-01-02", dataReq.StartDate)
			endDate, err2 := time.Parse("2006-01-02", dataReq.EndDate)
			if err1 != nil || err2 != nil {
				log.FuncErrorTrace(0, "Error parsing dates:%v, %v", err1, err2)
				appserver.FormAndSendHttpResp(resp, "Failed to get calender data, invalid date parsed", http.StatusBadRequest, nil)
				return
			}

			// Adjust endDate to include the entire day
			endDate = endDate.Add(time.Hour*23 + time.Minute*59 + time.Second*59)

			if !surveyDate.IsZero() {
				if err != nil || surveyDate.Before(startDate) || surveyDate.After(endDate) {
					surveyDate = time.Time{}
				}
			}

			if !installDate.IsZero() {
				if err != nil || installDate.Before(startDate) || installDate.After(endDate) {
					installDate = time.Time{}
				}
			}

			surveyDateStr := ""
			if !surveyDate.IsZero() {
				surveyDateStr = surveyDate.Format("2006-01-02")
			}

			installDateStr := ""
			if !installDate.IsZero() {
				installDateStr = installDate.Format("2006-01-02")
			}

			// Create and append to the calendar data list
			calenderData := models.GetCalenderData{
				UniqueId:      UniqueId,
				SurveyStatus:  surveryStatus,
				Address:       Address,
				HomeOwner:     HomeOwner,
				InstallStatus: installStatus,
				SurveyDate:    surveyDateStr,
				InstallDate:   installDateStr,
			}
			calenderDataList.CalenderDataList = append(calenderDataList.CalenderDataList, calenderData)
		} else {
			surveyDateStr := ""
			if !surveyDate.IsZero() {
				surveyDateStr = surveyDate.Format("2006-01-02")
			}

			installDateStr := ""
			if !installDate.IsZero() {
				installDateStr = installDate.Format("2006-01-02")
			}
			calenderData := models.GetCalenderData{
				UniqueId:      UniqueId,
				SurveyStatus:  surveryStatus,
				Address:       Address,
				HomeOwner:     HomeOwner,
				InstallStatus: installStatus,
				SurveyDate:    surveyDateStr,
				InstallDate:   installDateStr,
			}
			calenderDataList.CalenderDataList = append(calenderDataList.CalenderDataList, calenderData)
		}
	}

	// Sort the calendar data by SurveyDate and then by InstallDate
	sort.Slice(calenderDataList.CalenderDataList, func(i, j int) bool {
		// Parse dates from strings to time.Time
		date1, _ := time.Parse("2006-01-02 15:04:05", calenderDataList.CalenderDataList[i].SurveyDate)
		date2, _ := time.Parse("2006-01-02 15:04:05", calenderDataList.CalenderDataList[j].SurveyDate)

		// Compare SurveyDate first
		if !date1.IsZero() && !date2.IsZero() {
			return date1.Before(date2)
		}

		// If SurveyDate is not available, compare InstallDate
		installDate1, _ := time.Parse("2006-01-02 15:04:05", calenderDataList.CalenderDataList[i].InstallDate)
		installDate2, _ := time.Parse("2006-01-02 15:04:05", calenderDataList.CalenderDataList[j].InstallDate)

		return installDate1.Before(installDate2)
	})

	RecordCount = int64(len(calenderDataList.CalenderDataList))

	log.FuncInfoTrace(0, "Number of pending queue tile List fetched : %v list %+v", 1, calenderDataList)
	appserver.FormAndSendHttpResp(resp, "pending queue tile Data", http.StatusOK, calenderDataList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareCalenderFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareCalenderFilters(tableName string, dataFilter models.GetCalenderDataReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareCalenderFilters")
	defer func() { log.ExitFn(0, "PrepareCalenderFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := true

	// // Start constructing the WHERE clause if the date range is provided
	// if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
	// 	startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
	// 	endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

	// 	endDate = endDate.Add(24*time.Hour - time.Second)

	// 	whereEleList = append(whereEleList,
	// 		startDate.Format("02-01-2006 00:00:00"),
	// 		endDate.Format("02-01-2006 15:04:05"),
	// 	)

	// 	filtersBuilder.WriteString(fmt.Sprintf(" WHERE contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
	// 	whereAdded = true
	// }

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

	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	// Add the always-included filters
	filtersBuilder.WriteString(` customers_customers_schema.unique_id IS NOT NULL
			AND customers_customers_schema.unique_id <> ''`)

	if len(dataFilter.ProjectStatus) > 0 {
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` AND customers_customers_schema.project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND customers_customers_schema.project_status IN ('ACTIVE')`)
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
