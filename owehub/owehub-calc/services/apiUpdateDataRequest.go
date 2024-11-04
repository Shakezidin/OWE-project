/**************************************************************************
* File			: apiUpdateDataRequest.go
* DESCRIPTION	: This file contains functions for Update data handler
* DATE			: 01-Apr-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateDataRequest
 * DESCRIPTION:     handler for CDV data update request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err      error
		logEntry models.UpdateDataReq
		// dataMap  map[string]interface{}
	)

	log.EnterFn(0, "HandleUpdateDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDataRequest", err) }()

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

	err = json.Unmarshal(reqBody, &logEntry)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal CdvUpdate request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal CdvUpdate request", http.StatusBadRequest, nil)
		return
	}

	// Log the parsed CDVUpdateReq for debugging
	log.FuncDebugTrace(0, "Parsed DataUpdateReq: HookType %v UniqueId %v Data %v", logEntry.HookType, logEntry.UniqueId, logEntry.Data)

	// // Parse the dataString field separately
	// if err := json.Unmarshal([]byte(logEntry.Data), &dataMap); err != nil {
	// 	log.FuncErrorTrace(0, "Failed to unmarshal dataString field: %v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Failed to unmarshal dataString field", http.StatusBadRequest, nil)
	// 	return
	// }

	if logEntry.HookType == "delete" {
		DeleteFromDealerPay([]string{logEntry.UniqueId})
	} else {
		ExecDlrPayInitialCalculation(logEntry.UniqueId, logEntry.HookType)
	}
}
