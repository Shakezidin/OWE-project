/**************************************************************************
 * File       	   : apiGetApptSetters.go
 * DESCRIPTION     : This file contains functions for get ApptSetters data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetApptSettersDataRequest
 * DESCRIPTION:     handler for get ApptSetters data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetApptSettersDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		dataReq         models.DataRequestBody
		data            []map[string]interface{}
		whereEleList    []interface{}
		query           string
		queryWithFiler  string
		queryForAlldata string
		filter          string
		RecordCount     int64
	)

	log.EnterFn(0, "HandleGetApptSettersDataRequest")
	defer func() { log.ExitFn(0, "HandleGetApptSettersDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get appt setters data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get appt setters data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get appt setters data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get appt setters data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_Appt_Setters
	query = `
	 SELECT ap.id as record_id, ap.unique_id, ap.name, tm.team_name, ap.pay_rate, ap.start_date, ap.end_date, ap.is_archived
	 FROM appt_setters ap
	 LEFT JOIN teams tm ON tm.team_id = ap.team_id`

	filter, whereEleList = PrepareApptSettersFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get appt setters data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get appt setters data from DB", http.StatusBadRequest, nil)
		return
	}

	ApptSettersList := models.GetApptSettersList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// UniqueId
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get Unique_Id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		// Name
		Name, ok := item["name"].(string)
		if !ok || Name == "" {
			log.FuncErrorTrace(0, "Failed to get name for Record ID %v. Item: %+v\n", RecordId, item)
			Name = ""
		}

		// Team_name
		Team_name, ok := item["team_name"].(string)
		if !ok || Team_name == "" {
			log.FuncErrorTrace(0, "Failed to get team_name for Record ID %v. Item: %+v\n", RecordId, item)
			Team_name = ""
		}

		// PayRate
		PayRate, ok := item["pay_rate"].(string)
		if !ok || PayRate == "" {
			log.FuncErrorTrace(0, "Failed to get pay rate for Record ID %v. Item: %+v\n", RecordId, item)
			PayRate = ""
		}

		// StartDate
		StartDate, ok := item["start_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		startDate := StartDate.Format("2006-01-02")
		endDate := EndDate.Format("2006-01-02")

		ApptSettersData := models.GetApptSettersReq{
			RecordId:  RecordId,
			UniqueId:  UniqueId,
			Name:      Name,
			TeamName:  Team_name,
			PayRate:   PayRate,
			StartDate: startDate,
			EndDate:   endDate,
		}
		ApptSettersList.ApptSettersList = append(ApptSettersList.ApptSettersList, ApptSettersData)
	}

	filter, whereEleList = PrepareApptSettersFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get appt setters data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get appt setters data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of appt setters List fetched : %v list %+v", len(ApptSettersList.ApptSettersList), ApptSettersList)
	appserver.FormAndSendHttpResp(resp, "Appt Setters Data", http.StatusOK, ApptSettersList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareApptSettersFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareApptSettersFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareApptSettersFilters")
	defer func() { log.ExitFn(0, "PrepareApptSettersFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Flag to track if WHERE clause has been added

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true // Set flag to true as WHERE clause is added

		for i, filter := range dataFilter.Filters {
			// Check if the column is a foreign key
			column := filter.Column

			// Determine the operator and value based on the filter operation
			operator := GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			// For "stw" and "edw" operations, modify the value with '%'
			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}

			// Build the filter condition using correct db column name
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			switch column {
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "team_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(tm.team_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "pay_rate":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.pay_rate) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("ap.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("ap.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	// Handle the Archived field
	if dataFilter.Archived {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ap.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ap.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ap.id, ap.unique_id, ap.name, tm.team_name, ap.pay_rate, ap.start_date, ap.end_date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ap.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
