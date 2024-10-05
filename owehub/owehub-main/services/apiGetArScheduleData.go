/**************************************************************************
 * File       	   : apiGetArScheduleData.go
 * DESCRIPTION     : This file contains functions for get ArSchedule data handler
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
 * FUNCTION:		HandleGetArScheduleDataRequest
 * DESCRIPTION:     handler for get ArSchedule data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetArScheduleDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetArScheduleDataRequest")
	defer func() { log.ExitFn(0, "HandleGetArScheduleDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ar schedule data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ar schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get ar schedule data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_ar_schedule
	query = `
		SELECT ar.id AS record_id, ar.red_line, ar.calc_date, ar.permit_pay, ar.permit_max, ar.install_pay, ar.pto_pay, ar.start_date, ar.end_date, st.name AS state_name, pr_partner.partner_name AS partner_name, pr_installer.partner_name AS installer_name, sy.type_name AS sale_type_name   
		FROM ar_schedule ar
		JOIN states st ON st.state_id = ar.state_id
		JOIN partners pr_partner ON pr_partner.partner_id = ar.partner
		JOIN partners pr_installer ON pr_installer.partner_id = ar.installer
		JOIN sale_type sy ON sy.id = ar.sale_type_id`

	filter, whereEleList = PrepareArScheduleFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ar schedule data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ar schedule data from DB", http.StatusBadRequest, nil)
		return
	}

	arScheduleList := models.GetArScheduleList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// PartnerName
		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// InstallerName
		InstallerName, ok := item["installer_name"].(string)
		if !ok || InstallerName == "" {
			log.FuncErrorTrace(0, "Failed to get installer name for Record ID %v. Item: %+v\n", RecordId, item)
			InstallerName = ""
		}

		// SaleTypeName
		SaleTypeName, ok := item["sale_type_name"].(string)
		if !ok || SaleTypeName == "" {
			log.FuncErrorTrace(0, "Failed to get sale type name for Record ID %v. Item: %+v\n", RecordId, item)
			SaleTypeName = ""
		}

		// StateName
		StateName, ok := item["state_name"].(string)
		if !ok || StateName == "" {
			log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		// RedLine
		RedLine, ok := item["red_line"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get red line for Record ID %v. Item: %+v\n", RecordId, item)
			RedLine = 0
		}

		// CalcDate
		CalcDate, ok := item["calc_date"].(string)
		if !ok || CalcDate == "" {
			log.FuncErrorTrace(0, "Failed to get calc date for Record ID %v. Item: %+v\n", RecordId, item)
			CalcDate = ""
		}

		// PermitPay
		PermitPay, ok := item["permit_pay"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get permit pay for Record ID %v. Item: %+v\n", RecordId, item)
			PermitPay = 0
		}

		// PermitMax
		PermitMax, ok := item["permit_max"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get permit max for Record ID %v. Item: %+v\n", RecordId, item)
			PermitMax = 0
		}

		// InstallPay
		InstallPay, ok := item["install_pay"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get install pay for Record ID %v. Item: %+v\n", RecordId, item)
			InstallPay = 0
		}

		// PtoPay
		PtoPay, ok := item["pto_pay"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get PTO pay for Record ID %v. Item: %+v\n", RecordId, item)
			PtoPay = 0
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

		start := StartDate.Format("2006-01-02")
		end := EndDate.Format("2006-01-02")

		arSchedule := models.GetArSchedule{
			RecordId:      RecordId,
			PartnerName:   PartnerName,
			InstallerName: InstallerName,
			SaleTypeName:  SaleTypeName,
			StateName:     StateName,
			RedLine:       RedLine,
			CalcDate:      CalcDate,
			PermitPay:     PermitPay,
			PermitMax:     PermitMax,
			InstallPay:    InstallPay,
			PtoPay:        PtoPay,
			StartDate:     start,
			EndDate:       end,
		}
		arScheduleList.ArScheduleList = append(arScheduleList.ArScheduleList, arSchedule)
	}

	filter, whereEleList = PrepareArScheduleFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ar schedule data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ar schedule data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of ar schedule List fetched : %v list %+v", len(arScheduleList.ArScheduleList), arScheduleList)
	appserver.FormAndSendHttpResp(resp, "Ar Schedule Data", http.StatusOK, arScheduleList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareArScheduleFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareArScheduleFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareArScheduleFilters")
	defer func() { log.ExitFn(0, "PrepareArScheduleFilters", nil) }()

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
			case "partner_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pr_partner.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "installer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pr_installer.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sale_type_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(sy.type_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "red_line":
				filtersBuilder.WriteString(fmt.Sprintf("ar.red_line %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "calc_date":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ar.calc_date) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "permit_pay":
				filtersBuilder.WriteString(fmt.Sprintf("ar.permit_pay %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "permit_max":
				filtersBuilder.WriteString(fmt.Sprintf("ar.permit_max %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "install_pay":
				filtersBuilder.WriteString(fmt.Sprintf("ar.install_pay %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "pto_pay":
				filtersBuilder.WriteString(fmt.Sprintf("ar.pto_pay %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("ar.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("ar.end_date %s $%d", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString(" GROUP BY ar.id, ar.red_line, ar.calc_date, ar.permit_pay, ar.permit_max, ar.install_pay, ar.pto_pay, ar.start_date, ar.end_date, st.name, pr_partner.partner_name, pr_installer.partner_name, sy.type_name")
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
