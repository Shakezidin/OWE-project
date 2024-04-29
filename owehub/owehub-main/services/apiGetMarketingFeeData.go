/**************************************************************************
 * File       	   : apiGetMarketingFeeData.go
 * DESCRIPTION     : This file contains functions for get Marketing Fee data handler
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
 * FUNCTION:		HandleGetMarketingFeesDataRequest
 * DESCRIPTION:     handler for get marketing fee data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetMarketingFeesDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetMarketingFeesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetMarketingFeesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Marketing fee data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Marketing fee data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Marketing fee data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Marketing fee data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_marketing_fees
	query = `
	SELECT mf.id as record_id, mf.dba, mf.fee_rate, mf.chg_dlr, mf.pay_src, mf.start_date, mf.end_date, mf.description, st.name as state_name, sr.name as source_name
	FROM marketing_fees mf
	JOIN states st ON st.state_id = mf.state_id
	JOIN source sr ON sr.id = mf.source_id`

	filter, whereEleList = PrepareMarketingFeesFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Marketing fee data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Marketing fee data from DB", http.StatusBadRequest, nil)
		return
	}

	marketingFeesList := models.GetMarketingFeesList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// Source
		Source, ok := item["source_name"].(string)
		if !ok || Source == "" {
			log.FuncErrorTrace(0, "Failed to get source name for Record ID %v. Item: %+v\n", RecordId, item)
			Source = ""
		}

		// Dba
		Dba, ok := item["dba"].(string)
		if !ok || Dba == "" {
			log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", RecordId, item)
			Dba = ""
		}

		// State
		State, ok := item["state_name"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// FeeRate
		FeeRate, ok := item["fee_rate"].(string)
		if !ok || FeeRate == "" {
			log.FuncErrorTrace(0, "Failed to get fee rate for Record ID %v. Item: %+v\n", RecordId, item)
			FeeRate = ""
		}

		// ChgDlr
		ChgDlrVal, ok := item["chg_dlr"].(int64)
		ChgDlr := 0
		if !ok {
			log.FuncErrorTrace(0, "Failed to get chg_dlr for Record ID %v. Item: %+v\n", RecordId, item)
			ChgDlr = 0 // Default ChgDlr value of 0
		} else {
			ChgDlr = int(ChgDlrVal)
		}

		// PaySrc
		PaySrcVal, ok := item["pay_src"].(int64)
		PaySrc := 0
		if !ok {
			log.FuncErrorTrace(0, "Failed to get pay_src for Record ID %v. Item: %+v\n", RecordId, item)
			PaySrc = 0 // Default PaySrc value of 0
		} else {
			PaySrc = int(PaySrcVal)
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		// Description
		Description, descOk := item["description"].(string)
		if !descOk || Description == "" {
			Description = ""
		}

		// is_archived
		IsArchived, ok := item["is_archived"].(bool)
		if !ok || !IsArchived {
			log.FuncErrorTrace(0, "Failed to get is_archived value for Record ID %v. Item: %+v\n", RecordId, item)
			IsArchived = false
		}

		// Create a new GetMarketingFeesData object
		marketingFeesData := models.GetMarketingFeesData{
			RecordId:    RecordId,
			Source:      Source,
			Dba:         Dba,
			State:       State,
			FeeRate:     FeeRate,
			ChgDlr:      ChgDlr,
			PaySrc:      PaySrc,
			StartDate:   StartDate,
			EndDate:     EndDate,
			Description: Description,
		}

		// Append the new marketingFeesData to the marketingFeesList
		marketingFeesList.MarketingFeesList = append(marketingFeesList.MarketingFeesList, marketingFeesData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of Marketing fee List fetched : %v list %+v", len(marketingFeesList.MarketingFeesList), marketingFeesList)
	FormAndSendHttpResp(resp, "Marketing fee Data", http.StatusOK, marketingFeesList)
}

/******************************************************************************
 * FUNCTION:		PrepareMarketingFeesFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareMarketingFeesFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareMarketingFeesFilters")
	defer func() { log.ExitFn(0, "PrepareMarketingFeesFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Flag to track if WHERE clause has been added

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true // Set flag to true as WHERE clause is added

		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

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
			switch column {
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "source":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(sr.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(mf.description) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "chg_dlr":
				filtersBuilder.WriteString(fmt.Sprintf("mf.chg_dlr %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "pay_src":
				filtersBuilder.WriteString(fmt.Sprintf("mf.pay_src %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "fee_rate":
				filtersBuilder.WriteString(fmt.Sprintf("mf.fee_rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				// For other columns, handle them accordingly
				filtersBuilder.WriteString("LOWER(")
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
		filtersBuilder.WriteString("mf.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("mf.is_archived = FALSE")
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
