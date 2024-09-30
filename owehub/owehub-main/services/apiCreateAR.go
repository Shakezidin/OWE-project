/**************************************************************************
* File			: apiCreateAr.go
* DESCRIPTION	: This file contains functions for create Ar handler
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
 * FUNCTION:		HandleCreateARDataRequest
 * DESCRIPTION:     handler for create Ar request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateARDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createArReq     models.CreateARReq
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateArDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateArDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create Ar request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Ar request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createArReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Ar request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Ar request", http.StatusBadRequest, nil)
		return
	}

	if (len(createArReq.UniqueId) <= 0) || (len(createArReq.PaymentType) <= 0) ||
		(len(createArReq.Date) <= 0) || (len(createArReq.Bank) <= 0) ||
		(len(createArReq.Ced) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createArReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid Amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	date, err := time.Parse("2006-01-02", createArReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse time date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse time date", http.StatusInternalServerError, nil)
		return
	}

	cedDate, err := time.Parse("2006-01-02", createArReq.Ced)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse time cedDate: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse time cedDate", http.StatusInternalServerError, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createArReq.UniqueId)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createArReq.Amount)
	queryParameters = append(queryParameters, createArReq.PaymentType)
	queryParameters = append(queryParameters, createArReq.Bank)
	queryParameters = append(queryParameters, cedDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateArFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Ar in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Ar", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New Ar created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Ar Created Successfully", http.StatusOK, nil)
}
