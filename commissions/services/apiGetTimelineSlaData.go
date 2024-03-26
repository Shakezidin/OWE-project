/**************************************************************************
 * File       	   : apiGetTierLoanFeesData.go
 * DESCRIPTION     : This file contains functions for get v adder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetTimelineSlasDataRequest
 * DESCRIPTION:     handler for get timeline sla data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTimelineSlasDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetTimelineSlasDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTimelineSlasDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get timeline sla data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get timeline sla data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get timeline sla data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get timeline sla data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_timeline_sla
	query = `
	SELECT tlsa.type_m2m, st.name as state, tlsa.days, tlsa.start_date, tlsa.end_date
	FROM timeline_sla tlsa
	JOIN states st ON tlsa.state_id = st.state_id
	`

	filter, whereEleList = PrepareTimelineSlaFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get timeline sla data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get timeline sla data from DB", http.StatusBadRequest, nil)
		return
	}

	timelineSlaList := models.GetTimelineSlaList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		TypeM2M := item["type_m2m"].(string)
		State := item["state"].(string)
		Days := "1" //strconv.Itoa(int(item["days"].(int64)))
		StartDate := item["start_date"].(string)
		EndDate := func() string {
			if val, ok := item["end_date"].(string); ok {
				return val
			}
			return ""
		}()

		// Create a new GetMarketingFeesData object
		tlsData := models.GetTimelineSlaData{
			TypeM2M:   TypeM2M,
			State:     State,
			Days:      Days,
			StartDate: StartDate,
			EndDate:   EndDate,
		}

		// Append the new vaddersData to the marketingFeesList
		timelineSlaList.TimelineSlaList = append(timelineSlaList.TimelineSlaList, tlsData)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of timeline sla List fetched : %v list %+v", len(timelineSlaList.TimelineSlaList), timelineSlaList)
	FormAndSendHttpResp(resp, "timeline sla Data", http.StatusOK, timelineSlaList)
}

/******************************************************************************
 * FUNCTION:		PrepareTimelineSlaFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareTimelineSlaFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareTimelineSlaFilters")
	defer func() { log.ExitFn(0, "PrepareTimelineSlaFilters", nil) }()
	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

			// Check if the column is a foreign key
			column := filter.Column
			switch column {
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("st.name %s $%d", filter.Operation, len(whereEleList)+1))
			default:
				// For other columns, call PrepareFilters function
				if len(filtersBuilder.String()) > len(" WHERE ") {
					filtersBuilder.WriteString(" AND ")
				}
				subFilters, subWhereEleList := PrepareFilters(tableName, models.DataRequestBody{Filters: []models.Filter{filter}})
				filtersBuilder.WriteString(subFilters)
				whereEleList = append(whereEleList, subWhereEleList...)
				continue
			}

			whereEleList = append(whereEleList, filter.Data)
		}
	}
	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
