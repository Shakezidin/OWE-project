/**************************************************************************
 * File       	   : apiGetMilestoneData.go
 * DESCRIPTION     : This file contains functions for get mile stone data handler
 * DATE            : 01-Nov-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetLeaderBoardDataRequest
 * DESCRIPTION:     handler for get LeaderBoard data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetMilestoneCsvDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetMilestoneDataReq
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "HandleGetMilestoneDataRequest")
	defer func() { log.ExitFn(0, "HandleGetMilestoneDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get milestone data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get milestone data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get milestone data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get milestone data Request body", http.StatusBadRequest, nil)
		return
	}

	csFilter, whereEleList := PrepareMilestoneDataFilters(dataReq, "customer")

	query = fmt.Sprintf(`SELECT sale_date,customer_name, unique_id FROM customers_customers_schema %s`, csFilter)

	val1, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	data = append(data, val1...)

	csFilter, whereEleList = PrepareMilestoneDataFilters(dataReq, "ntp")

	query = fmt.Sprintf(`SELECT ntp_complete_date,unique_id,customer as customer_name FROM ntp_ntp_schema %s`, csFilter)

	val2, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	data = append(data, val2...)

	csFilter, whereEleList = PrepareMilestoneDataFilters(dataReq, "pv_install_install_subcontracting_schema")

	query = fmt.Sprintf(`SELECT pv_completion_date,customer_unique_id as unique_id, customer as customer_name FROM pv_install_install_subcontracting_schema %s`, csFilter)

	val3, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	data = append(data, val3...)

	result := make(map[string]map[string]interface{})

	for _, item := range data {
		// Extract values from each item
		uniqueId, ok := item["unique_id"].(string)
		if !ok || uniqueId == "" {
			continue
		}

		// Initialize the map for unique_id if it doesn't exist yet
		if _, exists := result[uniqueId]; !exists {
			result[uniqueId] = make(map[string]interface{})
		}

		// Extract other values from the item
		if saleDate, ok := item["sale_date"].(time.Time); ok {
			result[uniqueId]["sale_date"] = saleDate
		}
		if ntpDate, ok := item["ntp_complete_date"].(time.Time); ok {
			result[uniqueId]["ntp_date"] = ntpDate
		}
		if installDate, ok := item["pv_completion_date"].(time.Time); ok {
			result[uniqueId]["install_date"] = installDate
		}
		if customerName, ok := item["customer_name"].(string); ok {
			result[uniqueId]["customer_name"] = customerName
		}
	}

	// If you need to send a response
	appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, result)

}
