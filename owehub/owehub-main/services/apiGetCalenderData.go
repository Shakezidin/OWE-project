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
		err                 error
		dataReq             models.GetCalenderDataReq
		data                []map[string]interface{}
		whereEleList        []interface{}
		queryWithFiler      string
		filter              string
		RecordCount         int64
		contractD           string
		PvInstallCreateD    string
		PvInstallCompleteD  string
		SiteSurevyD         string
		siteSurveyCmpletedD string
		BatteryScheduleD    string
		BatteryCompleteD    string
		PermitApprovedD     string
		IcaprvdD            string
		dealerName          interface{}
		rgnSalesMgrCheck    bool
		SaleRepList         []interface{}
	)

	log.EnterFn(0, "HandleGetCalenderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetCalenderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get calender data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get calender data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get calender data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get calender data Request body", http.StatusBadRequest, nil)
		return
	}

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()
	query := (`SELECT contract_date, pv_install_created_date, pv_install_completed_date, home_owner, address, unique_id, site_survey_scheduled_date, site_survey_completed_date,
		battery_scheduled_date, battery_complete_date, permit_approved_date, ic_approved_date
		FROM consolidated_data_view `)

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)
	tableName := db.ViewName_ConsolidatedDataView

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		dealerName = data[0]["dealer_name"]
		rgnSalesMgrCheck = false
		dataReq.DealerName = dealerName
		role, ok := data[0]["role_name"].(string)
		if !ok || role == "" {
			role = ""
		}
		name := data[0]["name"].(string)
		if !ok || name == "" {
			name = ""
		}
		dataReq.Name = name
		dataReq.Role = role

		switch role {
		case string(types.RoleAdmin), string(types.RoleFinAdmin):
			filter, whereEleList = PrepareAdminDlrCalenderFilters(tableName, dataReq, true, false)
		case string(types.RoleDealerOwner):
			filter, whereEleList = PrepareAdminDlrCalenderFilters(tableName, dataReq, false, false)
		case string(types.RoleSalesRep):
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareSaleRepCalenderFilters(tableName, dataReq, SaleRepList)
		// this is for the roles regional manager and sales manager
		default:
			SaleRepList = append(SaleRepList, name)
			rgnSalesMgrCheck = true
		}
	} else {
		log.FuncErrorTrace(0, "Failed to get Calender data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Calender data", http.StatusBadRequest, nil)
		return
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and for other user roles
		if len(SaleRepList) == 0 {
			emptyPerfomanceList := models.PerfomanceListResponse{
				PerfomanceList: []models.PerfomanceResponse{},
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
		filter, whereEleList = PrepareSaleRepCalenderFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	calenderDataList := models.GetCalenderDataList{}
	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get pending queue tile data", http.StatusBadRequest, nil)
		return
	}

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

		ContractDate, ok := item["contract_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			contractD = ""
		} else {
			contractD = ContractDate.Format("2006-01-02 15:04:05")
		}

		PvInstallCreateDate, ok := item["pv_install_created_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCreateD = ""
		} else {
			PvInstallCreateD = PvInstallCreateDate.Format("2006-01-02 15:04:05")
		}

		PvInstallCompleteDate, ok := item["pv_install_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCompleteD = ""
		} else {
			PvInstallCompleteD = PvInstallCompleteDate.Format("2006-01-02 15:04:05")
		}

		SiteSurevyDate, ok := item["site_survey_scheduled_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			SiteSurevyD = ""
		} else {
			SiteSurevyD = SiteSurevyDate.Format("2006-01-02 15:04:05")
		}

		siteSurveyCmpletedDate, ok := item["site_survey_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			siteSurveyCmpletedD = ""
		} else {
			siteSurveyCmpletedD = siteSurveyCmpletedDate.Format("2006-01-02 15:04:05")
		}

		BatteryScheduleDate, ok := item["battery_scheduled_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			BatteryScheduleD = ""
		} else {
			BatteryScheduleD = BatteryScheduleDate.Format("2006-01-02 15:04:05")
		}

		BatteryCompleteDate, ok := item["battery_complete_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get active date for Unique ID %v. Item: %+v\n", UniqueId, item)
			BatteryCompleteD = ""
		} else {
			BatteryCompleteD = BatteryCompleteDate.Format("2006-01-02 15:04:05")
		}

		PermitApprovedDate, ok := item["permit_approved_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get InstallReadyDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PermitApprovedD = ""
		} else {
			PermitApprovedD = PermitApprovedDate.Format("2006-01-02 15:04:05")
		}

		IcAPprovedDate, ok := item["ic_approved_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get roofing complete date for Unique ID %v. Item: %+v\n", UniqueId, item)
			IcaprvdD = ""
		} else {
			IcaprvdD = IcAPprovedDate.Format("2006-01-02 15:04:05")
		}

		_, _, surveyDate, surveryStatus := getSurveyColor(SiteSurevyD, siteSurveyCmpletedD, contractD)
		_, _, installDate, installStatus := CalenderInstallStatus(PvInstallCreateD, BatteryScheduleD, BatteryCompleteD, PvInstallCompleteD, PermitApprovedD, IcaprvdD)

		calenderData := models.GetCalenderData{
			UniqueId:      UniqueId,
			SurveyStatus:  surveryStatus,
			Address:       Address,
			HomeOwner:     HomeOwner,
			InstallStatus: installStatus,
			SurveyDate:    surveyDate,
			InstallDate:   installDate,
		}
		calenderDataList.CalenderDataList = append(calenderDataList.CalenderDataList, calenderData)
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
	FormAndSendHttpResp(resp, "pending queue tile Data", http.StatusOK, calenderDataList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareAdminDlrCalenderFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareAdminDlrCalenderFilters(tableName string, dataFilter models.GetCalenderDataReq, adminCheck, filterCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdminDlrCalenderFilters")
	defer func() { log.ExitFn(0, "PrepareAdminDlrCalenderFilters", nil) }()

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
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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
		filtersBuilder.WriteString(fmt.Sprintf(" dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	// Always add the following filters
	if whereAdded {
		filtersBuilder.WriteString(" AND")
	} else {
		filtersBuilder.WriteString(" WHERE")
	}
	filtersBuilder.WriteString(` unique_id IS NOT NULL
			AND unique_id <> ''
			AND system_size IS NOT NULL
			AND system_size > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` AND project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND project_status IN ('ACTIVE')`)

	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

/******************************************************************************
* FUNCTION:		PrepareSaleRepCalenderFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareSaleRepCalenderFilters(tableName string, dataFilter models.GetCalenderDataReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareSaleRepCalenderFilters")
	defer func() { log.ExitFn(0, "PrepareSaleRepCalenderFilters", nil) }()

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

		filtersBuilder.WriteString(fmt.Sprintf(" WHERE contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
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

		filtersBuilder.WriteString(" primary_sales_rep IN (")
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
	filtersBuilder.WriteString(fmt.Sprintf(" dealer = $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	// Add the always-included filters
	filtersBuilder.WriteString(` AND unique_id IS NOT NULL
			AND unique_id <> ''
			AND system_size IS NOT NULL
			AND system_size > 0`)

	if len(dataFilter.ProjectStatus) > 0 {
		// Prepare the values for the IN clause
		var statusValues []string
		for _, val := range dataFilter.ProjectStatus {
			statusValues = append(statusValues, fmt.Sprintf("'%s'", val))
		}
		// Join the values with commas
		statusList := strings.Join(statusValues, ", ")

		// Append the IN clause to the filters
		filtersBuilder.WriteString(fmt.Sprintf(` AND project_status IN (%s)`, statusList))
	} else {
		filtersBuilder.WriteString(` AND project_status IN ('ACTIVE')`)
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
