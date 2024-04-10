/**************************************************************************
 * File       	   : apiGetDealersData.go
 * DESCRIPTION     : This file contains functions for get Dealers data handler
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
 * FUNCTION:		HandleGetDealersDataRequest
 * DESCRIPTION:     handler for get Dealer data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDealersDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetDealersDataRequest")
	defer func() { log.ExitFn(0, "HandleGetDealersDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Dealers data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealers data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealers data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get dealers data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_dealer_override
	query = `
	SELECT dor.id as record_id, dor.sub_dealer, ud.name, dor.pay_rate, dor.start_date, dor.end_date
	FROM dealer_override dor
	JOIN user_details ud ON ud.user_id = dor.dealer_id`

	filter, whereEleList = PrepareDealerFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealers data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get dealers data from DB", http.StatusBadRequest, nil)
		return
	}

	dealersList := models.GetDealersList{}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// SubDealer
		SubDealer, ok := item["sub_dealer"].(string)
		if !ok || SubDealer == "" {
			log.FuncErrorTrace(0, "Failed to get sub dealer for Record ID %v. Item: %+v\n", RecordId, item)
			SubDealer = ""
		}

		// Dealer
		Dealer, ok := item["name"].(string)
		if !ok || Dealer == "" {
			log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer = ""
		}

		// PayRate
		PayRate, ok := item["pay_rate"].(string)
		if !ok || PayRate == "" {
			log.FuncErrorTrace(0, "Failed to get pay rate for Record ID %v. Item: %+v\n", RecordId, item)
			PayRate = ""
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		dealerData := models.GetDealerData{
			RecordId:  RecordId,
			SubDealer: SubDealer,
			Dealer:    Dealer,
			PayRate:   PayRate,
			StartDate: StartDate,
			EndDate:   EndDate,
		}

		dealersList.DealersList = append(dealersList.DealersList, dealerData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of dealers List fetched : %v list %+v", len(dealersList.DealersList), dealersList)
	FormAndSendHttpResp(resp, "dealers Data", http.StatusOK, dealersList)
}

/******************************************************************************
 * FUNCTION:		PrepareDealerFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDealerFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDealerFilters")
	defer func() { log.ExitFn(0, "PrepareDealerFilters", nil) }()
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
			case "dealer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			default:
				// For other columns, handle them accordingly
				if len(filtersBuilder.String()) > len(" WHERE ") {
					filtersBuilder.WriteString(" AND ")
				}
				// Assuming other columns need no change, just appending
				filtersBuilder.WriteString("LOWER(")
				filtersBuilder.WriteString(filter.Column)
				filtersBuilder.WriteString(") ")
				filtersBuilder.WriteString(filter.Operation)
				filtersBuilder.WriteString(" LOWER($")
				filtersBuilder.WriteString(fmt.Sprintf("%d", len(whereEleList)+1))
				filtersBuilder.WriteString(")")
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			}
		}
	}
	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
