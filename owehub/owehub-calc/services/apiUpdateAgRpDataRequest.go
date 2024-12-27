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
 * FUNCTION:		HandleUpdateAgRpDataRequest
 * DESCRIPTION:     handler for AG Rp data update request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateAgRpDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err      error
		logEntry models.UpdateDataReq
	)

	log.EnterFn(0, "HandleUpdateAgRpDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAgRpDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in UpdateData request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from UpdateAgRpDataRequest request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &logEntry)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal AgRp Update request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal AgRp Update request", http.StatusBadRequest, nil)
		return
	}

	if logEntry.UniqueId == "" {
		log.FuncErrorTrace(0, "uniqueId is nil")
		return
	} else if logEntry.HookType == "" {
		log.FuncErrorTrace(0, "hookType is nil")
		return
	}

	log.FuncDebugTrace(0, "Parsed AgRpDataUpdateReq: HookType %v UniqueId %v Data %v", logEntry.HookType, logEntry.UniqueId, logEntry.Data)

	if logEntry.HookType == "delete" {
		DeleteFromAgRp([]string{logEntry.UniqueId})
	} else {
		ExecAgingReportInitialCalculation(logEntry.UniqueId, logEntry.HookType)

	}
}
