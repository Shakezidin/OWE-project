/**************************************************************************
 * File       	   : apiGetApRepData.go
 * DESCRIPTION     : This file contains functions for get ap rep data handler
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
 * FUNCTION:		HandleGetApRepDataRequest
 * DESCRIPTION:     handler for get commissions data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetApRepDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetApRepDataRequest")
	defer func() { log.ExitFn(0, "HandleGetApRepDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ap rep data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ap rep data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ap rep data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get ap rep data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_ap_rep
	query = `
	 SELECT ar.id as record_id, ar.unique_id, ar.rep, ar.dba, ar.type, ar.date, ar.amount, ar.method, ar.cbiz, ar.transaction, ar.notes
	 FROM ap_rep ar`

	filter, whereEleList = PrepareApRepFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ap rep data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ap rep data from DB", http.StatusBadRequest, nil)
		return
	}

	apRepList := models.GetApRepDataList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// UniqueId
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		// Rep
		Rep, ok := item["rep"].(string)
		if !ok || Rep == "" {
			log.FuncErrorTrace(0, "Failed to get rep for Record ID %v. Item: %+v\n", RecordId, item)
			Rep = ""
		}

		// Dba
		Dba, ok := item["dba"].(string)
		if !ok || Dba == "" {
			log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", RecordId, item)
			Dba = ""
		}

		//Type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// Date
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{} // Default sale price of 0.0
		}

		// Amount
		Amount, ok := item["amount"].(float64)
		if !ok || Amount == 0.0 {
			log.FuncErrorTrace(0, "Failed to get Amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0
		}

		// Method
		Method, ok := item["method"].(string)
		if !ok || Method == "" {
			log.FuncErrorTrace(0, "Failed to get method for Record ID %v. Item: %+v\n", RecordId, item)
			Method = ""
		}

		// Cbiz
		Cbiz, ok := item["cbiz"].(string)
		if !ok || Cbiz == "" {
			log.FuncErrorTrace(0, "Failed to get Cbiz for Record ID %v. Item: %+v\n", RecordId, item)
			Cbiz = ""
		}

		// Transaction
		Transaction, ok := item["transaction"].(string)
		if !ok || Transaction == "" {
			log.FuncErrorTrace(0, "Failed to get Transaction for Record ID %v. Item: %+v\n", RecordId, item)
			Transaction = ""
		}

		// Notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		apRepData := models.GetApRep{
			RecordId:    RecordId,
			UniqueId:    UniqueId,
			Rep:         Rep,
			Dba:         Dba,
			Type:        Type,
			Date:        Date.Format("02-01-2006"),
			Amount:      Amount,
			Method:      Method,
			Cbiz:        Cbiz,
			Transaction: Transaction,
			Notes:       Notes,
		}
		apRepList.ApRepList = append(apRepList.ApRepList, apRepData)
	}

	filter, whereEleList = PrepareApRepFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ap rep data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ap rep data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of ap rep List fetched : %v list %+v", len(apRepList.ApRepList), apRepList)
	appserver.FormAndSendHttpResp(resp, "ap rep Data", http.StatusOK, apRepList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareCommissionFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareApRepFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareCommissionFilters")
	defer func() { log.ExitFn(0, "PrepareCommissionFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.rep) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dba":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.dba) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("ar.date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("ar.amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "method":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.method) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "cbiz":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.cbiz) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString(" GROUP BY ar.id, ar.unique_id, ar.rep, ar.dba, ar.type, ar.date, ar.amount, ar.method, ar.cbiz, ar.transaction, ar.notes")
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
