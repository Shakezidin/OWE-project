/**************************************************************************
 * File       	   : apiGetArImport.go
 * DESCRIPTION     : This file contains functions for get ArImport data handler
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
 * FUNCTION:		HandleGetArImportDataRequest
 * DESCRIPTION:     handler for get ArImport data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetArImportDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetArImportDataRequest")
	defer func() { log.ExitFn(0, "HandleGetArImportDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ar import data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar import data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ar import data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get ar import data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_ArImport
	query = `
	 SELECT ai.id as record_id, ai.unique_id, ai.customer, ai.date, ai.amount, ai.notes, ai.is_archived
	 FROM ar_import ai`

	filter, whereEleList = PrepareArImportFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ar import data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ar import data from DB", http.StatusBadRequest, nil)
		return
	}

	ArImportList := models.GetArImportList{}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Unique_id
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// Customer
		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			log.FuncErrorTrace(0, "Failed to get customer name for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}

		// Date
		Date, ok := item["date"].(string)
		if !ok || Date == "" {
			log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = ""
		}

		// Amount
		Amount, ok := item["amount"].(string)
		if !ok || Amount == "" {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = ""
		}

		// Notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		arImportData := models.GetArImportReq{
			RecordId: RecordId,
			UniqueId: Unique_id,
			Customer: Customer,
			Date:     Date,
			Amount:   Amount,
			Notes:    Notes,
		}

		ArImportList.ArImportList = append(ArImportList.ArImportList, arImportData)
	}

	filter, whereEleList = PrepareArImportFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ar import data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ar import data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of ar import List fetched : %v list %+v", len(ArImportList.ArImportList), ArImportList)
	appserver.FormAndSendHttpResp(resp, "Ar Import Data", http.StatusOK, ArImportList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareArImportFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareArImportFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareArImportFilters")
	defer func() { log.ExitFn(0, "PrepareArImportFilters", nil) }()

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

			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			// Build the filter condition using correct db column name
			switch column {
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ai.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ai.customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ai.date) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ai.amount) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ai.notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				// For other columns, handle them accordingly
				filtersBuilder.WriteString("LOWER(ai.")
				filtersBuilder.WriteString(column)
				filtersBuilder.WriteString(") ")
				filtersBuilder.WriteString(operator)
				filtersBuilder.WriteString(" LOWER($")
				filtersBuilder.WriteString(fmt.Sprintf("%d", len(whereEleList)+1))
				filtersBuilder.WriteString(")")
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
		filtersBuilder.WriteString("ai.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ai.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ai.id, ai.unique_id, ai.customer, ai.date, ai.amount, ai.notes")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
