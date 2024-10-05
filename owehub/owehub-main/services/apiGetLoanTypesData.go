/**************************************************************************
 * File       	   : apiGetLoanTypesData.go
 * DESCRIPTION     : This file contains functions for get loan type data handler
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
 * FUNCTION:		HandleGetLoanTypesDataRequest
 * DESCRIPTION:     handler for get loan data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLoanTypesDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetLoanTypesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLoanTypesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get loan type data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get loan type data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get loan type data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get loan type data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_loan_type
	query = `
	SELECT lt.id as record_id, lt.product_code, lt.active, lt.adder, lt.description FROM loan_type lt`

	filter, whereEleList = PrepareLoanTypesFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan type data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get loan type data from DB", http.StatusBadRequest, nil)
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
			log.FuncErrorTrace(0, "Failed to get product for Record ID %v. Item: %+v\n", RecordId, item)
			productCode = ""
		}

		activeVal, ok := item["active"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get active for Record ID %v. Item: %+v\n", RecordId, item)
			activeVal = 0 // Assigning 0 as default for activeVal
		}
		active := int(activeVal)

		adderVal, ok := item["adder"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get adder for Record ID %v. Item: %+v\n", RecordId, item)
			adderVal = 0 // Assigning 0 as default for adderVal
		}
		adder := int(adderVal)

		description, descOk := item["description"].(string)
		if !descOk || description == "" {
			log.FuncErrorTrace(0, "Failed to get description for Record ID %v. Item: %+v\n", RecordId, item)
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

	filter, whereEleList = PrepareLoanTypesFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan type data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get loan type data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of loan type list fetched : %v list %+v", len(loansList.LoanTypeList), loansList)
	appserver.FormAndSendHttpResp(resp, "Loan Type Data", http.StatusOK, loansList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareLoanTypesFilters
 * DESCRIPTION:     handler for create select query
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareLoanTypesFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
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
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			switch column {
			case "record_id":
				filtersBuilder.WriteString(fmt.Sprintf("lt.record_id %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "product_code":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lt.product_code) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "active":
				filtersBuilder.WriteString(fmt.Sprintf("lt.active %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "adder":
				filtersBuilder.WriteString(fmt.Sprintf("lt.adder %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lt.description) %s LOWER($%d)", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("lt.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("lt.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY lt.id, lt.product_code, lt.active, lt.adder, lt.description")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY lt.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filtersBuilder.String())
	return filters, whereEleList
}
