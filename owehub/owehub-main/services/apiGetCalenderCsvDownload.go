/**************************************************************************
 * File       	   : apiGetPaindingQueueTileData.go
 * DESCRIPTION     : This file contains functions for get pendig queue tile data handler
 * DATE            : 04-Sep-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"io/ioutil"

	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetCalenderCsvDownloadRequest
 * DESCRIPTION:     handler for get pending queue data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetCalenderCsvDownloadRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.GetCalenderDataReq
		data           []map[string]interface{}
		whereEleList   []interface{}
		queryWithFiler string
		filter         string
		RecordCount    int64
	)

	log.EnterFn(0, "HandleGetCalenderCsvDownloadRequest")
	defer func() { log.ExitFn(0, "HandleGetCalenderCsvDownloadRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get calender csv download data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get calender csv download data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get calender csv download data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get calender csv download data Request body", http.StatusBadRequest, nil)
		return
	}

	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role, ok := data[0]["role_name"].(string)
		if !ok || role == "" {
			role = ""
		}
		name := data[0]["name"].(string)
		if !ok || name == "" {
			name = ""
		}
		dataReq.Name = name
		dataReq.Role = role
	}

	if dataReq.Name == "" {
		log.FuncErrorTrace(0, "Failed to get calender csv download data  user not exist as sales rep")
		FormAndSendHttpResp(resp, "Failed to get calender csv download data  user not exist as sales rep", http.StatusBadRequest, nil)
		return
	}
	// change table name here
	tableName := db.ViewName_ConsolidatedDataView
	whereEleList = nil

	query := models.CsvDownloadRetrieveQueryFunc()

	query += fmt.Sprintf("where primary_sales_rep = '%v'", dataReq.Name)

	filter, whereEleList = PrepareCalenderFilters(tableName, dataReq, true)

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get calender csv download data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get calender csv download data", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))

	log.FuncInfoTrace(0, "Number of calender csv download List fetched : %v list %+v", 1, data)
	FormAndSendHttpResp(resp, "calender csv download Data", http.StatusOK, data, RecordCount)
}
