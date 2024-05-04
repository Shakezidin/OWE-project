/**************************************************************************
* File			: apiCreateAr.go
* DESCRIPTION	: This file contains functions for create Ar handler
* DATE			: 01-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

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
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Ar request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createArReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Ar request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Ar request", http.StatusBadRequest, nil)
		return
	}

	if (len(createArReq.UniqueId) <= 0) || (len(createArReq.CustomerName) <= 0) ||
		(len(createArReq.Date) <= 0) || (len(createArReq.Amount) <= 0) ||
		(len(createArReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createArReq.UniqueId)
	queryParameters = append(queryParameters, createArReq.CustomerName)
	queryParameters = append(queryParameters, createArReq.Date)
	queryParameters = append(queryParameters, createArReq.Amount)
	queryParameters = append(queryParameters, createArReq.Notes)
	
	// Call the database function
	result, err = db.CallDBFunction(db.CreateArFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Ar in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Ar", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New Ar created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Ar Created Successfully", http.StatusOK, nil)
}
