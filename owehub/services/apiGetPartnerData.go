/**************************************************************************
 * File       	   : apiGetPartnerData.go
 * DESCRIPTION     : This file contains functions for get partner type data handler
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
 * FUNCTION:		HandleGetPartnerDataRequest
 * DESCRIPTION:     handler for get partner data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetPartnerDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetPartnerDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPartnerDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get partner data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get partner data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get partner data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get partner data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_partners
	query = `
	SELECT ptr.partner_name, ptr.description
	FROM partners ptr`

	filter, whereEleList = PreparePartnerFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get partner data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get partner data from DB", http.StatusBadRequest, nil)
		return
	}

	partnerList := models.GetPartnerList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		PartnerName, Ok := item["partner_name"].(string)
		if !Ok || PartnerName == "" {
			PartnerName = ""
		}

		Description, descOk := item["description"].(string)
		if !descOk || Description == "" {
			Description = ""
		}

		// Create a new GetSaleTypeData object
		partnerData := models.GetPartnerData{
			PartnerName: PartnerName,
			Description: Description,
		}

		partnerList.PartnersList = append(partnerList.PartnersList, partnerData)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of partner List fetched : %v list %+v", len(partnerList.PartnersList), partnerList)
	FormAndSendHttpResp(resp, "Partner Data", http.StatusOK, partnerList)
}

/******************************************************************************
 * FUNCTION:		PreparePartnerFilters
 * DESCRIPTION:     handler for create select query
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PreparePartnerFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareFilters")
	defer func() { log.ExitFn(0, "PrepareFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Flag to track if WHERE clause has been added

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true // Set flag to true as WHERE clause is added

		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

			// Check if the column is a foreign key
			column := filter.Column

			// Determine the operator and value based on the filter operation
			operator := GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			// For "stw" and "edw" operations, modify the value with '%'
			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}
			// Build the filter condition using correct db column name
			filtersBuilder.WriteString("LOWER(")
			filtersBuilder.WriteString(column)
			filtersBuilder.WriteString(") ")
			filtersBuilder.WriteString(operator)
			filtersBuilder.WriteString(" LOWER($")
			filtersBuilder.WriteString(fmt.Sprintf("%d", len(whereEleList)+1))
			filtersBuilder.WriteString(")")
			whereEleList = append(whereEleList, value)
		}
	}

	// Handle the Archived field
	if dataFilter.Archived {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ptr.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ptr.is_archived = FALSE")
	}

	// Add pagination
	if (dataFilter.PageSize > 0) && (dataFilter.PageNumber > 0) {
		filtersBuilder.WriteString(fmt.Sprintf(" LIMIT %d OFFSET %d", dataFilter.PageSize, (dataFilter.PageNumber-1)*dataFilter.PageSize))
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filtersBuilder.String())
	return filters, whereEleList
}
