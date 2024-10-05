/**************************************************************************
* File			: 	apiUpdateApPda.go
* DESCRIPTION	: This file contains functions to Update ApPda handler
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
 * FUNCTION:				HandleUpdateApPdaRequest
 * DESCRIPTION:     handler to Update ApPda request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateApPdaRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		UpdateApPdaReq  models.UpdateApPda
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateApPdaRequest")
	defer func() { log.ExitFn(0, "HandleUpdateApPdaRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update ApPda request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update ApPda request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateApPdaReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update ApPda request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateApPdaReq.UniqueId) <= 0) || (len(UpdateApPdaReq.Payee) <= 0) ||
		(len(UpdateApPdaReq.Date) <= 0) ||
		(len(UpdateApPdaReq.Description) <= 0) || (len(UpdateApPdaReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateApPdaReq.AmountOvrd <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", UpdateApPdaReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateApPdaReq.RecordId)
	queryParameters = append(queryParameters, UpdateApPdaReq.UniqueId)
	queryParameters = append(queryParameters, UpdateApPdaReq.Payee)
	queryParameters = append(queryParameters, UpdateApPdaReq.AmountOvrd)
	queryParameters = append(queryParameters, UpdateApPdaReq.ApprovedBy)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, UpdateApPdaReq.Description)
	queryParameters = append(queryParameters, UpdateApPdaReq.Notes)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateApPdaFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApPda in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update ApPda", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApPda Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ApPda Updated Successfully", http.StatusOK, nil)
}
