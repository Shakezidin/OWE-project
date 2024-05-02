/**************************************************************************
 * File       	   : apiGetAdjustments.go
 * DESCRIPTION     : This file contains functions for get Adjustments data handler
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
 * FUNCTION:		HandleGetAdjustmentsRequest
 * DESCRIPTION:     handler for get Adjustments data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAdjustmentsDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleGetAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Adjustments data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Adjustments data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Adjustments data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Adjustments data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_adjustments
	query = `
		SELECT ad.id as record_id, ad.unique_id, ad.customer, ad.sys_size, ad.bl, ad.epc, ad.date, ad.notes, ad.amount, ad.start_date, ad.end_date, pr_partner.partner_name AS partner_name, pr_installer.partner_name AS installer_name, st.name AS state_name  
		FROM adjustments ad
		JOIN partners pr_partner ON pr_partner.partner_id = ad.partner
		JOIN partners pr_installer ON pr_installer.partner_id = ad.installer
		JOIN states st ON st.state_id = ad.state`

	filter, whereEleList = PrepareAdjustmentsFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adjustments data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Adjustments data from DB", http.StatusBadRequest, nil)
		return
	}

	adjustmentsList := models.GetAdjustmentsList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		UniqueId, ok := item["unique_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get unique id for Unique ID %v. Item: %+v\n", UniqueId, item)
			UniqueId = ""
		}

		// Customer
		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			log.FuncErrorTrace(0, "Failed to get customer for Unique ID %v. Item: %+v\n", UniqueId, item)
			Customer = ""
		}

		// PartnerName
		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			log.FuncErrorTrace(0, "Failed to get partner name for Unique ID %v. Item: %+v\n", UniqueId, item)
			PartnerName = ""
		}

		// InstallerName
		InstallerName, ok := item["installer_name"].(string)
		if !ok || InstallerName == "" {
			log.FuncErrorTrace(0, "Failed to get installer name for Unique ID %v. Item: %+v\n", UniqueId, item)
			InstallerName = ""
		}

		// SaleTypeName
		StateName, ok := item["state_name"].(string)
		if !ok || StateName == "" {
			log.FuncErrorTrace(0, "Failed to get sale type name for Unique ID %v. Item: %+v\n", UniqueId, item)
			StateName = ""
		}

		// SysSize
		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys size for Unique ID %v. Item: %+v\n", UniqueId, item)
			SysSize = 0.0 // Default sys size of 0.0
		}

		// BL
		Bl, ok := item["bl"].(string)
		if !ok || Bl == "" {
			log.FuncErrorTrace(0, "Failed to get bl for Unique ID %v. Item: %+v\n", UniqueId, item)
			Bl = ""
		}

		// Epc
		Epc, ok := item["epc"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get epc for Unique ID %v. Item: %+v\n", UniqueId, item)
			Epc = 0.0 // Default epc value of 0.0
		}

		// Date
		DateStr, ok := item["date"].(string)
		if !ok || DateStr == "" {
			log.FuncErrorTrace(0, "Failed to get date for Unique ID %v. Item: %+v\n", UniqueId, item)
			DateStr = ""
		}

		// Notes
		Notes, ok := item["notes"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get notes for Unique ID %v. Item: %+v\n", UniqueId, item)
			Notes = "" // Default notes value of ""
		}

		IsArchived, ok := item["is_archived"].(bool)
		if !ok || !IsArchived {
			log.FuncErrorTrace(0, "Failed to get is_archived value for Record ID %v. Item: %+v\n", RecordId, item)
			IsArchived = false
		}

		// Amount
		Amount, ok := item["amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get amount for Unique ID %v. Item: %+v\n", UniqueId, item)
			Amount = 0.0 // Default amount value of 0.0
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Unique ID %v. Item: %+v\n", UniqueId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Unique ID %v. Item: %+v\n", UniqueId, item)
			EndDate = ""
		}

		adjustmentData := models.GetAdjustments{
			RecordId:      RecordId,
			UniqueId:      UniqueId,
			Customer:      Customer,
			PartnerName:   PartnerName,
			InstallerName: InstallerName,
			StateName:     StateName,
			SysSize:       SysSize,
			Bl:            Bl,
			Epc:           Epc,
			Date:          DateStr,
			Notes:         Notes,
			Amount:        Amount,
			StartDate:     StartDate,
			EndDate:       EndDate,
		}
		adjustmentsList.AdjustmentsList = append(adjustmentsList.AdjustmentsList, adjustmentData)
	}

	filter, whereEleList = PrepareAdjustmentsFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adjustments data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Adjustments data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of Adjustments List fetched : %v list %+v", len(adjustmentsList.AdjustmentsList), adjustmentsList)
	FormAndSendHttpResp(resp, "Adjustments Data", http.StatusOK, adjustmentsList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAdjustmentsFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareAdjustmentsFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAdjustmentsFilters")
	defer func() { log.ExitFn(0, "PrepareAdjustmentsFilters", nil) }()

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
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "partner_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pr_partner.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "installer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pr_installer.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("as.sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "bl":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.bl) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "epc":
				filtersBuilder.WriteString(fmt.Sprintf("ad.epc %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.date) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.amount %s $%d", operator, len(whereEleList)+1))
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
		// filtersBuilder.WriteString(" GROUP BY ad.id,  ad.unique_id, ad.customer, ad.sys_size, ad.bl, ad.epc, ad.date, ad.notes, ad.amount, pr_partner.partner_name, pr_installer.partner_name, st.name, ad.start_date, ad.end_date")
		filtersBuilder.WriteString(" GROUP BY ad.id, ad.unique_id, ad.customer, ad.sys_size, ad.bl, ad.epc, ad.date, ad.notes, ad.amount, ad.start_date, ad.end_date, pr_partner.partner_name, pr_installer.partner_name, st.name")
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
