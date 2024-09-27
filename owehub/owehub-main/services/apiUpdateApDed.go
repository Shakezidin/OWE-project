/**************************************************************************
* File			: 	apiUpdateApDed.go
* DESCRIPTION	: This file contains functions to Update ApDed handler
* DATE			: 	21-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"io"
	"time"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:				HandleUpdateApDedRequest
 * DESCRIPTION:     handler to Update ApDed request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateApDedRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		UpdateApDedReq  models.UpdateApDed
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateApDedRequest")
	defer func() { log.ExitFn(0, "HandleUpdateApDedRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update ApDed request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update ApDed request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateApDedReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update ApDed request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateApDedReq.UniqueId) <= 0) || (len(UpdateApDedReq.Payee) <= 0) ||
		(len(UpdateApDedReq.Date) <= 0) || (len(UpdateApDedReq.ShortCode) <= 0) ||
		(len(UpdateApDedReq.Description) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateApDedReq.Amount <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", UpdateApDedReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateApDedReq.RecordId)
	queryParameters = append(queryParameters, UpdateApDedReq.UniqueId)
	queryParameters = append(queryParameters, UpdateApDedReq.Payee)
	queryParameters = append(queryParameters, UpdateApDedReq.Amount)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, UpdateApDedReq.ShortCode)
	queryParameters = append(queryParameters, UpdateApDedReq.Description)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateApDedFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApDed in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update ApDed", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApDed Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ApDed Updated Successfully", http.StatusOK, nil)
}
