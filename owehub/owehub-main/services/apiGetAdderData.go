/**************************************************************************
 * File       	   : apiGetAdderData.go
 * DESCRIPTION     : This file contains functions for get Adder data handler
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
* FUNCTION:		HandleGetAdderDataRequest
* DESCRIPTION:     handler for get Adder data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Adder data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get Adder data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_adder_data
	query = `
		SELECT ad.id AS record_id, ad.unique_id, ad.date, ad.type_ad_mktg, ad.type1, ad.gc, ad.exact_amount, ad.per_kw_amt, ad.rep_percent, ad.description, ad.notes, ad.sys_size, ad.adder_cal
		FROM adder_data ad`

	filter, whereEleList = PrepareAdderDataFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Adder data from DB", http.StatusBadRequest, nil)
		return
	}

	AdderList := models.GetAdderDataList{}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Unique_id
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		// Customer
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		// Date
		TypeAdMktg, ok := item["type_ad_mktg"].(string)
		if !ok || TypeAdMktg == "" {
			log.FuncErrorTrace(0, "Failed to get TypeAdMktg for Record ID %v. Item: %+v\n", RecordId, item)
			TypeAdMktg = ""
		}

		// Amount
		Type, ok := item["type1"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get Type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// Notes
		Gc, ok := item["gc"].(string)
		if !ok || Gc == "" {
			log.FuncErrorTrace(0, "Failed to get Gc for Record ID %v. Item: %+v\n", RecordId, item)
			Gc = ""
		}

		ExactAmount, ok := item["exact_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get ExactAmount for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = 0.0
		}

		Description, ok := item["description"].(string)
		if !ok || Description == "" {
			log.FuncErrorTrace(0, "Failed to get description for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		PerKwAmt, ok := item["per_kw_amt"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PerKwAmt for Record ID %v. Item: %+v\n", RecordId, item)
			PerKwAmt = 0.0
		}

		RepPercent, ok := item["rep_percent"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get RepPercent for Record ID %v. Item: %+v\n", RecordId, item)
			RepPercent = 0.0
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get SysSize for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		AdderCal, ok := item["adder_cal"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get RepPercent for Record ID %v. Item: %+v\n", RecordId, item)
			AdderCal = 0.0
		}

		dateString := Date.Format("2006-01-02")
		AdderData := models.GetAdderData{
			RecordId:    RecordId,
			UniqueId:    UniqueId,
			Date:        dateString,
			TypeAdMktg:  TypeAdMktg,
			Type:        Type,
			Gc:          Gc,
			ExactAmount: ExactAmount,
			Description: Description,
			Notes:       Notes,
			PerKwAmt:    PerKwAmt,
			RepPercent:  RepPercent,
			SysSize:     SysSize,
			AdderCal:    AdderCal,
		}

		AdderList.AdderDataList = append(AdderList.AdderDataList, AdderData)
	}

	filter, whereEleList = PrepareAdderDataFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ar_import data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ar_import data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of Adder List fetched : %v list %+v", len(AdderList.AdderDataList), AdderList)
	appserver.FormAndSendHttpResp(resp, "Adder Data", http.StatusOK, AdderList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareAdderFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareAdderDataFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdderFilters")
	defer func() { log.ExitFn(0, "PrepareAdderFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("ad.date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type_ad_mktg":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.type_ad_mktg) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type1":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.type1) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "gc":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.gc) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "exact_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.exact_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_kw_amt":
				filtersBuilder.WriteString(fmt.Sprintf("ad.per_kw_amt %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_percent":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_percent %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.description) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("ad.sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "adder_cal":
				filtersBuilder.WriteString(fmt.Sprintf("ad.adder_cal %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ad.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ad.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ad.id, ad.unique_id, ad.date, ad.type_ad_mktg, ad.type1, ad.gc, ad.exact_amount, ad.per_kw_amt, ad.rep_percent, ad.description, ad.notes, ad.sys_size, ad.adder_cal")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ad.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
