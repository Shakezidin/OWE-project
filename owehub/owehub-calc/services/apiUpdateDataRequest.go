/**************************************************************************
* File			: apiUpdateDataRequest.go
* DESCRIPTION	: This file contains functions for Update data handler
* DATE			: 01-Apr-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	"OWEApp/shared/inmemory"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		UpdateData
 * DESCRIPTION:     handler for CDV data update request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func UpdateData(resp http.ResponseWriter, req *http.Request) {
	var (
		err      error
		logEntry models.UpdateDataReq
		dataMap  map[string]interface{}
	)

	log.EnterFn(0, "UpdateData")
	defer func() { log.ExitFn(0, "UpdateData", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in UpdateData request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from UpdateData request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// Log the raw request body for debugging
	log.FuncDebugTrace(0, "CdvUpdate Raw HTTP Request body: %s", string(reqBody))

	err = json.Unmarshal(reqBody, &logEntry)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal CdvUpdate request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal CdvUpdate request", http.StatusBadRequest, nil)
		return
	}

	// Log the parsed CDVUpdateReq for debugging
	log.FuncDebugTrace(0, "Parsed CDVUpdateReq: HookType %v UniqueId %v Data %v", logEntry.HookType, logEntry.UniqueId, logEntry.Data)

	// Parse the dataString field separately
	if err := json.Unmarshal([]byte(logEntry.Data), &dataMap); err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal dataString field: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal dataString field", http.StatusBadRequest, nil)
		return
	}

	// Log the parsed dataMap for debugging
	log.FuncDebugTrace(0, "Parsed Data Map: %v", dataMap)

	// Retrieve database connection
	sqliteDB, err := db.GetDBConnection(db.InMemDbIndex, "inmemory_db")
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get DB connection with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get DB connection", http.StatusInternalServerError, nil)
		return
	}

	inmemory.ReadFromLogAndWrite(sqliteDB.CtxH, logEntry, dataMap)
}
