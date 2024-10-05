/**************************************************************************
 * File       	   : apiGetDlrOthData.go
 * DESCRIPTION     : This file contains functions for get dlr_oth data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"
	"time"

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

	log.EnterFn(0, "HandleGetDLROTHDataRequest")
	defer func() { log.ExitFn(0, "HandleGetDLROTHDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dlr_oth  data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dlr_oth  data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dlr_oth  data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dlr_oth  data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_Dlr_Oth
	query = ` 
	 SELECT dh.id as record_id, dh.unique_id, dh.payee, dh.amount, dh.description, dh.balance, dh.paid_amount, dh.is_archived, dh.date
	 FROM dlr_oth dh`

	filter, whereEleList = PrepareDLROTHFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dlr_oth data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dlr_oth data from DB", http.StatusBadRequest, nil)
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
		Amount, amountOk := item["amount"].(float64)
		if !amountOk || Amount == 0.0 {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0
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
			log.FuncErrorTrace(0, "Failed to get paid amount for Record ID %v. Item: %+v\n", RecordId, item)
			Paid_amount = 0.0
		}

		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}
		date := Date.Format("2006-01-02")

		// Create a new GetDLROTHData object
		dlr_Oth_Data := models.GetDLR_OTHData{
			RecordId:    RecordId,
			Unique_Id:   Unique_id,
			Payee:       Payee,
			Amount:      Amount,
			Description: Description,
			Balance:     Balance,
			Paid_Amount: Paid_amount,
			Date:        date,
		}

		// Append the new DLROTHData to the DLROTHList
		DLROTHList.DLR_OTHList = append(DLROTHList.DLR_OTHList, dlr_Oth_Data)
	}

	filter, whereEleList = PrepareDLROTHFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dlr_oth data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dlr_oth data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of dlr_oth List fetched : %v list %+v", len(DLROTHList.DLR_OTHList), DLROTHList)
	appserver.FormAndSendHttpResp(resp, "Dlr Oth Data", http.StatusOK, DLROTHList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareDLROTHFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDLROTHFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
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
				filtersBuilder.WriteString(fmt.Sprintf("dh.amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.description) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "balance":
				filtersBuilder.WriteString(fmt.Sprintf("dh.balance %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "paid_amount":
				filtersBuilder.WriteString(fmt.Sprintf("dh.paid_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("dh.date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dh.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY dh.id, dh.unique_id, dh.payee, dh.amount, dh.description, dh.balance, dh.paid_amount, dh.date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY dh.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
