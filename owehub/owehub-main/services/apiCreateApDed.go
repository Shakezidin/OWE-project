/**************************************************************************
* File			: 	apiCreateApDed.go
* DESCRIPTION	: This file contains functions to create ApDed handler
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
 * FUNCTION:				HandleCreateApDedRequest
 * DESCRIPTION:     handler to create ApDed request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateApDedRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createApDedReq  models.CreateApDed
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateApDedRequest")
	defer func() { log.ExitFn(0, "HandleCreateApDedRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create ApDed request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create ApDed request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createApDedReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create ApDed request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createApDedReq.UniqueId) <= 0) || (len(createApDedReq.Payee) <= 0) ||
		(len(createApDedReq.Date) <= 0) || (len(createApDedReq.ShortCode) <= 0) ||
		(len(createApDedReq.Description) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createApDedReq.Amount <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", createApDedReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createApDedReq.UniqueId)
	queryParameters = append(queryParameters, createApDedReq.Payee)
	queryParameters = append(queryParameters, createApDedReq.Amount)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createApDedReq.ShortCode)
	queryParameters = append(queryParameters, createApDedReq.Description)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateApDedFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApDed in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create ApDed", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApDed created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ApDed Created Successfully", http.StatusOK, nil)
}
