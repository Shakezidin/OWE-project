/**************************************************************************
 * File       	   : apiGetSaleTypesData.go
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
 * FUNCTION:		HandleGetVAdderDataRequest
 * DESCRIPTION:     handler for get v adder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetVAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetVAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetVAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get v adders data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get v adders data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get v adders data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get v adders data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_v_adders
	query = `
	SELECT vadd.id as record_id, vadd.adder_name, vadd.adder_type, vadd.price_type, vadd.price_amount, vadd.active, vadd.description
	FROM v_adders vadd`

	filter, whereEleList = PrepareFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get v adders data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get v adders data from DB", http.StatusBadRequest, nil)
		return
	}

	vaddersList := models.GetVAddersList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// AdderName
		AdderName, adderNameOk := item["adder_name"].(string)
		if !adderNameOk || AdderName == "" {
			log.FuncErrorTrace(0, "Failed to get adder name for Record ID %v. Item: %+v\n", RecordId, item)
			AdderName = ""
		}

		// AdderType
		AdderType, adderTypeOk := item["adder_type"].(string)
		if !adderTypeOk || AdderType == "" {
			log.FuncErrorTrace(0, "Failed to get adder type for Record ID %v. Item: %+v\n", RecordId, item)
			AdderType = ""
		}

		// PriceType
		PriceType, priceTypeOk := item["price_type"].(string)
		if !priceTypeOk || PriceType == "" {
			log.FuncErrorTrace(0, "Failed to get price type for Record ID %v. Item: %+v\n", RecordId, item)
			PriceType = ""
		}

		// PriceAmount
		PriceAmount, priceAmountOk := item["price_amount"].(string)
		if !priceAmountOk || PriceAmount == "" {
			log.FuncErrorTrace(0, "Failed to get price amount for Record ID %v. Item: %+v\n", RecordId, item)
			PriceAmount = ""
		}

		// Active
		ActiveVal, activeOk := item["active"].(int64)
		if !activeOk {
			log.FuncErrorTrace(0, "Failed to get active for Record ID %v. Item: %+v\n", RecordId, item)
		}
		Active := int(ActiveVal)

		// Description
		Description, descOk := item["description"].(string)
		if !descOk || Description == "" {
			Description = ""
		}

		// is_archived
		IsArchived, ok := item["is_archived"].(bool)
		if !ok || !IsArchived {
			log.FuncErrorTrace(0, "Failed to get is_archived value for Record ID %v. Item: %+v\n", RecordId, item)
			IsArchived = false
		}

		// Create a new GetVAdderData object
		vaddersData := models.GetVAdderData{
			RecordId:    RecordId,
			AdderName:   AdderName,
			AdderType:   AdderType,
			PriceType:   PriceType,
			PriceAmount: PriceAmount,
			Active:      Active,
			Description: Description,
		}

		// Append the new vaddersData to the vaddersList
		vaddersList.VAddersList = append(vaddersList.VAddersList, vaddersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of v adders List fetched : %v list %+v", len(vaddersList.VAddersList), vaddersList)
	FormAndSendHttpResp(resp, "v adders Data", http.StatusOK, vaddersList)
}

/******************************************************************************
 * FUNCTION:		PrepareVAdderFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareVAdderFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareVAdderFilters")
	defer func() { log.ExitFn(0, "PrepareVAdderFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Flag to track if WHERE clause has been added

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true // Set flag to true as WHERE clause is added

		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

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
			switch column {
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "source":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(sr.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(mf.description) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "chg_dlr":
				filtersBuilder.WriteString(fmt.Sprintf("mf.chg_dlr %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "pay_src":
				filtersBuilder.WriteString(fmt.Sprintf("mf.pay_src %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "fee_rate":
				filtersBuilder.WriteString(fmt.Sprintf("mf.fee_rate %s $%d", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("vadd.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("vadd.is_archived = FALSE")
	}

	// Add pagination logic
	if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
		offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
		filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
