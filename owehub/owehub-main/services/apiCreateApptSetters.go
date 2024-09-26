/**************************************************************************
* File			: apiCreateApptSetters.go
* DESCRIPTION	: This file contains functions for create appt	 setters handler
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
 * FUNCTION:		HandleCreateApptSettersRequest
 * DESCRIPTION:     handler for create appt setters request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateApptSettersDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		createApptSettersReq models.CreateApptSettersReq
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleCreateApptSettersRequest")
	defer func() { log.ExitFn(0, "HandleCreateApptSettersRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create appt setters request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create appt setters request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createApptSettersReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create appt setters request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create appt setters request", http.StatusBadRequest, nil)
		return
	}

	if (len(createApptSettersReq.UniqueId) <= 0) || (len(createApptSettersReq.Name) <= 0) ||
		(len(createApptSettersReq.TeamName) <= 0) || (len(createApptSettersReq.PayRate) <= 0) ||
		(len(createApptSettersReq.StartDate) <= 0) || (len(createApptSettersReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	startDate, err := time.Parse("2006-01-02", createApptSettersReq.StartDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", createApptSettersReq.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createApptSettersReq.UniqueId)
	queryParameters = append(queryParameters, createApptSettersReq.Name)
	queryParameters = append(queryParameters, createApptSettersReq.TeamName)
	queryParameters = append(queryParameters, createApptSettersReq.PayRate)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateApptSettersFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add appt setters in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create appt setters", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New appt setters created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Appt setters Created Successfully", http.StatusOK, nil)
}
