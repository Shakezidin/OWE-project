/**************************************************************************
 * File       	   : apiGetVDealerData.go
 * DESCRIPTION     : This file contains functions for get v dealer data handler
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
 * FUNCTION:		HandleGetVDealerDataRequest
 * DESCRIPTION:     handler for get v dealer data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetVDealerDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetVDealerDataRequest")
	defer func() { log.ExitFn(0, "HandleGetVDealerDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get v dealer data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get v dealer data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get v dealer data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get v dealer data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_v_dealer
	query = `
	 SELECT vd.id as record_id, vd.dealer_code, vd.dealer_name, vd.description
	 FROM v_dealer vd`

	filter, whereEleList = PrepareVdealerFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get v Dealer data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get v Dealer data from DB", http.StatusBadRequest, nil)
		return
	}

	vDealerList := models.GetVDealersList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// dealerCode
		dealerCode, dealercodeOk := item["dealer_code"].(string)
		if !dealercodeOk || dealerCode == "" {
			log.FuncErrorTrace(0, "Failed to get dealer code for Record ID %v. Item: %+v\n", RecordId, item)
			dealerCode = ""
		}

		// DealerName
		DealerName, dealerNameOk := item["dealer_name"].(string)
		if !dealerNameOk || DealerName == "" {
			log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			DealerName = ""
		}

		// Description
		Description, discriptioneOk := item["description"].(string)
		if !discriptioneOk || Description == "" {
			log.FuncErrorTrace(0, "Failed to get description for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		// Create a new GetVdealerData object
		vDealerData := models.GetVDealerData{
			RecordId:    RecordId,
			DealerCode:  dealerCode,
			DealerName:  DealerName,
			Description: Description,
		}

		// Append the new vDealerData to the vDealerList
		vDealerList.VDealersList = append(vDealerList.VDealersList, vDealerData)
	}

	filter, whereEleList = PrepareVdealerFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get v dealer data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get v Dealer data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of v Dealer List fetched : %v list %+v", len(vDealerList.VDealersList), vDealerList)
	FormAndSendHttpResp(resp, "V Dealer Data", http.StatusOK, vDealerList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareVdealerFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareVdealerFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareVdealerFilters")
	defer func() { log.ExitFn(0, "PrepareVdealerFilters", nil) }()

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
			case "dealer_code":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_code) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.description) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				// For other columns, handle them accordingly
				filtersBuilder.WriteString("LOWER(vd.")
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
		filtersBuilder.WriteString("vd.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("vd.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY vd.id, vd.dealer_code, vd.dealer_name, vd.description")
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
