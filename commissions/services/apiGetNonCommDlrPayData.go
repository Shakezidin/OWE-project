/**************************************************************************
 * File       	   : apiGetNonCommDlrPayData.go
 * DESCRIPTION     : This file contains functions to get NonComm Dlr Pay data handler
 * DATE            : 25-Apr-2024
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
 * FUNCTION:		HandleGetNonCommDlrPayDataRequest
 * DESCRIPTION:     handler for get Non Comm Dealer Pay data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetNonCommDlrPayDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetNonCommDlrPayDataRequest")
	defer func() { log.ExitFn(0, "HandleGetNonCommDlrPayDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Non Comm Dealer Pay data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Non Comm Dealer Pay data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Non Comm Dealer Pay data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Non Comm Dealer Pay data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_noncomm_dlr_pay
	query = `
			SELECT ndp.id AS record_id, ndp.unique_id, ndp.customer, ndp.start_date,
    		ndp.end_date, ndp.dealer_dba, ud.name as dealer_name, ndp.exact_amount,
    		ndp.approved_by, ndp.notes, ndp.balance, ndp.paid_amount, ndp.dba
			FROM noncomm_dlrpay ndp
			JOIN user_details ud ON ndp.dealer_id = ud.user_id;`

	filter, whereEleList = PrepareNonCommDlrPayFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Non Comm Dealer Pay data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Non Comm Dealer Pay data from DB", http.StatusBadRequest, nil)
		return
	}

	NonCommDlrPayDataList := models.GetNonCommDlrPayList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// unique_id
		UniqueID, ok := item["unique_id"].(string)
		if !ok || UniqueID == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueID = ""
		}

		// customer
		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			log.FuncErrorTrace(0, "Failed to get customer for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}

		// dealer_name
		DealerName, nameOk := item["dealer_name"].(string)
		if !nameOk || DealerName == "" {
			log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			DealerName = ""
		}

		// dealer_dba
		DealerDBA, ok := item["dealer_dba"].(string)
		if !ok || DealerDBA == "" {
			log.FuncErrorTrace(0, "Failed to get dealer_dba for Record ID %v. Item: %+v\n", RecordId, item)
			DealerDBA = ""
		}

		// exact_amount
		ExactAmount, ok := item["exact_amount"].(string)
		if !ok || ExactAmount == "" {
			log.FuncErrorTrace(0, "Failed to get exact_amount for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = ""
		}

		// approved_by
		ApprovedBy, ok := item["approved_by"].(string)
		if !ok || ApprovedBy == "" {
			log.FuncErrorTrace(0, "Failed to get approved_by for Record ID %v. Item: %+v\n", RecordId, item)
			ApprovedBy = ""
		}

		// notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		// balance
		Balance, ok := item["balance"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get balance for Record ID %v. Item: %+v\n", RecordId, item)
			Balance = 0.0
		}

		// paid_amount
		PaidAmount, ok := item["paid_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get paid_amount for Record ID %v. Item: %+v\n", RecordId, item)
			PaidAmount = 0.0
		}

		// dba
		DBA, ok := item["dba"].(string)
		if !ok || DBA == "" {
			log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", RecordId, item)
			DBA = ""
		}

		// start_date
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start_date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// end_date
		EndDate, ok := item["end_date"].(*string)
		if !ok || EndDate == nil {
			log.FuncErrorTrace(0, "Failed to get end_date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = nil
		}

		NonCommDlrPayData := models.GetNonCommDlrPay{
			RecordId:    RecordId,
			UniqueID:    UniqueID,
			Customer:    Customer,
			DealerName:  DealerName,
			DealerDBA:   DealerDBA,
			ExactAmount: ExactAmount,
			ApprovedBy:  ApprovedBy,
			Notes:       Notes,
			Balance:     Balance,
			PaidAmount:  PaidAmount,
			DBA:         DBA,
			StartDate:   StartDate,
			EndDate:     EndDate,
		}
		NonCommDlrPayDataList.NonCommDlrPayList = append(NonCommDlrPayDataList.NonCommDlrPayList, NonCommDlrPayData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of Non Comm Dealer Pay List fetched : %v list %+v", len(NonCommDlrPayDataList.NonCommDlrPayList), NonCommDlrPayDataList)
	FormAndSendHttpResp(resp, "Non Comm Dealer Pay Data", http.StatusOK, NonCommDlrPayDataList)
}

/******************************************************************************
 * FUNCTION:		PrepareNonCommDlrPayFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareNonCommDlrPayFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareNonCommDlrPayFilters")
	defer func() { log.ExitFn(0, "PrepareNonCommDlrPayFilters", nil) }()

	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_dba":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.dealer_dba) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "exact_amtount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.exact_amtount) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "approved_by":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.approved_by) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "balance":
				filtersBuilder.WriteString(fmt.Sprintf("dc.balance %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "paid_amount":
				filtersBuilder.WriteString(fmt.Sprintf("dc.paid_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dba":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.dba) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.start_date) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.end_date) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}

		}
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
