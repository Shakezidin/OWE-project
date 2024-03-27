/**************************************************************************
 * File       	   : apiGetMarketingFeeData.go
 * DESCRIPTION     : This file contains functions for get Marketing Fee data handler
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
 * FUNCTION:		HandleGetMarketingFeesDataRequest
 * DESCRIPTION:     handler for get marketing fee data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetMarketingFeesDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetMarketingFeesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetMarketingFeesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Marketing fee data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Marketing fee data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Marketing fee data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Marketing fee data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_marketing_fees
	query = `
	SELECT mf.dba, mf.fee_rate, mf.chg_dlr, mf.pay_src, mf.start_date, mf.end_date, mf.description, st.name as state_name, sr.name as source_name
	FROM marketing_fees mf
	JOIN states st ON st.state_id = mf.state_id
	JOIN source sr ON sr.id = mf.source_id`

	filter, whereEleList = PrepareMarketingFeesFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Marketing fee data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Marketing fee data from DB", http.StatusBadRequest, nil)
		return
	}

	marketingFeesList := models.GetMarketingFeesList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		Source, ok := item["source_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get source name. Item: %+v\n", item)
			continue
		}

		Dba, ok := item["dba"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get dba. Item: %+v\n", item)
			continue
		}

		State, ok := item["state_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get state name. Item: %+v\n", item)
			continue
		}

		FeeRate, ok := item["fee_rate"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get fee rate. Item: %+v\n", item)
			continue
		}

		ChgDlrVal, ok := item["chg_dlr"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get chg_dlr. Item: %+v\n", item)
			continue
		}
		ChgDlr := int(ChgDlrVal)

		PaySrcVal, ok := item["pay_src"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get pay_src. Item: %+v\n", item)
			continue
		}
		PaySrc := int(PaySrcVal)

		StartDate, ok := item["start_date"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get start date. Item: %+v\n", item)
			continue
		}

		EndDate, ok := item["end_date"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get end date. Item: %+v\n", item)
			continue
		}

		Description, ok := item["description"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get description. Item: %+v\n", item)
			continue
		}

		// Create a new GetMarketingFeesData object
		marketingFeesData := models.GetMarketingFeesData{
			Source:      Source,
			Dba:         Dba,
			State:       State,
			FeeRate:     FeeRate,
			ChgDlr:      ChgDlr,
			PaySrc:      PaySrc,
			Description: Description,
			StartDate:   StartDate,
			EndDate:     EndDate,
		}

		// Append the new marketingFeesData to the marketingFeesList
		marketingFeesList.MarketingFeesList = append(marketingFeesList.MarketingFeesList, marketingFeesData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of Marketing fee List fetched : %v list %+v", len(marketingFeesList.MarketingFeesList), marketingFeesList)
	FormAndSendHttpResp(resp, "Marketing fee Data", http.StatusOK, marketingFeesList)
}

/******************************************************************************
 * FUNCTION:		PrepareMarketingFeesFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareMarketingFeesFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareMarketingFeesFilters")
	defer func() { log.ExitFn(0, "PrepareMarketingFeesFilters", nil) }()
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
			case "source":
				filtersBuilder.WriteString(fmt.Sprintf("sr.name %s $%d", filter.Operation, len(whereEleList)+1))
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
