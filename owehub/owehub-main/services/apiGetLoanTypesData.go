/**************************************************************************
 * File       	   : apiGetLoanTypesData.go
 * DESCRIPTION     : This file contains functions for get loan type data handler
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
 * FUNCTION:		HandleGetLoanTypesDataRequest
 * DESCRIPTION:     handler for get loan data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLoanTypesDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetLoanTypesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLoanTypesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get loan data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get loan data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get loan data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get loan data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_loan_type
	query = `
	SELECT lt.id as record_id, lt.product_code, lt.active, lt.adder, lt.description FROM loan_type lt`

	filter, whereEleList = PrepareLoanTypesFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get partner data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get partner data from DB", http.StatusBadRequest, nil)
		return
	}

	loansList := models.GetLoanTypeList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// Convert fields from item
		productCode, codeOk := item["product_code"].(string)
		if !codeOk || productCode == "" {
			log.FuncErrorTrace(0, "Failed to get partner code Item: %+v\n", item)
			productCode = ""
		}

		activeVal, ok := item["active"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get active Item: %+v\n", item)
			activeVal = 0 // Assigning 0 as default for activeVal
		}
		active := int(activeVal)

		adderVal, ok := item["adder"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get adder Item: %+v\n", item)
			adderVal = 0 // Assigning 0 as default for adderVal
		}
		adder := int(adderVal)

		description, descOk := item["description"].(string)
		if !descOk || description == "" {
			description = ""
		}

		// Create a new CreateLoanType object
		loanType := models.GetLoanTypeData{
			RecordId:    RecordId,
			ProductCode: productCode,
			Active:      active,
			Adder:       adder,
			Description: description,
		}
		loansList.LoanTypeList = append(loansList.LoanTypeList, loanType)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of loan List fetched : %v list %+v", len(loansList.LoanTypeList), loansList)
	FormAndSendHttpResp(resp, "Loan Data", http.StatusOK, loansList)
}

/******************************************************************************
 * FUNCTION:		PrepareLoanTypesFilters
 * DESCRIPTION:     handler for create select query
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareLoanTypesFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareLoanTypesFilters")
	defer func() { log.ExitFn(0, "PrepareLoanTypesFilters", nil) }()

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
		filtersBuilder.WriteString("lt.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("lt.is_archived = FALSE")
	}

	// Add pagination
	if (dataFilter.PageSize > 0) && (dataFilter.PageNumber > 0) {
		filtersBuilder.WriteString(fmt.Sprintf(" LIMIT %d OFFSET %d", dataFilter.PageSize, (dataFilter.PageNumber-1)*dataFilter.PageSize))
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filtersBuilder.String())
	return filters, whereEleList
}
