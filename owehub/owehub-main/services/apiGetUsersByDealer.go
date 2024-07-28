/**************************************************************************
 * File       	   : apiGetUsersByDealer.go
 * DESCRIPTION     : This file contains functions for get users by dealer
 * DATE            : 28-July-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetUsersByDealerRequest
 * DESCRIPTION:     handler for get users by dealer request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetUsersByDealerRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		query        string
		dataReq      models.GetUserByDealer
		whereEleList []interface{}
	)

	log.EnterFn(0, "HandleGetUsersByDealerRequest")
	defer func() { log.ExitFn(0, "HandleGetUsersByDealerRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users by dealer request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users by dealer request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	if len(dataReq.DealerName) <= 0 {
		log.FuncErrorTrace(0, "Empty Input Fields in API is Not Allowed")
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	/* If role is not passed then get users for all roles of dealer */
	if len(dataReq.Role) <= 0 {
		query = `
				SELECT name FROM user_details
				WHERE dealer_id IN (
					SELECT id FROM v_dealer
					WHERE LOWER(dealer_code) = LOWER($1)
				)
				`
		whereEleList = append(whereEleList, dataReq.DealerName)
	} else {
		query = `
				SELECT name FROM user_details
				WHERE dealer_id IN (
					SELECT id FROM v_dealer
					WHERE LOWER(dealer_code) = LOWER($1)
				)
				AND role_id IN (
					SELECT role_id
					FROM user_roles
					WHERE LOWER(role_name) = LOWER($2)
				)
				`
		whereEleList = append(whereEleList, dataReq.DealerName)
		whereEleList = append(whereEleList, dataReq.Role)
	}

	var data []map[string]interface{}
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
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
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}
