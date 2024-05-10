/**************************************************************************
 * File       	   : apiGetAutoAdderData.go
 * DESCRIPTION     : This file contains functions for get AutoAdder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
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
 * FUNCTION:		HandleGetAutoAdderDataRequest
 * DESCRIPTION:     handler for get AutoAdder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAutoAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetAutoAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetAutoAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get auto adder data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get auto adder data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get auto adder data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get auto adder data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_auto_adder
	query = `
		 SELECT ad.id as record_id, ad.unique_id, ad.date, ad.type, ad.gc, ad.exact_amount, ad.per_kw_amount, ad.rep_percentage, ad.description_repvisible,
		 ad.notes_no_repvisible, ad.adder_type FROM auto_adder ad`

	filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get auto adder data from DB", http.StatusBadRequest, nil)
		return
	}

	AutoAdderList := models.GetAutoAdderList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// unique_id
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// Date
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		Gc, ok := item["gc"].(string)
		if !ok || Gc == "" {
			log.FuncErrorTrace(0, "Failed to get gc for Record ID %v. Item: %+v\n", RecordId, item)
			Gc = ""
		}

		// exact_amount
		Exact_amount, ok := item["exact_amount"].(float64)
		if !ok || Exact_amount == 0.0 {
			log.FuncErrorTrace(0, "Failed to get exact amount for Record ID %v. Item: %+v\n", RecordId, item)
			Exact_amount = 0.0
		}

		// per_kw_amount
		Per_kw_amount, ok := item["per_kw_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_kw_amount for Record ID %v. Item: %+v\n", RecordId, item)
			Per_kw_amount = 0.0
		}

		// rep_doll_divby_per
		RepPercentage, ok := item["rep_percentage"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			RepPercentage = 0.0
		}

		// description_rep_visible
		Description_rep_visible, ok := item["description_repvisible"].(string)
		if !ok || Description_rep_visible == "" {
			log.FuncErrorTrace(0, "Failed to get description rep visible value for Record ID %v. Item: %+v\n", RecordId, item)
			Description_rep_visible = ""
		}

		// notes_not_rep_visible
		NotesNoRepVisible, ok := item["notes_no_repvisible"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get notes_no_repvisible for Record ID %v. Item: %+v\n", RecordId, item)
			NotesNoRepVisible = ""
		}

		// AdderType
		AdderType, ok := item["adder_type"].(string)
		if !ok || AdderType == "" {
			log.FuncErrorTrace(0, "Failed to get adder type for Record ID %v. Item: %+v\n", RecordId, item)
			AdderType = ""
		}

		DateStr := Date.Format("2006-01-02")

		AutoAdderData := models.GetAutoAdderData{
			RecordId:              RecordId,
			UniqueID:              Unique_id,
			Date:                  DateStr,
			Type:                  Type,
			GC:                    Gc,
			ExactAmount:           Exact_amount,
			PerKWAmount:           Per_kw_amount,
			RepPercentage:         RepPercentage,
			DescriptionRepVisible: Description_rep_visible,
			NotesNoRepVisible:     NotesNoRepVisible,
			AdderType:             AdderType,
		}

		AutoAdderList.AutoAdderList = append(AutoAdderList.AutoAdderList, AutoAdderData)
	}

	filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get auto adder data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of auto adder List fetched : %v list %+v", len(AutoAdderList.AutoAdderList), AutoAdderList)
	FormAndSendHttpResp(resp, "Auto Adder Data", http.StatusOK, AutoAdderList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAutoAdderFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareAutoAdderFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAutoAdderFilters")
	defer func() { log.ExitFn(0, "PrepareAutoAdderFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("ad.date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("ad.type %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "gc":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.gc) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "exact_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.exact_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_kw_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.per_kw_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_percentage":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_percentage %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description_repvisible":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.description_repvisible) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes_no_repvisible":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.notes_no_repvisible) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "adder_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.adder_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	//Handle the Archived field
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
		filtersBuilder.WriteString(" GROUP BY ad.id, ad.unique_id, ad.date, ad.type, ad.gc, ad.exact_amount, ad.per_kw_amount, ad.rep_percentage, ad.description_repvisible, ad.notes_no_repvisible, ad.adder_type")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
