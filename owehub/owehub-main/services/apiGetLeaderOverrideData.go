/**************************************************************************
 * File       	   : apiGetLeaderOverrideData.go
 * DESCRIPTION     : This file contains functions for get LeaderOverride data handler
 * DATE            : 28-Apr-2024
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
 * FUNCTION:		HandleGetMarketingFeeDataRequest
 * DESCRIPTION:     handler for get LeaderOverride data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLeaderOverrideDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetLeaderOverrideDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLeaderOverrideDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get LeaderOverride data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get LeaderOverride data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get LeaderOverride data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get LeaderOverride data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_leader_override
	query = `
	SELECT lo.id as record_id, lo.unique_id, lo.leader_name, lo.type, lo.term, lo.qual, lo.sales_q, lo.team_kw_q, lo.pay_rate, lo.start_date, lo.end_date, ts.team_name
	FROM leader_override lo
	JOIN teams ts ON ts.team_id = lo.team_id`

	filter, whereEleList = PrepareLeaderOverrideFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get LeaderOverride data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get LeaderOverride data from DB", http.StatusBadRequest, nil)
		return
	}

	LeaderOverrideList := models.GetLeaderOverrideList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		UniqueID, idOk := item["unique_id"].(string)
		if !idOk || UniqueID == "" {
			log.FuncErrorTrace(0, "Failed to get unique ID for Unique ID %v. Item: %+v\n", UniqueID, item)
			UniqueID = ""
		}
		// TeamName
		TeamName, teamOk := item["team_name"].(string)
		if !teamOk || TeamName == "" {
			log.FuncErrorTrace(0, "Failed to get team name for Unique ID %v. Item: %+v\n", UniqueID, item)
			TeamName = ""
		}

		// LeaderName
		LeaderName, leaderOk := item["leader_name"].(string)
		if !leaderOk || LeaderName == "" {
			log.FuncErrorTrace(0, "Failed to get leader name for Unique ID %v. Item: %+v\n", UniqueID, item)
			LeaderName = ""
		}

		// Type
		Type, typeOk := item["type"].(string)
		if !typeOk || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Unique ID %v. Item: %+v\n", UniqueID, item)
			Type = ""
		}

		// Term
		Term, termOk := item["term"].(string)
		if !termOk || Term == "" {
			log.FuncErrorTrace(0, "Failed to get term for Unique ID %v. Item: %+v\n", UniqueID, item)
			Term = ""
		}

		// Qual
		Qual, qualOk := item["qual"].(string)
		if !qualOk || Qual == "" {
			log.FuncErrorTrace(0, "Failed to get qual for Unique ID %v. Item: %+v\n", UniqueID, item)
			Qual = ""
		}

		// SalesQ
		SalesQ, salesOk := item["sales_q"].(float64)
		if !salesOk {
			log.FuncErrorTrace(0, "Failed to get sales Q for Unique ID %v. Item: %+v\n", UniqueID, item)
			SalesQ = 0.0
		}

		// TeamKwQ
		TeamKwQ, teamKwOk := item["team_kw_q"].(float64)
		if !teamKwOk {
			log.FuncErrorTrace(0, "Failed to get team KW Q for Unique ID %v. Item: %+v\n", UniqueID, item)
			TeamKwQ = 0.0
		}

		// PayRate
		PayRate, payOk := item["pay_rate"].(string)
		if !payOk || PayRate == "" {
			log.FuncErrorTrace(0, "Failed to get pay rate for Unique ID %v. Item: %+v\n", UniqueID, item)
			PayRate = ""
		}

		IsArchived, ok := item["is_archived"].(bool)
		if !ok || !IsArchived {
			log.FuncErrorTrace(0, "Failed to get is_archived value for Record ID %v. Item: %+v\n", RecordId, item)
			IsArchived = false
		}

		// StartDate
		StartDate, startOk := item["start_date"].(string)
		if !startOk || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Unique ID %v. Item: %+v\n", UniqueID, item)
			StartDate = ""
		}

		// EndDate
		EndDate, endOk := item["end_date"].(string)
		if !endOk || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Unique ID %v. Item: %+v\n", UniqueID, item)
			EndDate = ""
		}

		// Create a new GetMarketingFeesData object
		leaderOverrideData := models.GetLeaderOverride{
			RecordId: RecordId,
			UniqueID:   UniqueID,
			TeamName:   TeamName,
			LeaderName: LeaderName,
			Type:       Type,
			Term:       Term,
			Qual:       Qual,
			SalesQ:     SalesQ,
			TeamKwQ:    TeamKwQ,
			PayRate:    PayRate,
			StartDate:  StartDate,
			EndDate:    EndDate,
		}

		// Append the new marketingFeesData to the marketingFeesList
		LeaderOverrideList.LeaderOverrideList = append(LeaderOverrideList.LeaderOverrideList, leaderOverrideData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of LeaderOverride List fetched : %v list %+v", len(LeaderOverrideList.LeaderOverrideList), LeaderOverrideList)
	FormAndSendHttpResp(resp, "LeaderOverride Data", http.StatusOK, LeaderOverrideList)
}

/******************************************************************************
 * FUNCTION:		PrepareLeaderOverridesFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareLeaderOverrideFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareLeaderOverrideFilters")
	defer func() { log.ExitFn(0, "PrepareLeaderOverrideFilters", nil) }()

	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lo.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "team_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lo.team_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "leader_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lo.leader_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lo.type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "term":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lo.term) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "qual":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lo.qual) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sales_q":
				filtersBuilder.WriteString(fmt.Sprintf("lo.sales_q %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "team_kw_q":
				filtersBuilder.WriteString(fmt.Sprintf("lo.team_kw_q %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "pay_rate":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lo.pay_rate) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("lo.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("lo.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}

		}
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
