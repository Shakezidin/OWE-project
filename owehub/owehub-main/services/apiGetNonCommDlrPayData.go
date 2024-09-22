/**************************************************************************
 * File       	   : apiGetNonCommDlrPayData.go
 * DESCRIPTION     : This file contains functions to get NonComm Dlr Pay data handler
 * DATE            : 25-Apr-2024
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
 * FUNCTION:		HandleGetNonCommDlrPayDataRequest
 * DESCRIPTION:     handler for get Non Comm Dealer Pay data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetNonCommDlrPayDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetNonCommDlrPayDataRequest")
	defer func() { log.ExitFn(0, "HandleGetNonCommDlrPayDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get non comm dealer pay data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get non comm dealer pay data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get non comm dealer pay data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get non comm dealer pay data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_noncomm_dlr_pay
	query = `
			SELECT ndp.id AS record_id, ndp.unique_id, ndp.customer, ndp.date,
    		ndp.dealer_dba, vd.dealer_name, ndp.exact_amount,
    		ndp.approved_by, ndp.notes, ndp.balance, ndp.paid_amount, ndp.dba
			FROM noncomm_dlrpay ndp
			LEFT JOIN v_dealer vd ON ndp.dealer_id = vd.id`

	filter, whereEleList = PrepareNonCommDlrPayFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get non comm dealer pay data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get non comm dealer pay data from DB", http.StatusBadRequest, nil)
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
			log.FuncErrorTrace(0, "Failed to get dealer dba for Record ID %v. Item: %+v\n", RecordId, item)
			DealerDBA = ""
		}

		// exact_amount
		ExactAmount, ok := item["exact_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get exact amount for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = 0.0
		}

		// approved_by
		ApprovedBy, ok := item["approved_by"].(string)
		if !ok || ApprovedBy == "" {
			log.FuncErrorTrace(0, "Failed to get approved by for Record ID %v. Item: %+v\n", RecordId, item)
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
			log.FuncErrorTrace(0, "Failed to get paid amount for Record ID %v. Item: %+v\n", RecordId, item)
			PaidAmount = 0.0
		}

		// dba
		DBA, ok := item["dba"].(string)
		if !ok || DBA == "" {
			log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", RecordId, item)
			DBA = ""
		}

		// start_date
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}
		date := Date.Format("2006-01-02")

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
			Date:        date,
		}
		NonCommDlrPayDataList.NonCommDlrPayList = append(NonCommDlrPayDataList.NonCommDlrPayList, NonCommDlrPayData)
	}

	filter, whereEleList = PrepareNonCommDlrPayFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get non comm dealer pay data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get non comm dealer pay data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of non comm dealer pay List fetched : %v list %+v", len(NonCommDlrPayDataList.NonCommDlrPayList), NonCommDlrPayDataList)
	appserver.FormAndSendHttpResp(resp, "Non Comm Dealer Pay Data", http.StatusOK, NonCommDlrPayDataList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareNonCommDlrPayFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareNonCommDlrPayFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareNonCommDlrPayFilters")
	defer func() { log.ExitFn(0, "PrepareNonCommDlrPayFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ndp.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ndp.customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_dba":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ndp.dealer_dba) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "exact_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ndp.exact_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "approved_by":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ndp.approved_by) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ndp.notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "balance":
				filtersBuilder.WriteString(fmt.Sprintf("ndp.balance %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "paid_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ndp.paid_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dba":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ndp.dba) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("ndp.date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ndp.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ndp.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ndp.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ndp.id, ndp.unique_id, ndp.customer, ndp.date, ndp.dealer_dba, vd.dealer_name, ndp.exact_amount, ndp.approved_by, ndp.notes, ndp.balance, ndp.paid_amount, ndp.dba")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ndp.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
