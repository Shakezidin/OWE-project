/**************************************************************************
* File			: 	apiUpdateApAdv.go
* DESCRIPTION	: This file contains functions to Update ApAdv handler
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
 * FUNCTION:				HandleUpdateApAdvRequest
 * DESCRIPTION:     handler to Update ApAdv request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateApAdvRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		UpdateApAdvReq  models.UpdateApAdv
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateApAdvRequest")
	defer func() { log.ExitFn(0, "HandleUpdateApAdvRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update ApAdv request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update ApAdv request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateApAdvReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update ApAdv request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateApAdvReq.UniqueId) <= 0) || (len(UpdateApAdvReq.Payee) <= 0) ||
		(len(UpdateApAdvReq.Date) <= 0) || (len(UpdateApAdvReq.ApprovedBy) <= 0) ||
		(len(UpdateApAdvReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateApAdvReq.AmountOvrd <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", UpdateApAdvReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateApAdvReq.RecordId)
	queryParameters = append(queryParameters, UpdateApAdvReq.UniqueId)
	queryParameters = append(queryParameters, UpdateApAdvReq.Payee)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, UpdateApAdvReq.AmountOvrd)
	queryParameters = append(queryParameters, UpdateApAdvReq.ApprovedBy)
	queryParameters = append(queryParameters, UpdateApAdvReq.Notes)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateApAdvFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApAdv in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update ApAdv", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApAdv Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ApAdv Updated Successfully", http.StatusOK, nil)
}
