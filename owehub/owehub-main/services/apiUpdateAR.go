/**************************************************************************
* File			: apiUpdateAr.go
* DESCRIPTION	: This file contains functions for Update Ar handler
* DATE			: 01-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateARDataRequest
 * DESCRIPTION:     handler for Update Ar request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateARDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		UpdateArReq     models.UpdateAR
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateArDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateArDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in rpdate Ar request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Ar request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateArReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Ar request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update Ar request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateArReq.UniqueId) <= 0) || (len(UpdateArReq.PaymentType) <= 0) ||
		(len(UpdateArReq.Date) <= 0) || (len(UpdateArReq.Bank) <= 0) ||
		(len(UpdateArReq.Ced) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateArReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateArReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid Amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	date, err := time.Parse("2006-01-02", UpdateArReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse time date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse time date", http.StatusInternalServerError, nil)
		return
	}

	cedDate, err := time.Parse("2006-01-02", UpdateArReq.Ced)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse time cedDate: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse time cedDate", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateArReq.RecordId)
	queryParameters = append(queryParameters, UpdateArReq.UniqueId)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, UpdateArReq.Amount)
	queryParameters = append(queryParameters, UpdateArReq.PaymentType)
	queryParameters = append(queryParameters, UpdateArReq.Bank)
	queryParameters = append(queryParameters, cedDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateArFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update Ar in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update Ar", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Ar updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Ar Updated Successfully", http.StatusOK, nil)
}
