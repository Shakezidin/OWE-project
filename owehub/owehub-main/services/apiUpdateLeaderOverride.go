/**************************************************************************
* File			: apiUpdateLeaderOverride.go
* DESCRIPTION	: This file contains functions for Update leader override handler
* DATE			: 24-Apr-2024
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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update leader override request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateLeaderOverrideReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update leader override request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update leader override request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateLeaderOverrideReq.TeamName) <= 0) ||
		(len(UpdateLeaderOverrideReq.LeaderName) <= 0) || (len(UpdateLeaderOverrideReq.Type) <= 0) ||
		(len(UpdateLeaderOverrideReq.Term) <= 0) || (len(UpdateLeaderOverrideReq.Qual) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLeaderOverrideReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLeaderOverrideReq.PayRate <= float64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLeaderOverrideReq.SalesQ <= float64(0) {
		err = fmt.Errorf("Invalid SalesQ Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Sales Q Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLeaderOverrideReq.TeamKwQ <= float64(0) {
		err = fmt.Errorf("Invalid TeamKwQ  Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid TeamKwQ Not Allowed. Update failed", http.StatusBadRequest, nil)
		return
	}

	StartDate, err := time.Parse("2006-01-02", UpdateLeaderOverrideReq.StartDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	EndDate, err := time.Parse("2006-01-02", UpdateLeaderOverrideReq.EndDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.RecordId)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.TeamName)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.Type)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.LeaderName)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.Term)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.Qual)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.SalesQ)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.TeamKwQ)
	queryParameters = append(queryParameters, UpdateLeaderOverrideReq.PayRate)
	queryParameters = append(queryParameters, StartDate)
	queryParameters = append(queryParameters, EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateLeaderOverrideFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update leader override in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update leader override", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "leader override updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Leader Override Updated Successfully", http.StatusOK, nil)
}
