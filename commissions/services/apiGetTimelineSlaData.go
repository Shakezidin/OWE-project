/**************************************************************************
 * File       	   : apiGetTierLoanFeesData.go
 * DESCRIPTION     : This file contains functions for get v adder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"
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
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetTimelineSlasDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTimelineSlasDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get timeline sla data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get timeline sla data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get timeline sla data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get timeline sla data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_timeline_sla
	query = `
	SELECT tlsa.id as record_id, tlsa.type_m2m, st.name as state, tlsa.days, tlsa.start_date, tlsa.end_date
	FROM timeline_sla tlsa
	JOIN states st ON tlsa.state_id = st.state_id
	`

	filter, whereEleList = PrepareTimelineSlaFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get timeline sla data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get timeline sla data from DB", http.StatusBadRequest, nil)
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
			log.FuncErrorTrace(0, "Failed to get TypeM2M for Record ID %v. Item: %+v\n", RecordId, item)
			TypeM2M = ""
		}

		// State
		State, ok := item["state"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get State for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// Days
		DaysVal, ok := item["days"].(int64)
		Days := 0
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Days for Record ID %v. Item: %+v\n", RecordId, item)
			Days = 0 // Assigning 0 as default for Days
		} else {
			Days = int(DaysVal)
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get StartDate for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get EndDate for Record ID %v. Item: %+v\n", RecordId, item)
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

	// Send the response
	log.FuncInfoTrace(0, "Number of timeline sla List fetched : %v list %+v", len(timelineSlaList.TimelineSlaList), timelineSlaList)
	FormAndSendHttpResp(resp, "timeline sla Data", http.StatusOK, timelineSlaList)
}

/******************************************************************************
 * FUNCTION:		PrepareTimelineSlaFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareTimelineSlaFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareTimelineSlaFilters")
	defer func() { log.ExitFn(0, "PrepareTimelineSlaFilters", nil) }()
	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")

		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

			// Check if the column is a foreign key
			column := filter.Column
			switch column {
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "days":
				filtersBuilder.WriteString(fmt.Sprintf("ts.days %s $%d", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, filter.Data)
			default:
				// For other columns, handle them accordingly
				filtersBuilder.WriteString("LOWER(")
				filtersBuilder.WriteString(filter.Column)
				filtersBuilder.WriteString(") ")
				filtersBuilder.WriteString(filter.Operation)
				filtersBuilder.WriteString(" LOWER($")
				filtersBuilder.WriteString(fmt.Sprintf("%d", len(whereEleList)+1))
				filtersBuilder.WriteString(")")
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			}
		}
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
