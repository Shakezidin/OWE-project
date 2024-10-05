/**************************************************************************
 * File       	   : apiGetAdderDataConfig.go
 * DESCRIPTION     : This file contains functions for get adder data config data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
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
 * FUNCTION:		HandleGetAdderDataConfigRequest
 * DESCRIPTION:     handler for get adder data config data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAdderDataConfigRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetAdderDataConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetAdderDataConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get adder data config data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get adder data config data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get adder data config data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get adder data config data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_Adder_data_config
	query = `
	 SELECT adcs.id as record_id, adcs.adder_name, adcs.status, adcs.adder_type, adcs.price_type, adcs.price, adcs.rep_commission, adcs.rep_commission_type, adcs.details
	 FROM adder_data_cfg_schema adcs`

	filter, whereEleList = PrepareAdderDataConfigFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get adder data config data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get adder data config data from DB", http.StatusBadRequest, nil)
		return
	}

	adderdataconfigList := models.GetAdderDataConfigList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// AdderName
		AdderName, ok := item["adder_name"].(string)
		if !ok || AdderName == "" {
			log.FuncErrorTrace(0, "Failed to get adder name for Record ID %v. Item: %+v\n", RecordId, item)
			AdderName = ""
		}

		// Status
		Status, ok := item["status"].(string)
		if !ok || Status == "" {
			log.FuncErrorTrace(0, "Failed to get Status for Record ID %v. Item: %+v\n", RecordId, item)
			Status = ""
		}

		// State
		AdderType, ok := item["adder_type"].(string)
		if !ok || AdderType == "" {
			log.FuncErrorTrace(0, "Failed to get adder type for Record ID %v. Item: %+v\n", RecordId, item)
			AdderType = ""
		}

		// PriceType
		PriceType, ok := item["price_type"].(string)
		if !ok || PriceType == "" {
			log.FuncErrorTrace(0, "Failed to get price type for Record ID %v. Item: %+v\n", RecordId, item)
			PriceType = ""
		}

		// Price
		Price, ok := item["price"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get price for Record ID %v. Item: %+v\n", RecordId, item)
			Price = 0.0 // Default price of 0.0
		}

		// RepCommission
		RepCommission, ok := item["rep_commission"].(string)
		if !ok || RepCommission == "" {
			log.FuncErrorTrace(0, "Failed to get rep commission for Record ID %v. Item: %+v\n", RecordId, item)
			RepCommission = ""
		}

		// RepCommissionType
		RepCommissionType, ok := item["rep_commission_type"].(string)
		if !ok || RepCommissionType == "" {
			log.FuncErrorTrace(0, "Failed to get Rep Commission Type for Record ID %v. Item: %+v\n", RecordId, item)
			RepCommissionType = ""
		}

		// Details
		Details, ok := item["details"].(string)
		if !ok || Details == "" {
			log.FuncErrorTrace(0, "Failed to get details for Record ID %v. Item: %+v\n", RecordId, item)
			Details = ""
		}

		AdderdataConfigData := models.GetAdderDataConfig{
			RecordId:          RecordId,
			AdderName:         AdderName,
			Status:            Status,
			AdderType:         AdderType,
			PriceType:         PriceType,
			Price:             Price,
			RepCommission:     RepCommission,
			RepCommissionType: RepCommissionType,
			Details:           Details,
		}
		adderdataconfigList.AdderDataConfigList = append(adderdataconfigList.AdderDataConfigList, AdderdataConfigData)
	}

	filter, whereEleList = PrepareAdderDataConfigFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get adder data config data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get adder data config data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of adder data config List fetched : %v list %+v", len(adderdataconfigList.AdderDataConfigList), adderdataconfigList)
	appserver.FormAndSendHttpResp(resp, "adder data config Data", http.StatusOK, adderdataconfigList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareCommissionFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareAdderDataConfigFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareCommissionFilters")
	defer func() { log.ExitFn(0, "PrepareCommissionFilters", nil) }()

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
			case "adder_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(adcs.adder_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "status":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(adcs.status) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "adder_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(adcs.adder_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "price_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(adcs.price_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "price":
				filtersBuilder.WriteString(fmt.Sprintf("adcs.price %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_commission":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(adcs.rep_commission) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_commission_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(adcs.rep_commission_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "details":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(adcs.details) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	// Handle the Archived field
	// if dataFilter.Archived {
	// 	if whereAdded {
	// 		filtersBuilder.WriteString(" AND ")
	// 	} else {
	// 		filtersBuilder.WriteString(" WHERE ")
	// 	}
	// 	filtersBuilder.WriteString("cr.is_archived = TRUE")
	// } else {
	// 	if whereAdded {
	// 		filtersBuilder.WriteString(" AND ")
	// 	} else {
	// 		filtersBuilder.WriteString(" WHERE ")
	// 	}
	// 	filtersBuilder.WriteString("cr.is_archived = FALSE")
	// }

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY adcs.id, adcs.adder_name, adcs.status, adcs.adder_type, adcs.price_type, adcs.price, adcs.rep_commission, adcs.rep_commission_type, adcs.details")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY adcs.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
