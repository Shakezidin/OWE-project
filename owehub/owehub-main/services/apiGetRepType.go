/**************************************************************************
 * File       	   : apiGetRepTypeData.go
 * DESCRIPTION     : This file contains functions for get RepType data handler
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
* FUNCTION:		HandleGetRepTypeDataRequest
* DESCRIPTION:     handler for get RepType data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetRepTypeDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetRepTypeDataRequest")
	defer func() { log.ExitFn(0, "HandleGetRepTypeDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get RepType data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get RepType data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get RepType data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get RepType data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_rep_type
	query = `SELECT 
		ap.id as record_id, ap.rep_type, ap.description
		FROM ` + db.TableName_rep_type + ` ap`

	filter, whereEleList = PrepareRepTypeFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepType data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get RepType data from DB", http.StatusBadRequest, nil)
		return
	}

	RepTypeList := models.GetRepTypeList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		RepType, ok := item["rep_type"].(string)
		if !ok || RepType == "" {
			log.FuncErrorTrace(0, "Failed to get RepType for Record ID %v. Item: %+v\n", RecordId, item)
			RepType = ""
		}
		Description, ok := item["description"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get permit pay for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		RepTypes := models.GetRepType{
			RecordId:    RecordId,
			Description: Description,
			RepType:     RepType,
		}

		RepTypeList.RepTypeList = append(RepTypeList.RepTypeList, RepTypes)
	}

	filter, whereEleList = PrepareRepTypeFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepType data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get RepType data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of RepType List fetched : %v list %+v", len(RepTypeList.RepTypeList), RepTypeList)
	appserver.FormAndSendHttpResp(resp, "RepType Data", http.StatusOK, RepTypeList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareRepTypeFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareRepTypeFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareRepTypeFilters")
	defer func() { log.ExitFn(0, "PrepareRepTypeFilters", nil) }()

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
			case "rep_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.rep_type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.description) %s LOWER($%d)", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString(" GROUP BY ap.id, ap.rep_type, ap.description")
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
