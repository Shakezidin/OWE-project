/**************************************************************************
 * File       	   : apiCreateTeam.go
 * DESCRIPTION     : This file contains functions for create team handler
 * DATE            : 22-Jan-2024
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
 * FUNCTION:		HandleCreateTeamRequest
 * DESCRIPTION:     handler for create team request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateTeamRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		TeamData        models.TeamData
		queryParameters []interface{}
	)

	log.EnterFn(0, "HandleCreateTeamRequest")
	defer func() { log.ExitFn(0, "HandleCreateTeamRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create team request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create team request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &TeamData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create team request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create team request", http.StatusBadRequest, nil)
		return
	}

	if len(TeamData.TeamName) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, TeamData.TeamName)
	_, err = db.CallDBFunction(db.CreateTeamFunction, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Add Team in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Team", http.StatusInternalServerError, nil)
		return
	}

	FormAndSendHttpResp(resp, "Team Created Successfully", http.StatusOK, nil)
}
