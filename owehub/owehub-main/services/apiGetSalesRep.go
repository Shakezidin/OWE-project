/**************************************************************************
 * File       	   : apiGetSalesRep.go
 * DESCRIPTION     : This file contains functions for get users data handler
 * DATE            : 23-Apr-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetSalesRepDataRequest
* DESCRIPTION:     handler for get users by role request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetSaleRepDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err   error
		query string
	)

	log.EnterFn(0, "HandleGetSalesRepDataRequest")
	defer func() { log.ExitFn(0, "HandleGetSalesRepDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	var dataReq models.GetSalesRep
	if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	var data []map[string]interface{}
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
		 SELECT ud.name, ud.email_id, ud.mobile_number, ud.user_code, ud.user_id
		 FROM user_details ud
		 WHERE ud.role_id IN (SELECT role_id FROM subrole_data)
		 AND ud.dealer_owner IN (SELECT user_id FROM dealer_owner_data)`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{"%" + strings.ToLower(dataReq.SubRole) + "%", "%" + strings.ToLower(dataReq.Name) + "%"})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}
	usersNameList := models.GetSaleRepeList{}
	for _, item := range data {
		// Name
		name, nameOk := item["name"].(string)
		if !nameOk || name == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			name = ""
		}
		email, nameOk := item["email_id"].(string)
		if !nameOk || email == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			email = ""
		}
		phone, nameOk := item["mobile_number"].(string)
		if !nameOk || phone == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			phone = ""
		}
		UserId, ok := item["user_code"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get UserId for Item: %+v\n", item)
			continue
		}
		Id, ok := item["user_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get UserId for Item: %+v\n", item)
			continue
		}

		usersData := models.SaleReps{
			Name:    name,
			RepId:   Id,
			Email:   email,
			Phone:   phone,
			RepCode: UserId,
		}
		usersNameList.SaleRepList = append(usersNameList.SaleRepList, usersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList.SaleRepList), usersNameList)
	FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}
