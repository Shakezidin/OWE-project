/**************************************************************************
 * File       	   : apiGetUsersByRole.go
 * DESCRIPTION     : This file contains functions for get users data handler
 * DATE            : 23-Apr-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"strings"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetUsersByRoleDataRequest
 * DESCRIPTION:     handler for get users by role request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetUsersByRoleDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err   error
		query string
	)

	log.EnterFn(0, "HandleGetUsersByRoleDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUsersByRoleDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	var dataReq models.GetUsers
	if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	var data []map[string]interface{}
	switch {
	case dataReq.Role != "" && dataReq.Name == "" && dataReq.SubRole == "":
		// Only role provided, return all user names for the given role
		query = `
				SELECT name
				FROM user_details
				WHERE role_id IN (
					SELECT role_id
					FROM user_roles
					WHERE LOWER(role_name) = LOWER($1)
				)`
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{strings.ToLower(dataReq.Role)})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
			return
		}

	case dataReq.Role != "" && dataReq.Name != "" && dataReq.SubRole != "":
		// Role, name, and sub_role provided, return users with specified conditions
		query = `
		WITH subrole_data AS (
			SELECT role_id
			FROM user_roles
			WHERE LOWER(role_name) LIKE LOWER($1)
		),
		dealer_owner_data AS (
			SELECT user_id
			FROM user_details
			WHERE LOWER(name) LIKE LOWER($2)
		)
		SELECT ud.name
		FROM user_details ud
		WHERE ud.role_id IN (SELECT role_id FROM subrole_data)
		AND ud.dealer_owner IN (SELECT user_id FROM dealer_owner_data)`
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{"%" + strings.ToLower(dataReq.SubRole) + "%", "%" + strings.ToLower(dataReq.Name) + "%"})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
			return
		}

	default:
		err = errors.New("invalid combination of parameters provided")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid combination of parameters provided", http.StatusBadRequest, nil)
		return
	}
	usersNameList := models.GetUsersNameList{}
	for _, item := range data {
		// Name
		name, nameOk := item["name"].(string)
		if !nameOk || name == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			name = ""
		}
		usersData := models.GetUsersName{
			Name: name,
		}

		usersNameList.UsersNameList = append(usersNameList.UsersNameList, usersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList.UsersNameList), usersNameList)
	appserver.FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}
