/**************************************************************************
* File			: apiCreateRepPaySettingsData.go
* DESCRIPTION	: This file contains functions for create RepPaySettings data handler
* DATE			: 26-Apr-2024
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
 * FUNCTION:		HandleCreateRepPaySettingsDataRequest
 * DESCRIPTION:     handler for create RepPaySettings data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateRepPaySettingsDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                      error
		createRepPaySettingsData models.CreateRepPaySettingsData
		queryParameters          []interface{}
		result                   []interface{}
	)

	log.EnterFn(0, "HandleCreateRepPaySettingsDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateRepPaySettingsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create rep pay settings data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create rep pay settings data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRepPaySettingsData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create rep pay settings data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create rep pay settings data request", http.StatusBadRequest, nil)
		return
	}

	if len(createRepPaySettingsData.Name) == 0 ||
		len(createRepPaySettingsData.State) == 0 || len(createRepPaySettingsData.PayScale) == 0 ||
		len(createRepPaySettingsData.Position) == 0 ||
		len(createRepPaySettingsData.StartDate) == 0 || len(createRepPaySettingsData.EndDate) <= 0 {
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, createRepPaySettingsData)
		return
	}

	StartDate, err := time.Parse("2006-01-02", createRepPaySettingsData.StartDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}
	EndDate, err := time.Parse("2006-01-02", createRepPaySettingsData.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createRepPaySettingsData.Name)
	queryParameters = append(queryParameters, createRepPaySettingsData.State)
	queryParameters = append(queryParameters, createRepPaySettingsData.PayScale)
	queryParameters = append(queryParameters, createRepPaySettingsData.Position)
	queryParameters = append(queryParameters, createRepPaySettingsData.B_E)
	queryParameters = append(queryParameters, StartDate)
	queryParameters = append(queryParameters, EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateRepPaySettingsDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add rep pay settings data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Rep Pay Settings Data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New rep pay settings data created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Rep Pay Settings Data Created Successfully", http.StatusOK, nil)
}
