/**************************************************************************
 * File       	   : apiGetRateAdjustments.go
 * DESCRIPTION     : This file contains functions for get RateAdjustments handler
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
 * FUNCTION:		HandleGetRateAdjustmentsRequest
 * DESCRIPTION:     handler for get RateAdjustments request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetRateAdjustmentsRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetRateAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleGetRateAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get rate adjustments request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get rate adjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get rate adjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get rate adjustments Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_rate_adjustments
	query = `
	SELECT ra.id as record_id, ra.pay_scale, ra.position, ra.adjustment, ra.min_rate, ra.max_rate
	FROM rate_adjustments ra`

	filter, whereEleList = PrepareRateAdjustmentsFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rate adjustments from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get rate adjustments from DB", http.StatusBadRequest, nil)
		return
	}

	rateAdjustmentsList := models.GetRateAdjustmentsList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		PayScale, ok := item["pay_scale"].(string)
		if !ok || PayScale == "" {
			log.FuncErrorTrace(0, "Failed to get pay scale for Record ID %v. Item: %+v\n", RecordId, item)
			PayScale = ""
		}

		Position, ok := item["position"].(string)
		if !ok || Position == "" {
			log.FuncErrorTrace(0, "Failed to get position for Record ID %v. Item: %+v\n", RecordId, item)
			Position = ""
		}

		Adjustment, ok := item["adjustment"].(string)
		if !ok || Adjustment == "" {
			log.FuncErrorTrace(0, "Failed to get adjustment for Record ID %v. Item: %+v\n", RecordId, item)
			Adjustment = ""
		}

		MinRate, ok := item["min_rate"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get min rate for Record ID %v. Item: %+v\n", RecordId, item)
			MinRate = 0.0
		}

		MaxRate, ok := item["max_rate"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get max rate for Record ID %v. Item: %+v\n", RecordId, item)
			MaxRate = 0.0
		}

		rateAdjustmentData := models.GetRateAdjustments{
			RecordId:   RecordId,
			PayScale:   PayScale,
			Position:   Position,
			Adjustment: Adjustment,
			MinRate:    MinRate,
			MaxRate:    MaxRate,
		}
		rateAdjustmentsList.RateAdjustmentsList = append(rateAdjustmentsList.RateAdjustmentsList, rateAdjustmentData)
	}

	filter, whereEleList = PrepareRateAdjustmentsFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rate adjustments from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get rate adjustments from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of rate adjustments List fetched : %v list %+v", len(rateAdjustmentsList.RateAdjustmentsList), rateAdjustmentsList)
	appserver.FormAndSendHttpResp(resp, "Rate Adjustments", http.StatusOK, rateAdjustmentsList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareRateAdjustmentsFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareRateAdjustmentsFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareRateAdjustmentsFilters")
	defer func() { log.ExitFn(0, "PrepareRateAdjustmentsFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ra.pay_scale) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "position":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ra.position) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "adjustment":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ra.adjustment) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "min_rate":
				filtersBuilder.WriteString(fmt.Sprintf("ra.min_rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "max_rate":
				filtersBuilder.WriteString(fmt.Sprintf("ra.max_rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ra.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ra.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ra.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ra.id, ra.pay_scale, ra.position, ra.adjustment, ra.min_rate, ra.max_rate")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ra.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
