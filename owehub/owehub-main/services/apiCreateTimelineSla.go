/**************************************************************************
* File			: apiCreateTimelineSla.go
* DESCRIPTION	: This file contains functions for create Create Timeline Sla
						setter handler
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
 * FUNCTION:		HandleCreateTimelineSlaRequest
 * DESCRIPTION:     handler for create v_adders request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateTimelineSlaRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		createTimelineSla models.CreateTimelineSla
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleCreateTimelineSlaRequest")
	defer func() { log.ExitFn(0, "HandleCreateTimelineSlaRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create timeline sla request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create timeline sla request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createTimelineSla)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create timeline sla request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create timeline sla request", http.StatusBadRequest, nil)
		return
	}

	if (len(createTimelineSla.TypeM2M) <= 0) || (len(createTimelineSla.State) <= 0) ||
		(len(createTimelineSla.StartDate) <= 0) || (len(createTimelineSla.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createTimelineSla.Days <= 0 {
		err = fmt.Errorf("Invalid days Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Days Not Allowed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createTimelineSla.TypeM2M)
	queryParameters = append(queryParameters, createTimelineSla.State)
	queryParameters = append(queryParameters, createTimelineSla.Days)
	queryParameters = append(queryParameters, createTimelineSla.StartDate)
	queryParameters = append(queryParameters, createTimelineSla.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateTimelineSlaFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add timeline sla in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Timeline Sla", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New timeline sla created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "timeline sla Created Successfully", http.StatusOK, nil)
}
