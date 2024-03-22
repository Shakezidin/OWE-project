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
	SELECT dor.sub_dealer, ud.name, dor.pay_rate, dor.start_date, dor.end_date
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
		SubDealer := item["sub_dealer"].(string)
		Dealer := item["name"].(string)
		PayRate := item["pay_rate"].(string)
		StartDate := item["start_date"].(string)
		EndDate := item["end_date"].(string)

		dealerData := models.GetDealerData{
			SubDealer: SubDealer,
			Dealer:    Dealer,
			PayRate:   PayRate,
			StartDate: StartDate,
			EndDate:   EndDate,
		}

		dealersList.DealersList = append(dealersList.DealersList, dealerData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of dealers List fetched : %v teamlist %+v", len(dealersList.DealersList), dealersList)
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
				filtersBuilder.WriteString(fmt.Sprintf("ud.name %s $%d", filter.Operation, len(whereEleList)+1))
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
