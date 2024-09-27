/**************************************************************************
* File			: 	apiCreateApPda.go
* DESCRIPTION	: This file contains functions to create ApPda handler
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
 * FUNCTION:				HandleCreateApPdaRequest
 * DESCRIPTION:     handler to create ApPda request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateApPdaRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createApPdaReq  models.CreateApPda
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateApPdaRequest")
	defer func() { log.ExitFn(0, "HandleCreateApPdaRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create ApPda request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create ApPda request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createApPdaReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create ApPda request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createApPdaReq.UniqueId) <= 0) || (len(createApPdaReq.Payee) <= 0) ||
		(len(createApPdaReq.Date) <= 0) ||
		(len(createApPdaReq.Description) <= 0) || (len(createApPdaReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createApPdaReq.AmountOvrd <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", createApPdaReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createApPdaReq.UniqueId)
	queryParameters = append(queryParameters, createApPdaReq.Payee)
	queryParameters = append(queryParameters, createApPdaReq.AmountOvrd)
	queryParameters = append(queryParameters, createApPdaReq.ApprovedBy)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createApPdaReq.Description)
	queryParameters = append(queryParameters, createApPdaReq.Notes)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateApPdaFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApPda in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create ApPda", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApPda created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ApPda Created Successfully", http.StatusOK, nil)
}
