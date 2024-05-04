/**************************************************************************
 * File       	   : apiGetAR.go
 * DESCRIPTION     : This file contains functions for get AR data handler
 * DATE            : 01-May-2024
 **************************************************************************/

package services

import (
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
 * FUNCTION:		HandleGetARDataRequest
 * DESCRIPTION:     handler for get AR data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetARDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetARDataRequest")
	defer func() { log.ExitFn(0, "HandleGetARDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get AR data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get AR data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get AR data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get AR data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_Ar
	query = `
	  SELECT id as record_id, unique_id, customer, date, amount, notes
	  FROM ar`

	filter, whereEleList = PrepareARFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get AR data from DB", http.StatusBadRequest, nil)
		return
	}

	ARList := models.GetARList{}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Unique_id
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			log.FuncErrorTrace(0, "Failed to get Unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// Customer
		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			log.FuncErrorTrace(0, "Failed to get customer for Record ID %v. Item: %+v\n", RecordId, item)
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

		aRData := models.GetARReq{
			RecordId:     RecordId,
			UniqueId:     Unique_id,
			CustomerName: Customer,
			Date:         Date,
			Amount:       Amount,
			Notes:        Notes,
		}

		ARList.ARList = append(ARList.ARList, aRData)
	}

	filter, whereEleList = PrepareARFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get AR data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of AR List fetched : %v list %+v", len(ARList.ARList), ARList)
	FormAndSendHttpResp(resp, "AR Data", http.StatusOK, ARList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareARFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareARFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareARFilters")
	defer func() { log.ExitFn(0, "PrepareARFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "data":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(data) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(amount) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				// For other columns, handle them accordingly
				filtersBuilder.WriteString("LOWER(")
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
		filtersBuilder.WriteString("is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY id, unique_id, customer, date, amount, notes")
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
