/**************************************************************************
 * File       	   : apiGetDLROTHData.go
 * DESCRIPTION     : This file contains functions for get Dealers data handler
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
 * FUNCTION:		HandleGetDLROTHDataRequest
 * DESCRIPTION:     handler for get Dealer data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDLROTHDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetDLROTHDataRequest")
	defer func() { log.ExitFn(0, "HandleGetDLROTHDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Dealers Tier data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Dealers Tier data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Dealers Tier data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Dealers Tier data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_dealer_tier
	query = ` 
	 SELECT dh.id as record_id, dh.unique_id, dh.payee, dh.amount, dh.description, dh.balance, dh.paid_amount, dh.is_archived, dh.start_date, dh.end_date
	 FROM dlr_oth dh`

	filter, whereEleList = PrepareDLROTHFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Dealers Tier data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Dealers Tier data from DB", http.StatusBadRequest, nil)
		return
	}

	DLROTHList := models.GetDLR_OTHList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// unique_id
		Unique_id, unique_idOk := item["unique_id"].(string)
		if !unique_idOk || Unique_id == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// payee
		Payee, payeeOk := item["payee"].(string)
		if !payeeOk || Payee == "" {
			log.FuncErrorTrace(0, "Failed to get payee for Record ID %v. Item: %+v\n", RecordId, item)
			Payee = ""
		}

		// amount
		Amount, amountOk := item["amount"].(string)
		if !amountOk || Amount == "" {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = ""
		}

		// description
		Description, descriptionOk := item["description"].(string)
		if !descriptionOk || Description == "" {
			log.FuncErrorTrace(0, "Failed to get description for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		// balance
		Balance, balanceOk := item["balance"].(float64)
		if !balanceOk {
			log.FuncErrorTrace(0, "Failed to get balance for Record ID %v. Item: %+v\n", RecordId, item)
			Balance = 0.0
		}

		// paid_amount
		Paid_amount, paid_amountOk := item["paid_amount"].(float64)
		if !paid_amountOk {
			log.FuncErrorTrace(0, "Failed to get paid_amount for Record ID %v. Item: %+v\n", RecordId, item)
			Paid_amount = 0.0
		}

		// StartDate
		StartDate, startOk := item["start_date"].(string)
		if !startOk || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, endOk := item["end_date"].(string)
		if !endOk || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		// is_archived
		IsArchived, ok := item["is_archived"].(bool)
		if !ok || !IsArchived {
			log.FuncErrorTrace(0, "Failed to get is_archived value for Record ID %v. Item: %+v\n", RecordId, item)
			IsArchived = false
		}

		// Create a new GetDLROTHData object
		dlr_Oth_Data := models.GetDLR_OTHData{
			RecordId:    RecordId,
			Unique_Id:   Unique_id,
			Payee:       Payee,
			Amount:      Amount,
			Description: Description,
			Balance:     Balance,
			Paid_Amount: Paid_amount,
			StartDate:   StartDate,
			EndDate:     EndDate,
		}

		// Append the new DLROTHData to the DLROTHList
		DLROTHList.DLR_OTHList = append(DLROTHList.DLR_OTHList, dlr_Oth_Data)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of dlr_oth List fetched : %v list %+v", len(DLROTHList.DLR_OTHList), DLROTHList)
	FormAndSendHttpResp(resp, "dlr oth Data", http.StatusOK, DLROTHList)
}

/******************************************************************************
 * FUNCTION:		PrepareDLROTHFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDLROTHFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDLROTHFilters")
	defer func() { log.ExitFn(0, "PrepareDLROTHFilters", nil) }()

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
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "payee":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.payee) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.amount) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.description) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "balance":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.balance) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "paid_amount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.paid_amount) %s LOWER($%d)", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("dh.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("dh.is_archived = FALSE")
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
