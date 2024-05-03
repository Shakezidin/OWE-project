/**************************************************************************
* File			: apiCreateLeaderOverride.go
* DESCRIPTION	: This file contains functions for create LeaderOverride handler
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
 * FUNCTION:		HandleCreateLeaderOverrideRequest
 * DESCRIPTION:     handler for create LeaderOverride request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateLeaderOverrideRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		createLeaderOverrideReq models.CreateLeaderOverride
		queryParameters         []interface{}
		result                  []interface{}
	)

	log.EnterFn(0, "HandleCreateLeaderOverrideRequest")
	defer func() { log.ExitFn(0, "HandleCreateLeaderOverrideRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create LeaderOverride request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create LeaderOverride request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createLeaderOverrideReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create LeaderOverride request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create LeaderOverride request", http.StatusBadRequest, nil)
		return
	}

	if (len(createLeaderOverrideReq.UniqueID) <= 0) || (len(createLeaderOverrideReq.TeamName) <= 0) ||
		(len(createLeaderOverrideReq.LeaderName) <= 0) || (len(createLeaderOverrideReq.Type) <= 0) ||
		(len(createLeaderOverrideReq.Term) <= 0) || (len(createLeaderOverrideReq.Qual) <= 0) ||
		(len(createLeaderOverrideReq.PayRate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createLeaderOverrideReq.SalesQ <= float64(0) {
		err = fmt.Errorf("Invalid SalesQ Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid SalesQ Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLeaderOverrideReq.TeamKwQ <= float64(0) {
		err = fmt.Errorf("Invalid TeamKwQ  Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid TeamKwQ Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createLeaderOverrideReq.UniqueID)
	queryParameters = append(queryParameters, createLeaderOverrideReq.TeamName)
	queryParameters = append(queryParameters, createLeaderOverrideReq.Type)
	queryParameters = append(queryParameters, createLeaderOverrideReq.LeaderName)
	queryParameters = append(queryParameters, createLeaderOverrideReq.Term)
	queryParameters = append(queryParameters, createLeaderOverrideReq.Qual)
	queryParameters = append(queryParameters, createLeaderOverrideReq.SalesQ)
	queryParameters = append(queryParameters, createLeaderOverrideReq.TeamKwQ)
	queryParameters = append(queryParameters, createLeaderOverrideReq.PayRate)
	queryParameters = append(queryParameters, createLeaderOverrideReq.StartDate)
	queryParameters = append(queryParameters, createLeaderOverrideReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateLeaderOverrideFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add LeaderOverride in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create LeaderOverride", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "LeaderOverride created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "LeaderOverride Created Successfully", http.StatusOK, nil)
}
