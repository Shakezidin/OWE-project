/**************************************************************************
 * File       	   : apiGetApPdaData.go
 * DESCRIPTION     : This file contains functions for get ApPda data handler
 * DATE            : 24-Jun-2024
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
* FUNCTION:		HandleGetApPdaDataRequest
* DESCRIPTION:     handler for get ApPda data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetApPdaDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetApPdaDataRequest")
	defer func() { log.ExitFn(0, "HandleGetApPdaDataRequest", err) }()

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

	tableName := db.TableName_ap_pda
	query = `SELECT 
		ap.id as record_id, ap.unique_id, ap.payee, ap.customer, ap.amount_ovrd, ap.date, ap.customer, ap.approved_by, ap.notes, vd.dealer_code as dealer, ap.description
		FROM ` + db.TableName_ap_pda +
		` ap LEFT JOIN v_dealer vd ON vd.id = ap.dealer_id`

	filter, whereEleList = PrepareApPdaFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ar schedule data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get ar schedule data from DB", http.StatusBadRequest, nil)
		return
	}

	ApPdaList := models.GetApPdaList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}
		Dealer, ok := item["dealer"].(string)
		if !ok || Dealer == "" {
			log.FuncErrorTrace(0, "Failed to get Dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer = ""
		}
		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			log.FuncErrorTrace(0, "Failed to get Dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}
		Payee, ok := item["payee"].(string)
		if !ok || Payee == "" {
			log.FuncErrorTrace(0, "Failed to get Payee name for Record ID %v. Item: %+v\n", RecordId, item)
			Payee = ""
		}
		AmountOvrd, ok := item["amount_ovrd"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Amount for Record ID %v. Item: %+v\n", RecordId, item)
			AmountOvrd = 0
		}
		Date, ok := item["date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}
		ApprovedBy, ok := item["approved_by"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get permit pay for Record ID %v. Item: %+v\n", RecordId, item)
			ApprovedBy = ""
		}
		Notes, ok := item["notes"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get permit max for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}
		Description, ok := item["description"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get permit max for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		date := Date.Format("2006-01-02")

		ApPda := models.GetApPda{
			RecordId:    RecordId,
			UniqueId:    UniqueId,
			Dealer:      Dealer,
			Customer:    Customer,
			Payee:       Payee,
			ApprovedBy:  ApprovedBy,
			Notes:       Notes,
			Date:        date,
			AmountOvrd:  AmountOvrd,
			Description: Description,
		}

		ApPdaList.ApPdaList = append(ApPdaList.ApPdaList, ApPda)
	}

	filter, whereEleList = PrepareApPdaFilters(tableName, dataReq, true)
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
	log.FuncInfoTrace(0, "Number of ar schedule List fetched : %v list %+v", len(ApPdaList.ApPdaList), ApPdaList)
	appserver.FormAndSendHttpResp(resp, "Ar Schedule Data", http.StatusOK, ApPdaList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareApPdaFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareApPdaFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareApPdaFilters")
	defer func() { log.ExitFn(0, "PrepareApPdaFilters", nil) }()

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
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "payee":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.payee) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount_ovrd":
				filtersBuilder.WriteString(fmt.Sprintf("ap.amount_ovrd %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "approved_by":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.approved_by) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "date":
				filtersBuilder.WriteString(fmt.Sprintf("ap.date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ap.notes) %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_code) %s LOWER($%d)", operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString(" GROUP BY ap.id, ap.unique_id, ap.payee, ap.customer, ap.amount_ovrd, ap.date, ap.customer, ap.approved_by, ap.notes, vd.dealer_code, ap.description")
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
