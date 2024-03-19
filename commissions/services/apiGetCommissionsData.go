/**************************************************************************
 * File       	   : apiGetCommissionsData.go
 * DESCRIPTION     : This file contains functions for get commissions data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"
	"strconv"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleCreateTeamRequest
 * DESCRIPTION:     handler for  get teams datarequest
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetCommissionsDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetCommissionsDataRequest")
	defer func() { log.ExitFn(0, "HandleGetCommissionsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Commissions data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get commissions data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get commissions data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get commissions data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_commission_rates
	query = `
	SELECT pt1.partner_name, pt2.partner_name, st.name, sl.type_name, cr.sale_price, cr.rep_type, cr.rl, cr.rate, cr.start_date, cr.end_date
	FROM commission_rates cr
	JOIN states st ON st.state_id = cr.state_id
	JOIN partners pt1 ON pt1.partner_id = cr.partner_id
	JOIN partners pt2 ON pt2.partner_id = cr.installer_id
	JOIN sale_type sl ON sl.id = cr.sale_type_id
	JOIN rep_type rp ON rp.id = cr.rep_type`

	filter, whereEleList = PrepareCommissionFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get commissions data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get commissions data from DB", http.StatusBadRequest, nil)
		return
	}

	commissionsList := models.GetCommissionsList{}

	for _, item := range data {
		Partner := item["partner"].(string)
		Installer := item["installer"].(string)
		State := item["state"].(string)
		SaleType := item["sale_type"].(string)
		SalePrice, _ := strconv.ParseFloat(item["sale_price"].(string), 64)
		RepType := item["rep_type"].(string)
		RL, _ := strconv.ParseFloat(item["rl"].(string), 64)
		Rate, _ := strconv.ParseFloat(item["rate"].(string), 64)
		StartDate := item["start_date"].(string)
		EndDate := item["end_date"].(string)

		commissionData := models.GetCommissionData{
			Partner:   Partner,
			Installer: Installer,
			State:     State,
			SaleType:  SaleType,
			SalePrice: SalePrice,
			RepType:   RepType,
			RL:        RL,
			Rate:      Rate,
			StartDate: StartDate,
			EndDate:   EndDate,
		}

		commissionsList.CommissionsList = append(commissionsList.CommissionsList, commissionData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of commissions List fetched : %v teamlist %+v", len(commissionsList.CommissionsList), commissionsList)
	FormAndSendHttpResp(resp, "commissions data", http.StatusOK, commissionsList)
}

/******************************************************************************
 * FUNCTION:		PrepareCommissionFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareCommissionFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareCommissionFilters")
	defer func() { log.ExitFn(0, "PrepareCommissionFilters", nil) }()
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
			case "partner", "installer":
				filtersBuilder.WriteString(fmt.Sprintf("pt1.partner_name %s $%d", filter.Operation, len(whereEleList)+1))
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("st.names %s $%d", filter.Operation, len(whereEleList)+1))
			case "sale_type":
				filtersBuilder.WriteString(fmt.Sprintf("sl.type_name %s $%d", filter.Operation, len(whereEleList)+1))
			case "rep_type":
				filtersBuilder.WriteString(fmt.Sprintf("rp.rep_type %s $%d", filter.Operation, len(whereEleList)+1))
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
