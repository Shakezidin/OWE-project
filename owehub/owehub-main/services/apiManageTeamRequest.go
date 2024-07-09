/**************************************************************************
 * File       	   : apiManageTeam.go
 * DESCRIPTION     : This file contains functions for Manage team handler
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

	"github.com/lib/pq"
)

/******************************************************************************
* FUNCTION:		HandleManageTeamRequest
* DESCRIPTION:     handler for Manage team request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleManageTeamDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		TeamData        models.TeamDataRequest
		queryParameters []interface{}
	)

	log.EnterFn(0, "HandleManageTeamDataRequest")
	defer func() { log.ExitFn(0, "HandleManageTeamDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Manage team request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Manage team request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &TeamData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Manage team request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Manage team request", http.StatusBadRequest, nil)
		return
	}

	if TeamData.TeamId <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, pq.Array(TeamData.RepId))
	queryParameters = append(queryParameters, TeamData.TeamId)
	queryParameters = append(queryParameters, TeamData.DeleteCheck)
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRepTeamFuntion, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update Team in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Manage Team", http.StatusInternalServerError, nil)
		return
	}

	FormAndSendHttpResp(resp, "Team Managed Successfully", http.StatusOK, nil)
}
