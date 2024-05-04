/**************************************************************************
* File			: apiUpdateLeaderOverride.go
* DESCRIPTION	: This file contains functions for Update leader override handler
* DATE			: 24-Apr-2024
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
 * FUNCTION:		HandleUpdateLeaderOverrideRequest
 * DESCRIPTION:     handler for Update LeaderOverride request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateLeaderOverrideRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		UpdateLeaderOverrideReq models.UpdateLeaderOverride
		queryParameters         []interface{}
		result                  []interface{}
	)

	log.EnterFn(0, "HandleUpdateLeaderOverrideRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLeaderOverrideRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update leader override request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update leader override request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateLeaderOverrideReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update leader override request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Update leader override request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateLeaderOverrideReq.UniqueID) <= 0) || (len(UpdateLeaderOverrideReq.TeamName) <= 0) ||
		(len(UpdateLeaderOverrideReq.LeaderName) <= 0) || (len(UpdateLeaderOverrideReq.Type) <= 0) ||
		(len(UpdateLeaderOverrideReq.Term) <= 0) || (len(UpdateLeaderOverrideReq.Qual) <= 0) ||
		(len(UpdateLeaderOverrideReq.PayRate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLeaderOverrideReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLeaderOverrideReq.SalesQ <= float64(0) {
		err = fmt.Errorf("Invalid SalesQ Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sales Q Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLeaderOverrideReq.TeamKwQ <= float64(0) {
		err = fmt.Errorf("Invalid TeamKwQ  Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid TeamKwQ Not Allowed. Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.RecordId)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.UniqueID)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.TeamName)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.Type)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.LeaderName)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.Term)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.Qual)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.SalesQ)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.TeamKwQ)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.PayRate)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.StartDate)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateLeaderOverrideFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update leader override in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update leader override", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "leader override updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Leader Override Updated Successfully", http.StatusOK, nil)
}
