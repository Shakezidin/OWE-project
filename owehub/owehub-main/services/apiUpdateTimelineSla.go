/**************************************************************************
* File			: apiUpdateTimelineSla.go
* DESCRIPTION	: This file contains functions for Update Timeline Sla
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
 * FUNCTION:		HandleUpdateTimelineSlaRequest
 * DESCRIPTION:     handler for update v_adders request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateTimelineSlaRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		updateTimelineSla models.UpdateTimelineSla
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleUpdateTimelineSlaRequest")
	defer func() { log.ExitFn(0, "HandleUpdateTimelineSlaRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update timeline sla request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update timeline sla request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateTimelineSla)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update timeline sla request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update timeline sla request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateTimelineSla.TypeM2M) <= 0) || (len(updateTimelineSla.State) <= 0) ||
		(len(updateTimelineSla.StartDate) <= 0) || (len(updateTimelineSla.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateTimelineSla.Days <= 0 {
		err = fmt.Errorf("Invalid Sla days Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Sla days Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateTimelineSla.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateTimelineSla.RecordId)
	queryParameters = append(queryParameters, updateTimelineSla.TypeM2M)
	queryParameters = append(queryParameters, updateTimelineSla.State)
	queryParameters = append(queryParameters, updateTimelineSla.Days)
	queryParameters = append(queryParameters, updateTimelineSla.StartDate)
	queryParameters = append(queryParameters, updateTimelineSla.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateTimelineSlaFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add timeline sla in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update timeline sla", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "timeline sla updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "timeline sla Updated Successfully", http.StatusOK, nil)
}
