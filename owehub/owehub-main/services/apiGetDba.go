/**************************************************************************
 * File       	   : apiGetDBAData.go
 * DESCRIPTION     : This file contains functions for get DBA data handler
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
 * FUNCTION:		HandleGetDBADataRequest
 * DESCRIPTION:     handler for get DBA data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDBADataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetDBADataRequest")
	defer func() { log.ExitFn(0, "HandleGetDBADataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get DBA data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get DBA data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get DBA data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get DBA data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_dba
	query = `SELECT 
		 ap.id as record_id, ap.preferred_name, ap.dba
		 FROM ` + db.TableName_dba + ` ap`

	filter, whereEleList = PrepareDBAFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get DBA data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get DBA data from DB", http.StatusBadRequest, nil)
		return
	}

	DBAList := models.GetDBAList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		PreferredName, ok := item["preferred_name"].(string)
		if !ok || PreferredName == "" {
			log.FuncErrorTrace(0, "Failed to get name for Record ID %v. Item: %+v\n", RecordId, item)
			PreferredName = ""
		}
		Dba, ok := item["dba"].(string)
		if !ok || Dba == "" {
			log.FuncErrorTrace(0, "Failed to get month for Record ID %v. Item: %+v\n", RecordId, item)
			Dba = ""
		}

		DBA := models.GetDBA{
			RecordId:      RecordId,
			Dba:           Dba,
			PreferredName: PreferredName,
		}

		DBAList.DBAList = append(DBAList.DBAList, DBA)
	}

	filter, whereEleList = PrepareDBAFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get DBA data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get DBA data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of DBA List fetched : %v list %+v", len(DBAList.DBAList), DBAList)
	appserver.FormAndSendHttpResp(resp, "DBA Data", http.StatusOK, DBAList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareDBAFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDBAFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDBAFilters")
	defer func() { log.ExitFn(0, "PrepareDBAFilters", nil) }()

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
			case "preferred_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.preferred_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dba":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.dba) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "record_id":
				filtersBuilder.WriteString(fmt.Sprintf("ap.record_id %s $%d", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString(" GROUP BY ap.id, ap.preferred_name, ap.dba")
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
