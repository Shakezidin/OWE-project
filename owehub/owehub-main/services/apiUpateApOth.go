/**************************************************************************
* File			: 	apiUpdateApOth.go
* DESCRIPTION	: This file contains functions to Update ApOth handler
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
 * FUNCTION:				HandleUpdateApOthRequest
 * DESCRIPTION:     handler to Update ApOth request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateApOthRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		UpdateApOthReq  models.UpdateApOth
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateApOthRequest")
	defer func() { log.ExitFn(0, "HandleUpdateApOthRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update ApOth request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update ApOth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateApOthReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update ApOth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateApOthReq.UniqueId) <= 0) || (len(UpdateApOthReq.Payee) <= 0) ||
		(len(UpdateApOthReq.Date) <= 0) || (len(UpdateApOthReq.ShortCode) <= 0) ||
		(len(UpdateApOthReq.Description) <= 0) || (len(UpdateApOthReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateApOthReq.Amount <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", UpdateApOthReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateApOthReq.RecordId)
	queryParameters = append(queryParameters, UpdateApOthReq.UniqueId)
	queryParameters = append(queryParameters, UpdateApOthReq.Payee)
	queryParameters = append(queryParameters, UpdateApOthReq.Amount)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, UpdateApOthReq.ShortCode)
	queryParameters = append(queryParameters, UpdateApOthReq.Description)
	queryParameters = append(queryParameters, UpdateApOthReq.Notes)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateApOthFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApOth in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update ApOth", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApOth Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ApOth Updated Successfully", http.StatusOK, nil)
}
