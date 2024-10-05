/**************************************************************************
 * File       	   : apiGetCommissionsData.go
 * DESCRIPTION     : This file contains functions for get commissions data handler
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
 * FUNCTION:		HandleGetCommissionsDataRequest
 * DESCRIPTION:     handler for get commissions data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetCommissionsDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetCommissionsDataRequest")
	defer func() { log.ExitFn(0, "HandleGetCommissionsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Commissions data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get commissions data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get commissions data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get commissions data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_rebate_data
	query = `
	SELECT cr.id as record_id, pt1.partner_name as partner_name, pt2.partner_name as installer_name, st.name, sl.type_name as sale_type, cr.sale_price, rp.rep_type, cr.rl, cr.rate, cr.start_date, cr.end_date
	FROM commission_rates cr
	JOIN states st ON st.state_id = cr.state_id
	JOIN partners pt1 ON pt1.partner_id = cr.partner_id
	JOIN partners pt2 ON pt2.partner_id = cr.installer_id
	JOIN sale_type sl ON sl.id = cr.sale_type_id
	JOIN rep_type rp ON rp.id = cr.rep_type`

	filter, whereEleList = PrepareCommissionFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get commissions data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get commissions data from DB", http.StatusBadRequest, nil)
		return
	}

	commissionsList := models.GetCommissionsList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Partner
		Partner, ok := item["partner_name"].(string)
		if !ok || Partner == "" {
			log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			Partner = ""
		}

		// Installer
		Installer, ok := item["installer_name"].(string)
		if !ok || Installer == "" {
			log.FuncErrorTrace(0, "Failed to get installer name for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		// State
		State, ok := item["name"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// SaleType
		SaleType, ok := item["sale_type"].(string)
		if !ok || SaleType == "" {
			log.FuncErrorTrace(0, "Failed to get sale type for Record ID %v. Item: %+v\n", RecordId, item)
			SaleType = ""
		}

		// SalePrice
		SalePrice, ok := item["sale_price"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sale price for Record ID %v. Item: %+v\n", RecordId, item)
			SalePrice = 0.0 // Default sale price of 0.0
		}

		// RepType
		RepType, ok := item["rep_type"].(string)
		if !ok || RepType == "" {
			log.FuncErrorTrace(0, "Failed to get rep type for Record ID %v. Item: %+v\n", RecordId, item)
			RepType = ""
		}

		// RL
		RL, ok := item["rl"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rl for Record ID %v. Item: %+v\n", RecordId, item)
			RL = 0.0 // Default RL value of 0.0
		}

		// Rate
		Rate, ok := item["rate"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rate for Record ID %v. Item: %+v\n", RecordId, item)
			Rate = 0.0 // Default rate value of 0.0
		}

		// StartDate
		StartDate, ok := item["start_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		startdate := StartDate.Format("2006-01-02")
		endDate := EndDate.Format("2006-01-02")
		commissionData := models.GetCommissionData{
			RecordId:  RecordId,
			Partner:   Partner,
			Installer: Installer,
			State:     State,
			SaleType:  SaleType,
			SalePrice: SalePrice,
			RepType:   RepType,
			RL:        RL,
			Rate:      Rate,
			StartDate: startdate,
			EndDate:   endDate,
		}
		commissionsList.CommissionsList = append(commissionsList.CommissionsList, commissionData)
	}

	filter, whereEleList = PrepareCommissionFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get commissions data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get commissions data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of commissions List fetched : %v list %+v", len(commissionsList.CommissionsList), commissionsList)
	appserver.FormAndSendHttpResp(resp, "Commissions Data", http.StatusOK, commissionsList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareCommissionFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareCommissionFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
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
			case "partner":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt1.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "installer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt2.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sale_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(sl.type_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(rp.rep_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sale_price":
				filtersBuilder.WriteString(fmt.Sprintf("cr.sale_price %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rl":
				filtersBuilder.WriteString(fmt.Sprintf("cr.rl %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rate":
				filtersBuilder.WriteString(fmt.Sprintf("cr.rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("cr.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("cr.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(cr.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("cr.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("cr.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY cr.id, pt1.partner_name, pt2.partner_name, st.name, sl.type_name, cr.sale_price, rp.rep_type, cr.rl, cr.rate, cr.start_date, cr.end_date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY cr.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
