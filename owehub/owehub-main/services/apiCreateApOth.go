/**************************************************************************
* File			: 	apiCreateApOth.go
* DESCRIPTION	: This file contains functions to create ApOth handler
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
 * FUNCTION:				HandleCreateApOthRequest
 * DESCRIPTION:     handler to create ApOth request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateApOthRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createApOthReq  models.CreateApOth
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateApOthRequest")
	defer func() { log.ExitFn(0, "HandleCreateApOthRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create ApOth request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create ApOth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createApOthReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create ApOth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createApOthReq.UniqueId) <= 0) || (len(createApOthReq.Payee) <= 0) ||
		(len(createApOthReq.Date) <= 0) || (len(createApOthReq.ShortCode) <= 0) ||
		(len(createApOthReq.Description) <= 0) || (len(createApOthReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createApOthReq.Amount <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", createApOthReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createApOthReq.UniqueId)
	queryParameters = append(queryParameters, createApOthReq.Payee)
	queryParameters = append(queryParameters, createApOthReq.Amount)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createApOthReq.ShortCode)
	queryParameters = append(queryParameters, createApOthReq.Description)
	queryParameters = append(queryParameters, createApOthReq.Notes)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateApOthFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApOth in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create ApOth", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApOth created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ApOth Created Successfully", http.StatusOK, nil)
}
