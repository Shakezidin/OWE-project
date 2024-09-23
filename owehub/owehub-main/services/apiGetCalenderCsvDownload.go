/**************************************************************************
 * File       	   : apiGetPaindingQueueTileData.go
 * DESCRIPTION     : This file contains functions for get pendig queue tile data handler
 * DATE            : 04-Sep-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
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
		SaleRepList    []interface{}
	)

	log.EnterFn(0, "HandleGetCalenderCsvDownloadRequest")
	defer func() { log.ExitFn(0, "HandleGetCalenderCsvDownloadRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get calender csv download data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get calender csv download data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get calender csv download data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get calender csv download data Request body", http.StatusBadRequest, nil)
		return
	}

	dataReq.Role = req.Context().Value("rolename").(string)
	if dataReq.Role == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	saleRepNameQuery := fmt.Sprintf("SELECT name FROM user_details where email_id = '%v'", dataReq.Email)
	query := models.CsvDownloadRetrieveQueryFunc()

	log.FuncErrorTrace(0, "roleee = %v", dataReq.Role)
	if dataReq.Role != string(types.RoleAdmin) && dataReq.Role != string(types.RoleFinAdmin) {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, saleRepNameQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get pending queue tile data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get pending queue tile data", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			name, ok := data[0]["name"].(string)
			if !ok || name == "" {
				name = ""
			}
			SaleRepList = append(SaleRepList, name)
		}
	}

	tableName := db.ViewName_ConsolidatedDataView

	filter, whereEleList = PrepareCalenderFilters(tableName, dataReq, SaleRepList)

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		queryWithFiler = query
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get calender csv download data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get calender csv download data", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))

	log.FuncInfoTrace(0, "Number of calender csv download List fetched : %v list %+v", 1, data)
	appserver.FormAndSendHttpResp(resp, "calender csv download Data", http.StatusOK, data, RecordCount)
}
