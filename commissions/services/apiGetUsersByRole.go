/**************************************************************************
 * File       	   : apiGetUsersByRole.go
 * DESCRIPTION     : This file contains functions for get users data handler
 * DATE            : 23-Apr-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
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
		err     error
		dataReq models.GetUsers
		data    []map[string]interface{}
		query   string
	)

	log.EnterFn(0, "HandleGetUsersByRoleDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUsersByRoleDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get users data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get users data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get users data Request body", http.StatusBadRequest, nil)
		return
	}

	if dataReq.Role == "" && dataReq.Name == "" {
		// No parameters provided, return list of users
		query = `
		SELECT name
		FROM user_details`
	} else if dataReq.Role != "" && dataReq.Name == "" {
		// Only role provided, return data based on role
		if dataReq.Role == "admin" || dataReq.Role == "dealer owner" {
			// Send the response
			log.FuncInfoTrace(0, "for role admin and dealer owner no users list will be there")
			FormAndSendHttpResp(resp, "Users Data", http.StatusOK, nil)
			return
		}

		query = `
		WITH role_data AS (
			SELECT role_id
			FROM user_roles
			WHERE LOWER(role_name) = LOWER($1)
		)
		SELECT ud.name
		FROM user_details ud
		INNER JOIN role_data ON ud.role_id = role_data.role_id`

		data, err = db.ReteriveFromDB(query, []interface{}{dataReq.Role})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
			return
		}

		usersNameList := models.GetUsersNameList{}

		for _, item := range data {
			// Name
			Name, nameOk := item["name"].(string)
			if !nameOk || Name == "" {
				log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
				Name = ""
			}
			usersData := models.GetUsersName{
				Name: Name,
			}

			usersNameList.UsersNameList = append(usersNameList.UsersNameList, usersData)
		}

		// Send the response
		log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList.UsersNameList), usersNameList)
		FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
		return
	} else if dataReq.Name != "" && dataReq.Role != "" {
		// Both role and name provided, return data based on both
		query = `
		WITH role_data AS (
			SELECT role_id
			FROM user_roles
			WHERE LOWER(role_name) = LOWER($1)
		)
		SELECT ud.name
		FROM user_details ud
		INNER JOIN role_data ON ud.role_id = role_data.role_id
		WHERE LOWER(ud.name) = LOWER($2)`
	}

	data, err = db.ReteriveFromDB(query, []interface{}{dataReq.Role, strings.ToLower(dataReq.Name)})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	usersNameList := models.GetUsersNameList{}

	for _, item := range data {
		// Name
		Name, nameOk := item["name"].(string)
		if !nameOk || Name == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			Name = ""
		}
		usersData := models.GetUsersName{
			Name: Name,
		}

		usersNameList.UsersNameList = append(usersNameList.UsersNameList, usersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList.UsersNameList), usersNameList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}
