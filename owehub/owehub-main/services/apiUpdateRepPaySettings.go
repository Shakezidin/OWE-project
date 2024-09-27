/**************************************************************************
* File			: apiUpdateRepPaySettingsData.go
* DESCRIPTION	: This file contains functions for Update RepPaySettings data handler
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
 * FUNCTION:		HandleUpdateRepPaySettingsDataRequest
 * DESCRIPTION:     handler for Update RepPaySettings data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateRepPaySettingsDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                      error
		UpdateRepPaySettingsData models.UpdateRepPaySettingsData
		queryParameters          []interface{}
		result                   []interface{}
	)

	log.EnterFn(0, "HandleUpdateRepPaySettingsDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateRepPaySettingsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update RepPaySettings Data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update RepPaySettings Data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateRepPaySettingsData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update RepPaySettings Data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update RepPaySettings Data request", http.StatusBadRequest, nil)
		return
	}

	if len(UpdateRepPaySettingsData.Name) == 0 ||
		len(UpdateRepPaySettingsData.State) == 0 || len(UpdateRepPaySettingsData.PayScale) == 0 ||
		len(UpdateRepPaySettingsData.Position) == 0 ||
		len(UpdateRepPaySettingsData.StartDate) == 0 || len(UpdateRepPaySettingsData.EndDate) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateRepPaySettingsData.RecordId <= int64(0) {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	StartDate, err := time.Parse("2006-01-02", UpdateRepPaySettingsData.StartDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}
	EndDate, err := time.Parse("2006-01-02", UpdateRepPaySettingsData.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateRepPaySettingsData.RecordId)
	queryParameters = append(queryParameters, UpdateRepPaySettingsData.Name)
	queryParameters = append(queryParameters, UpdateRepPaySettingsData.State)
	queryParameters = append(queryParameters, UpdateRepPaySettingsData.PayScale)
	queryParameters = append(queryParameters, UpdateRepPaySettingsData.Position)
	queryParameters = append(queryParameters, UpdateRepPaySettingsData.B_E)
	queryParameters = append(queryParameters, StartDate)
	queryParameters = append(queryParameters, EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRepPaySettingsDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RepPaySettings Data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update RepPaySettings Data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "RepPaySettings Data Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "RepPaySettings Data Updated Successfully", http.StatusOK, nil)
}
