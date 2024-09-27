/**************************************************************************
 * File       	   : apiGetAdderCredit.go
 * DESCRIPTION     : This file contains functions for get AdderCredit data handler
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
 * FUNCTION:		HandleGetAdderCreditDataRequest
 * DESCRIPTION:     handler for get AdderCredit data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAdderCreditDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetAdderCreditDataRequest")
	defer func() { log.ExitFn(0, "HandleGetAdderCreditDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get adder credit data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get adder credit data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get adder credit data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get adder credit data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_AdderCredit
	query = `
	  SELECT ac.id as record_id, ac.pay_scale, ac.type, ac.min_rate, ac.max_rate
	  FROM adder_credit ac`

	filter, whereEleList = PrepareAdderCreditFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get adder credit data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get adder credit data from DB", http.StatusBadRequest, nil)
		return
	}

	AdderCreditList := models.GetAdderCreditList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Unique_id

		// Pay_scale
		Pay_scale, ok := item["pay_scale"].(string)
		if !ok || Pay_scale == "" {
			log.FuncErrorTrace(0, "Failed to get pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			Pay_scale = ""
		}

		// Type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// Min_Rate
		Min_Rate, ok := item["min_rate"].(float64)
		if !ok || Min_Rate == 0.0 {
			log.FuncErrorTrace(0, "Failed to get min rate for Record ID %v. Item: %+v\n", RecordId, item)
			Min_Rate = 0.0
		}

		// Max_rare
		Max_rate, ok := item["max_rate"].(float64)
		if !ok || Max_rate == 0.0 {
			log.FuncErrorTrace(0, "Failed to get max rate for Record ID %v. Item: %+v\n", RecordId, item)
			Max_rate = 0.0
		}

		AdderCreditData := models.GetAdderCreditReq{
			RecordId:  RecordId,
			Pay_Scale: Pay_scale,
			Type:      Type,
			Min_Rate:  Min_Rate,
			Max_Rate:  Max_rate,
		}
		AdderCreditList.AdderCreditList = append(AdderCreditList.AdderCreditList, AdderCreditData)
	}

	filter, whereEleList = PrepareAdderCreditFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	} else {
		queryForAlldata = query
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get adder credit data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get adder credit data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of adder credit List fetched : %v list %+v", len(AdderCreditList.AdderCreditList), AdderCreditList)
	appserver.FormAndSendHttpResp(resp, "Adder Credit Data", http.StatusOK, AdderCreditList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAdderCreditFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareAdderCreditFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdderCreditFilters")
	defer func() { log.ExitFn(0, "PrepareAdderCreditFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ac.pay_scale) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ac.type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "min_rate":
				filtersBuilder.WriteString(fmt.Sprintf("ac.min_rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "max_rate":
				filtersBuilder.WriteString(fmt.Sprintf("ac.max_rate %s $%d", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ac.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ac.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ac.id, ac.pay_scale, ac.type, ac.min_rate, ac.max_rate")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ac.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
