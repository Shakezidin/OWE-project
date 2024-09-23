/**************************************************************************
 * File       	   : apiGetRepIncentData.go
 * DESCRIPTION     : This file contains functions for get RepIncent data handler
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
* FUNCTION:		HandleGetRepIncentDataRequest
* DESCRIPTION:     handler for get RepIncent data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetRepIncentDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetRepIncentDataRequest")
	defer func() { log.ExitFn(0, "HandleGetRepIncentDataRequest", err) }()

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

	tableName := db.TableName_rep_incent
	query = `SELECT 
		ap.id as record_id, ap.name, ap.doll_div_kw, ap.month, ap.comment
		FROM ` + db.TableName_rep_incent + ` ap`

	filter, whereEleList = PrepareRepIncentFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepStatus data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get RepStatus data from DB", http.StatusBadRequest, nil)
		return
	}

	RepIncentList := models.GetRepIncentList{}

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
		Month, ok := item["month"].(string)
		if !ok || Month == "" {
			log.FuncErrorTrace(0, "Failed to get month for Record ID %v. Item: %+v\n", RecordId, item)
			Month = ""
		}
		Comment, ok := item["comment"].(string)
		if !ok || Comment == "" {
			log.FuncErrorTrace(0, "Failed to get comment for Record ID %v. Item: %+v\n", RecordId, item)
			Comment = ""
		}
		DollDivKw, ok := item["doll_div_kw"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get DollDivKw for Record ID %v. Item: %+v\n", RecordId, item)
			DollDivKw = 0
		}

		RepIncent := models.GetRepIncent{
			RecordId:  RecordId,
			DollDivKw: DollDivKw,
			Month:     Month,
			Comment:   Comment,
			Name:      Name,
		}

		RepIncentList.RepIncentList = append(RepIncentList.RepIncentList, RepIncent)
	}

	filter, whereEleList = PrepareRepIncentFilters(tableName, dataReq, true)
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
	log.FuncInfoTrace(0, "Number of RepStatus List fetched : %v list %+v", len(RepIncentList.RepIncentList), RepIncentList)
	appserver.FormAndSendHttpResp(resp, "RepStatus Data", http.StatusOK, RepIncentList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareRepIncentFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareRepIncentFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareRepIncentFilters")
	defer func() { log.ExitFn(0, "PrepareRepIncentFilters", nil) }()

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
			case "month":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.month) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "doll_div_kw":
				filtersBuilder.WriteString(fmt.Sprintf("ap.doll_div_kw %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "comment":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.comment) %s LOWER($%d)", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString(" GROUP BY ap.id, ap.name, ap.doll_div_kw, ap.month, ap.comment")
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
