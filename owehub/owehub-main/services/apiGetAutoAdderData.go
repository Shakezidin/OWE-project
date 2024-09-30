/**************************************************************************
 * File       	   : apiGetAutoAdderData.go
 * DESCRIPTION     : This file contains functions for get AutoAdder data handler
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
 * FUNCTION:		HandleGetAutoAdderDataRequest
 * DESCRIPTION:     handler for get AutoAdder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAutoAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		dataReq               models.DataRequestBody
		data                  []map[string]interface{}
		whereEleList          []interface{}
		query                 string
		queryWithFiler        string
		queryForAlldata       string
		filter                string
		RecordCount           int64
		DescriptionRepVisible string
		ExactAmount           float64
		AdderType             string
		PerKWAmount           float64
	)

	log.EnterFn(0, "HandleGetAutoAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetAutoAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get auto adder data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get auto adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get auto adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get auto adder data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_auto_adder
	query = `
			SELECT 
			ad.unique_id, 
			ad.wc_1 AS date, 
			ad.installer AS gc, 
			ad.net_epc as rep_percentage,
			ad.primary_sales_rep as notes_no_repvisible,
			(SELECT 
				CASE 
					WHEN system_size <= 3 THEN 
						CASE 
							WHEN state ILIKE 'CA' THEN 'SM-CA2' 
							ELSE 'SM-UNI2' 
						END
					WHEN system_size > 3 AND system_size <= 4 THEN
						CASE
							WHEN state NOT ILIKE 'CA' THEN 'SM-UNI3' 
							ELSE NULL
						END
					ELSE NULL 
				END 
			FROM consolidated_data_view cdv 
			WHERE cdv.unique_id = ad.unique_id) AS type
		FROM consolidated_data_view ad`

	// for _, filtr := range dataReq.Filters {
	// 	if filtr.Column == "per_kw_amount" {
	// 		filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, false)
	// 		if filter != "" {
	// 			queryWithFiler = query + filter
	// 		}
	// 	}
	// }

	filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get auto adder data from DB", http.StatusBadRequest, nil)
		return
	}

	AutoAdderList := models.GetAutoAdderList{}
	for _, item := range data {
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", Unique_id, item)
			Unique_id = ""
		}

		// Date
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", Unique_id, item)
			Date = time.Time{}
		}

		Gc, ok := item["gc"].(string)
		if !ok || Gc == "" {
			log.FuncErrorTrace(0, "Failed to get gc for Record ID %v. Item: %+v\n", Unique_id, item)
			Gc = ""
		}

		RepPercentage, ok := item["rep_percentage"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", Unique_id, item)
			RepPercentage = 0.0
		}

		// notes_not_rep_visible
		NotesNoRepVisible, ok := item["notes_no_repvisible"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get notes_no_repvisible for Record ID %v. Item: %+v\n", Unique_id, item)
			NotesNoRepVisible = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", Unique_id, item)
			Type = ""
		}

		if strings.HasPrefix(Type, "MK") {
			ExactAmount = 0.0
		} else {
			switch Type {
			case "SM-UNI2":
				ExactAmount = 1200
			case "SM-UNI3":
				ExactAmount = 600
			case "SM-CA2":
				ExactAmount = 600
			}
		}

		if strings.HasPrefix(Type, "MK") {
			qry := `select fee_rate from marketing fee where state ilike 'MK'`
			data3, err := db.ReteriveFromDB(db.OweHubDbIndex, qry, whereEleList)
			if err != nil || len(data3) <= 0 {
				log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
				appserver.FormAndSendHttpResp(resp, "Failed to get auto adder data from DB", http.StatusBadRequest, nil)
				return
			}
			PerKWAmount, ok = data3[0]["fee_rate"].(float64)
			if !ok || Unique_id == "" {
				log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", Unique_id, item)
				Unique_id = ""
			}
		} else {
			switch Type {
			case "SM-UNI2":
				PerKWAmount = 0.0
			case "SM-UNI3":
				PerKWAmount = 0.0
			case "SM-CA2":
				PerKWAmount = 0.0
			}
		}

		if strings.HasPrefix(Type, "MK") {
			DescriptionRepVisible = fmt.Sprintf("Marketing Fee %s", Type[11:18])
		} else {
			switch Type {
			case "SM-UNI2":
				DescriptionRepVisible = "Small System Size"
			case "SM-UNI3":
				DescriptionRepVisible = "Small System Size"
			case "SM-CA2":
				DescriptionRepVisible = "Small System Size"
			}
		}

		AdderType = "Adder"

		DateStr := Date.Format("2006-01-02")

		AutoAdderData := models.GetAutoAdderData{
			UniqueID:              Unique_id,
			Date:                  DateStr,
			Type:                  Type,
			GC:                    Gc,
			ExactAmount:           ExactAmount,
			PerKWAmount:           PerKWAmount,
			RepPercentage:         RepPercentage,
			DescriptionRepVisible: DescriptionRepVisible,
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
		appserver.FormAndSendHttpResp(resp, "Failed to get auto adder data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of auto adder List fetched : %v list %+v", len(AutoAdderList.AutoAdderList), AutoAdderList)
	appserver.FormAndSendHttpResp(resp, "Auto Adder Data", http.StatusOK, AutoAdderList, RecordCount)
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
	// whereAdded := false // Flag to track if WHERE clause has been added

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		// whereAdded = true // Set flag to true as WHERE clause is added

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
				filtersBuilder.WriteString(fmt.Sprintf("ad.wc_1 %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("ad.type %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "gc":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.installer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_kw_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.per_kw_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_percentage":
				filtersBuilder.WriteString(fmt.Sprintf("ad.primary_sales_rep %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes_no_repvisible":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.secondary_sales_rep) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ad.unique_id, ad.wc_1, ad.installer, ad.net_epc, ad.primary_sales_rep")
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

// filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, true)
// if filter != "" {
// 	queryForAlldata = query + filter
// }

// data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
// if err != nil {
// 	log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
// 	appserver.FormAndSendHttpResp(resp, "Failed to get auto adder data from DB", http.StatusBadRequest, nil)
// 	return
// }
// RecordCount = int64(len(data))

// for _, item := range data {
// 	// unique_id
// 	Unique_id, ok := item["unique_id"].(string)
// 	if !ok || Unique_id == "" {
// 		log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", Unique_id, item)
// 		Unique_id = ""
// 	}

// 	// Date
// 	Date, ok := item["date"].(time.Time)
// 	if !ok {
// 		log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", Unique_id, item)
// 		Date = time.Time{}
// 	}

// 	// type
// 	Type, ok := item["types"].(string)
// 	if !ok || Type == "" {
// 		log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", Unique_id, item)
// 		Type = ""
// 	}

// 	Gc, ok := item["gc"].(string)
// 	if !ok || Gc == "" {
// 		log.FuncErrorTrace(0, "Failed to get gc for Record ID %v. Item: %+v\n", Unique_id, item)
// 		Gc = ""
// 	}

// 	// per_kw_amount
// 	Per_kw_amount, ok := item["per_kw_amount"].(float64)
// 	if !ok {
// 		log.FuncErrorTrace(0, "Failed to get per_kw_amount for Record ID %v. Item: %+v\n", Unique_id, item)
// 		Per_kw_amount = 0.0
// 	}

// 	// rep_doll_divby_per
// 	RepPercentage, ok := item["rep_percentage"].(float64)
// 	if !ok {
// 		log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", Unique_id, item)
// 		RepPercentage = 0.0
// 	}

// 	// notes_not_rep_visible
// 	NotesNoRepVisible, ok := item["notes_no_repvisible"].(string)
// 	if !ok {
// 		log.FuncErrorTrace(0, "Failed to get notes_no_repvisible for Record ID %v. Item: %+v\n", Unique_id, item)
// 		NotesNoRepVisible = ""
// 	}

// 	if !strings.HasPrefix(Type, "MK") {
// 		switch Type {
// 		case "SM-UNI2":
// 			ExactAmount = 1200
// 			DescriptionRepVisible = "Small System Size"
// 		case "SM-UNI3":
// 			ExactAmount = 600
// 			DescriptionRepVisible = "Small System Size"
// 		case "SM-CA2":
// 			ExactAmount = 600
// 			DescriptionRepVisible = "Small System Size"
// 		}
// 	} else {
// 		DescriptionRepVisible = fmt.Sprintf("Marketing Fee - %s", Type[10:17])
// 	}

// 	AdderType = "Adder"

// 	DateStr := Date.Format("2006-01-02")

// 	AutoAdderData := models.GetAutoAdderData{
// 		UniqueID:              Unique_id,
// 		Date:                  DateStr,
// 		Type:                  Type,
// 		GC:                    Gc,
// 		ExactAmount:           ExactAmount,
// 		PerKWAmount:           Per_kw_amount,
// 		RepPercentage:         RepPercentage,
// 		DescriptionRepVisible: DescriptionRepVisible,
// 		NotesNoRepVisible:     NotesNoRepVisible,
// 		AdderType:             AdderType,
// 	}

// 	AutoAdderList.AutoAdderList = append(AutoAdderList.AutoAdderList, AutoAdderData)
// }
