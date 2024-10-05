/**************************************************************************
 * File       	   : apiGetAR.go
 * DESCRIPTION     : This file contains functions for get AR data handler
 * DATE            : 01-May-2024
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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get AR data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get AR data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get AR data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_Ar
	query = `
	  SELECT ar.id as record_id, ar.unique_id, ar.customer, ar.date, ar.amount, ar.payment_type, ar.bank, ar.ced, ar.total_paid, pr.partner_name AS partner_name, st.name AS state_name
	  FROM ar
	  LEFT JOIN partners pr ON pr.partner_id = ar.partner
	  LEFT JOIN states st ON st.state_id = ar.state`

	filter, whereEleList = PrepareARFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get AR data from DB", http.StatusBadRequest, nil)
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
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		// Amount
		Amount, ok := item["amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0
		}

		TotalPaid, ok := item["total_paid"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get TotalPaid for Record ID %v. Item: %+v\n", RecordId, item)
			TotalPaid = 0.0
		}

		PaymentType, ok := item["payment_type"].(string)
		if !ok || PaymentType == "" {
			log.FuncErrorTrace(0, "Failed to get PaymentType for Record ID %v. Item: %+v\n", RecordId, item)
			PaymentType = ""
		}

		Bank, ok := item["bank"].(string)
		if !ok || Bank == "" {
			log.FuncErrorTrace(0, "Failed to get Bank for Record ID %v. Item: %+v\n", RecordId, item)
			Bank = ""
		}

		Ced, ok := item["ced"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Ced for Record ID %v. Item: %+v\n", RecordId, item)
			Ced = time.Time{}
		}

		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// SaleTypeName
		StateName, ok := item["state_name"].(string)
		if !ok || StateName == "" {
			log.FuncErrorTrace(0, "Failed to get sale type for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		dateString := Date.Format("2006-01-02")
		cedDateString := Ced.Format("2006-01-02")
		aRData := models.GetARReq{
			RecordId:     RecordId,
			UniqueId:     Unique_id,
			CustomerName: Customer,
			Date:         dateString,
			Amount:       Amount,
			PaymentType:  PaymentType,
			Bank:         Bank,
			Ced:          cedDateString,
			TotalPaid:    TotalPaid,
			StateName:    StateName,
			PartnerName:  PartnerName,
		}

		ARList.ARList = append(ARList.ARList, aRData)
	}

	filter, whereEleList = PrepareARFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get AR data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of AR List fetched : %v list %+v", len(ARList.ARList), ARList)
	appserver.FormAndSendHttpResp(resp, "AR Data", http.StatusOK, ARList, RecordCount)
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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("ar.date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("ar.amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "total_paid":
				filtersBuilder.WriteString(fmt.Sprintf("ar.total_paid %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "payment_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.payment_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "bank":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.bank) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "ced":
				filtersBuilder.WriteString(fmt.Sprintf("ar.ced %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "partner_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pr.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				// For other columns, handle them accordingly
				filtersBuilder.WriteString("LOWER(ar.")
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
		filtersBuilder.WriteString("ar.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ar.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ar.id, ar.unique_id, ar.customer, ar.date, ar.amount, ar.payment_type, ar.bank, ar.ced, ar.total_paid, pr.partner_name, st.name")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ar.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
