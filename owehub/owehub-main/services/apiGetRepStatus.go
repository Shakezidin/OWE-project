/**************************************************************************
 * File       	   : apiGetRepStatusData.go
 * DESCRIPTION     : This file contains functions for get RepStatus data handler
 * DATE            : 24-Jun-2024
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
 * FUNCTION:		HandleGetRepStatusDataRequest
 * DESCRIPTION:     handler for get RepStatus data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetRepStatusDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetRepStatusDataRequest")
	defer func() { log.ExitFn(0, "HandleGetRepStatusDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get RepStatus data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get RepStatus data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get RepStatus data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get RepStatus data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_rep_status
	query = `SELECT 
		 ap.id as record_id, ap.name, ap.status
		 FROM ` + db.TableName_rep_status + ` ap`

	filter, whereEleList = PrepareRepStatusFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepStatus data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get RepStatus data from DB", http.StatusBadRequest, nil)
		return
	}

	RepStatusList := models.GetRepStatusList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		Name, ok := item["name"].(string)
		if !ok || Name == "" {
			log.FuncErrorTrace(0, "Failed to get name for Record ID %v. Item: %+v\n", RecordId, item)
			Name = ""
		}
		Status, ok := item["status"].(string)
		if !ok || Status == "" {
			log.FuncErrorTrace(0, "Failed to get month for Record ID %v. Item: %+v\n", RecordId, item)
			Status = ""
		}

		RepStatus := models.GetRepStatus{
			RecordId: RecordId,
			Status:   Status,
			Name:     Name,
		}

		RepStatusList.RepStatusList = append(RepStatusList.RepStatusList, RepStatus)
	}

	filter, whereEleList = PrepareRepStatusFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepStatus data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get RepStatus data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of RepStatus List fetched : %v list %+v", len(RepStatusList.RepStatusList), RepStatusList)
	appserver.FormAndSendHttpResp(resp, "RepStatus Data", http.StatusOK, RepStatusList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareRepStatusFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareRepStatusFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareRepStatusFilters")
	defer func() { log.ExitFn(0, "PrepareRepStatusFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false

	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true

		for i, filter := range dataFilter.Filters {
			column := filter.Column

			operator := GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}

			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			switch column {
			case "name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "status":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.status) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	if dataFilter.Archived {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ap.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ap.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ap.id, ap.name, ap.status")
	} else {
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ap.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
