/**************************************************************************
* File			: apiCreateStates.go
* DESCRIPTION	: This file contains functions for create states type
						handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleCreateStateRequest
 * DESCRIPTION:     handler for create states request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateStateRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createStatesReq models.CreateStates
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateStateRequest")
	defer func() { log.ExitFn(0, "HandleCreateStateRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create states request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create states request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createStatesReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create states request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create states request", http.StatusBadRequest, nil)
		return
	}

	if (len(createStatesReq.Abbr) <= 0) || (len(createStatesReq.Name) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if len(createStatesReq.Abbr) > 2 {
		err = fmt.Errorf("Abbr input provided more than max limit")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Input in Abbr more than max Limit", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createStatesReq.Abbr)
	queryParameters = append(queryParameters, createStatesReq.Name)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateStateFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add states in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create states", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "states created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "States Created Successfully", http.StatusOK, nil)
}
