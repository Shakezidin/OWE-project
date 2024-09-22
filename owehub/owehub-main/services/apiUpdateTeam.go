/**************************************************************************
 * File       	   : apiUpdateTeamName.go
 * DESCRIPTION     : This file contains functions for update team name handler
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
)

/******************************************************************************
 * FUNCTION:		HandleUpdateTeamNameRequest
 * DESCRIPTION:     handler for update team name request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateTeamNameRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err        error
		updateData models.UpdateTeamNameRequest
	)

	log.EnterFn(0, "HandleUpdateTeamNameRequest")
	defer func() { log.ExitFn(0, "HandleUpdateTeamNameRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update team name request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update team name request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update team name request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update team name request", http.StatusBadRequest, nil)
		return
	}

	if updateData.TeamID <= 0 || updateData.TeamName == "" {
		err = fmt.Errorf("Invalid input fields in API request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid input fields in API request", http.StatusBadRequest, nil)
		return
	}

	queryParameters := []interface{}{
		updateData.TeamID,
		updateData.TeamName,
	}

	_, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateTeamName, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update team name in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update team name", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Team name updated successfully", http.StatusOK, nil)
}
