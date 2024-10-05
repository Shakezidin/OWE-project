/**************************************************************************
 * File       	   : apiGetRepPaySettingsData.go
 * DESCRIPTION     : This file contains functions for get RepPaySettings type data handler
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
 * FUNCTION:		HandleGetRepPaySettingsDataRequest
 * DESCRIPTION:     handler for get RepPaySettings data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetRepPaySettingsDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetRepPaySettingsDataRequest")
	defer func() { log.ExitFn(0, "HandleGetRepPaySettingsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get rep pay settings data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get rep pay settings data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get rep pay settings data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get rep pay settings data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_RepPaySettingss
	query = `
	 SELECT rs.id AS record_id, rs.name, st.name AS state_name, rt.rep_type AS pay_scale, rs.position,
	 rs.b_e, rs.start_date, rs.end_date
	 FROM rep_pay_settings rs
	 LEFT JOIN states st ON st.state_id = rs.state_id
	 LEFT JOIN rep_type rt ON rt.id = rs.pay_scale`

	filter, whereEleList = PrepareRepPaySettingsFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rep pay settings data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get rep pay settings data from DB", http.StatusBadRequest, nil)
		return
	}

	RepPaySettingsList := models.GetRepPaySettingsList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, Ok := item["record_id"].(int64)
		if !Ok {
			RecordId = 0.0
		}

		Name, nameOk := item["name"].(string)
		if !nameOk || Name == "" {
			Name = ""
		}

		State_name, state_nameOk := item["state_name"].(string)
		if !state_nameOk || State_name == "" {
			State_name = ""
		}

		Pay_scale, pay_scaleOk := item["pay_scale"].(string)
		if !pay_scaleOk || Pay_scale == "" {
			Pay_scale = ""
		}

		Position, positionOk := item["position"].(string)
		if !positionOk || Position == "" {
			Position = ""
		}

		B_e, b_eOk := item["b_e"].(bool)
		if !b_eOk {
			B_e = false
		}

		Start_date, start_dateOk := item["start_date"].(time.Time)
		if !start_dateOk {
			Start_date = time.Time{}
		}

		End_date, end_dateOk := item["end_date"].(time.Time)
		if !end_dateOk {
			End_date = time.Time{}
		}

		start := Start_date.Format("2006-01-02")
		end := End_date.Format("2006-01-02")

		RepPaySettingsData := models.GetRepPaySettingsData{
			RecordId:  RecordId,
			Name:      Name,
			State:     State_name,
			PayScale:  Pay_scale,
			Position:  Position,
			B_E:       B_e,
			StartDate: start,
			EndDate:   end,
		}

		RepPaySettingsList.RepPaySettingsList = append(RepPaySettingsList.RepPaySettingsList, RepPaySettingsData)
	}

	filter, whereEleList = PrepareRepPaySettingsFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rep pay settings data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get rep pay settings data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of rep pay settings List fetched : %v list %+v", len(RepPaySettingsList.RepPaySettingsList), RepPaySettingsList)
	appserver.FormAndSendHttpResp(resp, "Rep Pay Settings Data", http.StatusOK, RepPaySettingsList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareRepPaySettingsFilters
 * DESCRIPTION:     handler for create select query
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareRepPaySettingsFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
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
			case "name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(rs.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "pay_scale":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(rt.rep_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "position":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(rs.position) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "b_e":
				filtersBuilder.WriteString(fmt.Sprintf("rs.b_e %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("rs.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("rs.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(rs.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("rs.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("rs.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY rs.id, rs.name, st.name, rt.rep_type, rs.position, rs.b_e, rs.start_date, rs.end_date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY rs.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
