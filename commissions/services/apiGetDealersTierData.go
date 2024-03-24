/**************************************************************************
 * File       	   : apiGetDealersTierData.go
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
 * FUNCTION:		HandleGetDealersTierDataRequest
 * DESCRIPTION:     handler for get Dealer data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDealersTierDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetDealersTierDataRequest")
	defer func() { log.ExitFn(0, "HandleGetDealersTierDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Dealers Tier data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Dealers Tier data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Dealers Tier data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Dealers Tier data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_dealer_tier
	query = ` 
	SELECT ud.name as dealer_name, tr.tier_name as tier, dt.start_date, dt.end_date
	FROM dealer_tier dt
	JOIN tier tr ON dt.tier_id = tr.id
	JOIN user_details ud ON dt.dealer_id = ud.user_id`

	filter, whereEleList = PrepareDealerTierFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Dealers Tier data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Dealers Tier data from DB", http.StatusBadRequest, nil)
		return
	}

	dealersTierList := models.GetDealersTierList{}

	for _, item := range data {
		DealerName := item["dealer_name"].(string)
		Tier := item["tier"].(string)
		StartDate := item["start_date"].(string)
		EndDate := item["end_date"].(string)

		dealerTierData := models.GetDealerTierData{
			DealerName: DealerName,
			Tier:       Tier,
			StartDate:  StartDate,
			EndDate:    EndDate,
		}

		dealersTierList.DealersTierList = append(dealersTierList.DealersTierList, dealerTierData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of Dealers Tier List fetched : %v teamlist %+v", len(dealersTierList.DealersTierList), dealersTierList)
	FormAndSendHttpResp(resp, "Dealers Tier Data", http.StatusOK, dealersTierList)
}

/******************************************************************************
 * FUNCTION:		PrepareDealerTierFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDealerTierFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDealerFilters")
	defer func() { log.ExitFn(0, "PrepareDealerTierFilters", nil) }()
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
			case "dealer_name":
				filtersBuilder.WriteString(fmt.Sprintf("ud.name %s $%d", filter.Operation, len(whereEleList)+1))
			case "tier":
				filtersBuilder.WriteString(fmt.Sprintf("tr.tier_name %s $%d", filter.Operation, len(whereEleList)+1))
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
