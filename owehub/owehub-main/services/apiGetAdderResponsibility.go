/**************************************************************************
 * File       	   : apiGetAdderResponsibility.go
 * DESCRIPTION     : This file contains functions for get AdderResponsibility data handler
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
 * FUNCTION:		HandleGetAdderResponsibilityDataRequest
 * DESCRIPTION:     handler for get AdderResponsibility data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAdderResponsibilityDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetAdderResponsibilityDataRequest")
	defer func() { log.ExitFn(0, "HandleGetAdderResponsibilityDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get adder responsibility data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get adder responsibility data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get adder responsibility data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get adder responsibility data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_AdderResponsibility
	query = `
	 SELECT ar.id as record_id, ar.pay_scale, ar.percentage, ar.is_archived
	 FROM adder_responsibility ar`

	filter, whereEleList = PrepareAdderResponsibilityFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get adder responsibility data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get adder responsibility data from DB", http.StatusBadRequest, nil)
		return
	}

	AdderResponsibilityList := models.GetAdderResponsibilityList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// Pay_scale
		Pay_scale, ok := item["pay_scale"].(string)
		if !ok || Pay_scale == "" {
			log.FuncErrorTrace(0, "Failed to get pay scale for Record ID %v. Item: %+v\n", RecordId, item)
			Pay_scale = ""
		}

		// Percentage
		Percentage, ok := item["percentage"].(float64)
		if !ok || Percentage == 0.0 {
			log.FuncErrorTrace(0, "Failed to get percentage for Record ID %v. Item: %+v\n", RecordId, item)
			Percentage = 0.0
		}

		AdderResponsibilityData := models.GetAdderResponsibilityReq{
			RecordId:   RecordId,
			Pay_Scale:  Pay_scale,
			Percentage: Percentage,
		}
		AdderResponsibilityList.AdderResponsibilityList = append(AdderResponsibilityList.AdderResponsibilityList, AdderResponsibilityData)
	}

	filter, whereEleList = PrepareAdderResponsibilityFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get adder responsibility data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get adder responsibility data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of adder responsibility List fetched : %v list %+v", len(AdderResponsibilityList.AdderResponsibilityList), AdderResponsibilityList)
	appserver.FormAndSendHttpResp(resp, "Adder Responsibility Data", http.StatusOK, AdderResponsibilityList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAdderResponsibilityFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareAdderResponsibilityFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdderResponsibilityFilters")
	defer func() { log.ExitFn(0, "PrepareAdderResponsibilityFilters", nil) }()

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
			case "pay_scale":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.pay_scale) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "percentage":
				filtersBuilder.WriteString(fmt.Sprintf("ar.percentage %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ar.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ar.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ar.id, ar.pay_scale, ar.percentage")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ar.id  OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
