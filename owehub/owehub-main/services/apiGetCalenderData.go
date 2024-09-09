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
	"encoding/json"
	"io/ioutil"
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
		// contractD           string
		PvInstallCreateD    string
		PvInstallCompleteD  string
		SiteSurevyD         string
		siteSurveyCmpletedD string
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

	// allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	// qcNTPQuery := models.QcNtpRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
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
	}

	if dataReq.Name == "" {
		log.FuncErrorTrace(0, "Failed to get calender data  user not exist as sales rep")
		FormAndSendHttpResp(resp, "Failed to get calender data  user not exist as sales rep", http.StatusBadRequest, nil)
		return
	}
	calenderDataList := models.GetCalenderDataList{}
	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	whereEleList = nil

	query := fmt.Sprintf("SELECT contract_date, pv_install_created_date, pv_install_completed_date, home_owner, address, unique_id, site_survey_scheduled_date, site_survey_completed_date "+
		"FROM consolidated_data_view where primary_sales_rep = '%v'", dataReq.Name)

	filter, whereEleList = PrepareCalenderFilters(tableName, dataReq, true)

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get pending queue tile data", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {
		var surveryStatus, installStatus, surveyDate, installDate string
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

		// ContractDate, ok := item["contract_date"].(time.Time)
		// if !ok {
		// 	// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
		// 	contractD = ""
		// } else {
		// 	contractD = ContractDate.Format("2006-01-02")
		// }

		PvInstallCreateDate, ok := item["pv_install_created_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCreateD = ""
		} else {
			PvInstallCreateD = PvInstallCreateDate.Format("2006-01-02")
		}

		PvInstallCompleteDate, ok := item["pv_install_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			PvInstallCompleteD = ""
		} else {
			PvInstallCompleteD = PvInstallCompleteDate.Format("2006-01-02")
		}

		SiteSurevyDate, ok := item["site_survey_scheduled_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			SiteSurevyD = ""
		} else {
			SiteSurevyD = SiteSurevyDate.Format("2006-01-02")
		}

		siteSurveyCmpletedDate, ok := item["site_survey_completed_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get PtoDate for Unique ID %v. Item: %+v\n", UniqueId, item)
			siteSurveyCmpletedD = ""
		} else {
			siteSurveyCmpletedD = siteSurveyCmpletedDate.Format("2006-01-02")
		}

		if siteSurveyCmpletedD == "" {
			surveryStatus = "Scheduled"
			surveyDate = SiteSurevyD
		} else {
			surveryStatus = "Completed"
			surveyDate = siteSurveyCmpletedD
		}

		if PvInstallCompleteD == "" {
			installStatus = "Scheduled"
			installDate = PvInstallCreateD
		} else {
			surveryStatus = "Completed"
			installDate = PvInstallCompleteD
		}

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

	RecordCount = int64(len(calenderDataList.CalenderDataList))

	log.FuncInfoTrace(0, "Number of pending queue tile List fetched : %v list %+v", 1, calenderDataList)
	FormAndSendHttpResp(resp, "pending queue tile Data", http.StatusOK, calenderDataList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareCalenderFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func PrepareCalenderFilters(tableName string, dataFilter models.GetCalenderDataReq, whereAdded bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareCalenderFilters")
	defer func() { log.ExitFn(0, "PrepareCalenderFilters", nil) }()

	var filtersBuilder strings.Builder
	// whereAdded := false

	// Check if StartDate and EndDate are provided
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		if whereAdded {
			filtersBuilder.WriteString(" AND")
		} else {
			filtersBuilder.WriteString(" WHERE")
		}
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
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
			   AND system_size > 0
			   AND project_status IN ('ACTIVE')`)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
