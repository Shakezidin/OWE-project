/**************************************************************************
 * File       	   : apiManageTeam.go
 * DESCRIPTION     : This file contains functions for Manage team handler
 * DATE            : 22-Jan-2024
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

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:		HandleManageTeamDataRequest
 * DESCRIPTION:     handler for Manage team request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleAddTeamMemberDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err      error
		TeamData models.TeamUpdateData
	)

	log.EnterFn(0, "HandleManageTeamDataRequest")
	defer func() { log.ExitFn(0, "HandleManageTeamDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Manage team request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Manage team request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &TeamData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Manage team request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Manage team request", http.StatusBadRequest, nil)
		return
	}

	if TeamData.TeamID <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Check for duplicates between SaleRepIds and ManagerIds
	duplicateMap := make(map[string]bool)
	for _, id := range TeamData.SaleRepIds {
		duplicateMap[id] = true
	}
	for _, id := range TeamData.ManagerIds {
		if duplicateMap[id] {
			err = fmt.Errorf("Sale representative ID %s is also present in manager IDs", id)
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Duplicate IDs in SaleRepIds and ManagerIds", http.StatusBadRequest, nil)
			return
		}
	}

	// Prepare query parameters
	queryParameters := []interface{}{
		TeamData.TeamID,
		pq.Array(TeamData.SaleRepIds),
		pq.Array(TeamData.ManagerIds),
	}

	// Call the stored procedure to update the team members and managers
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.AddTeamMembers, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update Team in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to add team members", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Team Managed Successfully", http.StatusOK, nil)
}
