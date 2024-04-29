/**************************************************************************
 * File       	   : apiGetSaleTypesData.go
 * DESCRIPTION     : This file contains functions for get sale type data handler
 * DATE            : 22-Jan-2024
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
 * FUNCTION:		HandleGetSaleTypeDataRequest
 * DESCRIPTION:     handler for get sale type data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetSaleTypeDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetSaleTypeDataRequest")
	defer func() { log.ExitFn(0, "HandleGetSaleTypeDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get sale type data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get sale type data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get sale type data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get sale type data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_sale_type
	query = `
	SELECT st.id as record_id, st.type_name as type_name, st.description as description
	FROM sale_type st`

	filter, whereEleList = PrepareSaleTypeFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sale type data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get sale type data from DB", http.StatusBadRequest, nil)
		return
	}

	saleTypeList := models.GetSaleTypeList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		typeName, typeOk := item["type_name"].(string)
		if !typeOk {
			log.FuncErrorTrace(0, "Failed to get type name for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

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

		// Create a new GetSaleTypeData object
		saleTypeData := models.GetSaleTypeData{
			RecordId:    RecordId,
			TypeName:    typeName,
			Description: Description,
		}

		saleTypeList.SaleTypeList = append(saleTypeList.SaleTypeList, saleTypeData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of sale type List fetched : %v list %+v", len(saleTypeList.SaleTypeList), saleTypeList)
	FormAndSendHttpResp(resp, "sale type Data", http.StatusOK, saleTypeList)
}

/******************************************************************************
 * FUNCTION:		PrepareSaleTypeFilters
 * DESCRIPTION:     handler for create select query
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareSaleTypeFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareSaleTypeFilters")
	defer func() { log.ExitFn(0, "PrepareSaleTypeFilters", nil) }()

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

	// Handle the Archived field
	if dataFilter.Archived {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("st.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("st.is_archived = FALSE")
	}

	// Add pagination
	if (dataFilter.PageSize > 0) && (dataFilter.PageNumber > 0) {
		filtersBuilder.WriteString(fmt.Sprintf(" LIMIT %d OFFSET %d", dataFilter.PageSize, (dataFilter.PageNumber-1)*dataFilter.PageSize))
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filtersBuilder.String())
	return filters, whereEleList
}
