/**************************************************************************
 * File       	   : apiGetTimeLineSlaData.go
 * DESCRIPTION     : This file contains functions for get time line sla data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetTimelineSlasDataRequest
 * DESCRIPTION:     handler for get timeline sla data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTimelineSlasDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetTimelineSlasDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTimelineSlasDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get timeline sla data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get timeline sla data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get timeline sla data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get timeline sla data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_timeline_sla
	query = `
	SELECT tlsa.id as record_id, tlsa.type_m2m, st.name as state, tlsa.days, tlsa.start_date, tlsa.end_date
	FROM timeline_sla tlsa
	JOIN states st ON tlsa.state_id = st.state_id`

	filter, whereEleList = PrepareTimelineSlaFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get timeline sla data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get timeline sla data from DB", http.StatusBadRequest, nil)
		return
	}

	timelineSlaList := models.GetTimelineSlaList{}

	// Iterate through each item in the data
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// TypeM2M
		TypeM2M, ok := item["type_m2m"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get type m2m for Record ID %v. Item: %+v\n", RecordId, item)
			TypeM2M = ""
		}

		// State
		State, ok := item["state"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// Days
		DaysVal, ok := item["days"].(int64)
		Days := 0
		if !ok {
			log.FuncErrorTrace(0, "Failed to get days for Record ID %v. Item: %+v\n", RecordId, item)
			Days = 0 // Assigning 0 as default for Days
		} else {
			Days = int(DaysVal)
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		// Create a new GetTimelineSlaData object
		tlsData := models.GetTimelineSlaData{
			RecordId:  RecordId,
			TypeM2M:   TypeM2M,
			State:     State,
			Days:      Days,
			StartDate: StartDate,
			EndDate:   EndDate,
		}

		// Append the new tlsData to the timelineSlaList
		timelineSlaList.TimelineSlaList = append(timelineSlaList.TimelineSlaList, tlsData)
	}

	filter, whereEleList = PrepareTimelineSlaFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get timeline sla data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get timeline sla data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of timeline sla List fetched : %v list %+v", len(timelineSlaList.TimelineSlaList), timelineSlaList)
	appserver.FormAndSendHttpResp(resp, "Timeline Sla Data", http.StatusOK, timelineSlaList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareTimelineSlaFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareTimelineSlaFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareTimelineSlaFilters")
	defer func() { log.ExitFn(0, "PrepareTimelineSlaFilters", nil) }()

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
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "days":
				filtersBuilder.WriteString(fmt.Sprintf("tlsa.days %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(tlsa.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("tlsa.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("tlsa.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY tlsa.id, tlsa.type_m2m, st.name, tlsa.days, tlsa.start_date, tlsa.end_date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY tlsa.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
