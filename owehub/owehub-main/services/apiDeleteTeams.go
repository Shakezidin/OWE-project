/**************************************************************************
 * File           : apiManageTeams.go
 * DESCRIPTION    : This file contains functions for managing team requests
 * DATE           : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:		HandleDeleteTeamsRequest
 * DESCRIPTION:  Handler for deleting teams request
 * INPUT:		resp, req
 * RETURNS:		void
 ******************************************************************************/
func HandleDeleteTeamsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err       error
		teamData  models.DeleteTeamsRequest
		queryArgs []interface{}
	)

	log.EnterFn(0, "HandleDeleteTeamsRequest")
	defer func() { log.ExitFn(0, "HandleDeleteTeamsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in delete teams request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	err = json.NewDecoder(req.Body).Decode(&teamData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body for delete teams request, err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	if len(teamData.TeamIDs) == 0 {
		err = fmt.Errorf("Empty team IDs list in request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty team IDs list in request", http.StatusBadRequest, nil)
		return
	}

	queryArgs = append(queryArgs, pq.Array(teamData.TeamIDs))
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.DeleteTeams, queryArgs)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete teams in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to delete teams", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Teams deleted successfully", http.StatusOK, nil)
}
