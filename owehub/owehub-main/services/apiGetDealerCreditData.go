/**************************************************************************
 * File       	   : apiGetDealerCreditData.go
 * DESCRIPTION     : This file contains functions to get DealerCredit data handler
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
 * FUNCTION:		HandleGetDealerCreditDataRequest
 * DESCRIPTION:     handler for get DealerCredit data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDealerCreditDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetDealerCreditDataRequest")
	defer func() { log.ExitFn(0, "HandleGetDealerCreditDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dealer credit data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer credit data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealer credit data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer credit data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_dealer_credit
	query = `SELECT dc.id AS record_id, dc.unique_id, dc.date,
    dc.exact_amount, dc.per_kw_amount , dc.approved_by, dc.notes, dc.total_amount,
    dc.sys_size
	FROM dealer_credit dc`

	filter, whereEleList = PrepareDealerCreditFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer credit data from DB", http.StatusBadRequest, nil)
		return
	}

	DealerCreditDataList := models.GetDealerCreditList{}

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

		// exact_amount
		ExactAmount, ok := item["exact_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get exact amount for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = 0.0
		}

		// per_kw_amount
		PerKWAmount, ok := item["per_kw_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_kw_amount for Record ID %v. Item: %+v\n", RecordId, item)
			PerKWAmount = 0.0
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

		// total_amount
		TotalAmount, ok := item["total_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get total amount for Record ID %v. Item: %+v\n", RecordId, item)
			TotalAmount = 0.0
		}

		// sys_size
		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		// start_date
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		dateString := Date.Format("2006-01-02")
		DealerCreditData := models.GetDealerCredit{
			RecordId:    RecordId,
			UniqueID:    UniqueID,
			ExactAmount: ExactAmount,
			PerKWAmount: PerKWAmount,
			ApprovedBy:  ApprovedBy,
			Notes:       Notes,
			TotalAmount: TotalAmount,
			SysSize:     SysSize,
			Date:        dateString,
		}
		DealerCreditDataList.DealerCreditList = append(DealerCreditDataList.DealerCreditList, DealerCreditData)
	}

	filter, whereEleList = PrepareDealerCreditFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dealer credit data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of dealer credit List fetched : %v list %+v", len(DealerCreditDataList.DealerCreditList), DealerCreditDataList)
	appserver.FormAndSendHttpResp(resp, "Dealer Credit Data", http.StatusOK, DealerCreditDataList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareDealerCreditFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDealerCreditFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDealerCreditFilters")
	defer func() { log.ExitFn(0, "PrepareDealerCreditFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "exact_amount":
				filtersBuilder.WriteString(fmt.Sprintf("dc.exact_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_kw_amount":
				filtersBuilder.WriteString(fmt.Sprintf("dc.per_kw_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "approved_by":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.approved_by) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(dc.notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "total_amount":
				filtersBuilder.WriteString(fmt.Sprintf("dc.total_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("dc.sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("dc.date %s $%d", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("dc.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("dc.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY dc.id, dc.unique_id, dc.date, dc.exact_amount, dc.per_kw_amount, dc.approved_by, dc.notes, dc.total_amount, dc.sys_size")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY dc.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}
	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
