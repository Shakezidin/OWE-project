/**************************************************************************
 * File       	   : apiGetInstallCostData.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
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
 * FUNCTION:		HandleGetInstallCostDataRequest
 * DESCRIPTION:     handler for get InstallCost data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetInstallCostDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetInstallCostDataRequest")
	defer func() { log.ExitFn(0, "HandleGetInstallCostDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get InstallCost data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get InstallCost data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get InstallCost data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get InstallCost data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_install_cost
	query = `
	SELECT ic.id as record_id, ic.unique_id, ic.cost, ic.is_archived, ic.start_date, ic.end_date
	FROM install_cost ic`

	filter, whereEleList = PrepareInstallCostFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get InstallCost data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get InstallCost data from DB", http.StatusBadRequest, nil)
		return
	}

	installCostList := models.GetInstallCostList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Partner
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get UniqueId for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		// Rate
		Cost, ok := item["cost"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Cost for Record ID %v. Item: %+v\n", RecordId, item)
			Cost = 0.0 // Default rate value of 0.0
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		IsArchived, ok := item["is_archived"].(bool)
		if !ok || !IsArchived {
			log.FuncErrorTrace(0, "Failed to get is_archived value for Record ID %v. Item: %+v\n", RecordId, item)
			IsArchived = false
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		installCost := models.GetInstallCost{
			UniqueId:   UniqueId,
			RecordId:   RecordId,
			Cost:       Cost,
			StartDate:  StartDate,
			EndDate:    EndDate,
		}
		installCostList.InstallCostList = append(installCostList.InstallCostList, installCost)
	}

	filter, whereEleList = PrepareInstallCostFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get InstallCost data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get InstallCost data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of InstallCost List fetched : %v list %+v", len(installCostList.InstallCostList), installCostList)
	FormAndSendHttpResp(resp, "InstallCost Data", http.StatusOK, installCostList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareInstallCostFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareInstallCostFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareInstallCostFilters")
	defer func() { log.ExitFn(0, "PrepareInstallCostFilters", nil) }()

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
			case "cost":
				filtersBuilder.WriteString(fmt.Sprintf("ic.cost %s $%d", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ic.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ic.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ic.id, ic.unique_id, ic.cost, ic.is_archived,ic.start_date, ic.end_date")
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
