/******************************************************************************
 * File           : apiGetSalesRep.go
 * DESCRIPTION    : This file contains functions for get users data handler
 * DATE           : 23-Apr-2024
 ******************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:        HandleGetSalesRepDataRequest
* DESCRIPTION:     handler for get users by role request
* INPUT:           resp, req
* RETURNS:         void
******************************************************************************/
func HandleGetSalesRepDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err      error
		query    string
		data     []map[string]interface{}
		dealerId int
	)

	log.EnterFn(0, "HandleGetSalesRepDataRequest")
	defer func() { log.ExitFn(0, "HandleGetSalesRepDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get users data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	var dataReq models.GetSalesRep
	if err := json.NewDecoder(req.Body).Decode(&dataReq); err != nil {
		log.FuncErrorTrace(0, "Failed to decode HTTP Request body from get users data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to decode HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	role := req.Context().Value("rolename").(string)
	if role == "Sale Representative" {
		log.FuncErrorTrace(0, "sale rep accessing")
		appserver.FormAndSendHttpResp(resp, "unauthorized user", http.StatusBadRequest, nil)
		return
	}

	if role == "Admin" && len(dataReq.DealerName) <= 0 {
		log.FuncErrorTrace(0, "for admins, dealer should be selected for team creation")
		appserver.FormAndSendHttpResp(resp, "dealer not selected for team creation", http.StatusBadRequest, nil)
		return
	}

	if dataReq.DealerName == "" {
		// Get dealer_id based on email of logged-in user
		dataReq.Email = req.Context().Value("emailid").(string)
		if dataReq.Email == "" {
			appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
			return
		}
		userEmail := dataReq.Email
		query = `
						 SELECT partner_id 
						 FROM user_details 
						 WHERE email_id = $1
				 `
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{userEmail})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealers ID from DB with err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get dealers ID", http.StatusBadRequest, nil)
			return
		}

		if len(data) == 0 {
			err = fmt.Errorf("no dealer found for the given email")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "No dealer found for the given email", http.StatusBadRequest, nil)
			return
		}

		dealerId = int(data[0]["partner_id"].(int64))

	} else {
		// Get dealer_id based on dealer_name
		dealerName := dataReq.DealerName
		query = `
						 SELECT partner_id 
						 FROM sales_partner_dbhub_schema 
						 WHERE LOWER(sales_partner_name) = LOWER($1)
				 `
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dealerName})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealer ID from DB with err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get dealer ID", http.StatusBadRequest, nil)
			return
		}

		if len(data) == 0 {
			err = fmt.Errorf("no dealer found with the given name")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "No dealer found with the given name", http.StatusBadRequest, nil)
			return
		}

		dealerId = int(data[0]["partner_id"].(int64))
	}

	if dataReq.TeamId > 0 {
		query = `
			SELECT ur.role_name, ud.name, ud.email_id, ud.mobile_number, ud.user_code, ud.user_id
			FROM user_details ud
			LEFT JOIN user_roles ur ON ud.role_id = ur.role_id
			WHERE ud.partner_id = $1
			AND NOT EXISTS (
				SELECT 1
				FROM team_members tm
				WHERE tm.user_id = ud.user_id
				AND tm.team_id = $2
			)
		`
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dealerId, dataReq.TeamId})
	} else {
		query = `
			SELECT ur.role_name, ud.name, ud.email_id, ud.mobile_number, ud.user_code, ud.user_id
			FROM user_details ud
			LEFT JOIN user_roles ur ON ud.role_id = ur.role_id
			WHERE ud.partner_id = $1
		`
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dealerId})
	}
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Users data from DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get users Data from DB", http.StatusBadRequest, nil)
		return
	}

	usersNameList := models.GetSaleRepList{}
	for _, item := range data {
		name, nameOk := item["name"].(string)
		if !nameOk || name == "" {
			log.FuncErrorTrace(0, "Failed to get Name for Item: %+v\n", item)
			name = ""
		}
		email, emailOk := item["email_id"].(string)
		if !emailOk || email == "" {
			log.FuncErrorTrace(0, "Failed to get Email for Item: %+v\n", item)
			email = ""
		}
		phone, phoneOk := item["mobile_number"].(string)
		if !phoneOk || phone == "" {
			log.FuncErrorTrace(0, "Failed to get Phone for Item: %+v\n", item)
			phone = ""
		}
		userCode, userCodeOk := item["user_code"].(string)
		if !userCodeOk {
			log.FuncErrorTrace(0, "Failed to get UserCode for Item: %+v\n", item)
			continue
		}
		userId, userIdOk := item["user_id"].(int64)
		if !userIdOk {
			log.FuncErrorTrace(0, "Failed to get UserId for Item: %+v\n", item)
			continue
		}
		userRoles, userIdOk := item["role_name"].(string)
		if !userIdOk {
			log.FuncErrorTrace(0, "Failed to get UserId for Item: %+v\n", item)
			continue
		}

		usersData := models.SaleReps{
			Name:      name,
			RepId:     userId,
			Email:     email,
			Phone:     phone,
			RepCode:   userCode,
			UserRoles: userRoles,
		}
		usersNameList.SaleRepList = append(usersNameList.SaleRepList, usersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of users List fetched : %v list %+v", len(usersNameList.SaleRepList), usersNameList)
	appserver.FormAndSendHttpResp(resp, "Users Data", http.StatusOK, usersNameList)
}
