package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetAgingReport
 * DESCRIPTION:     handler for get Aging Report data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAgingReport(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.AgingReport
	)

	log.EnterFn(0, "HandleGetAgingReport")

	defer func() { log.ExitFn(0, "HandleGetAgingReport", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get AgingReport data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get AgingReport data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get AgingReport data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get AgingReport data Request body", http.StatusBadRequest, nil)
		return
	}

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, "query", []interface{}{})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AgingReport data from db err: %v", err)
		appserver.FormAndSendHttpResp(resp, "", http.StatusInternalServerError, nil)
	}

	log.FuncInfoTrace(0, "Aging Report fetched:  %v", data)
	appserver.FormAndSendHttpResp(resp, "Aging Report Data", http.StatusOK, data)
}
