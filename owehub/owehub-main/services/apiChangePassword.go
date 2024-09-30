/**************************************************************************
 * File       	   : apiChangePassword.go
 * DESCRIPTION     : This file contains functions for change password handler
 * DATE            : 19-Jan-2024
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
 * FUNCTION:		HandleChangePassRequest
 * DESCRIPTION:     handler for change password request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleChangePassRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		userEmailId       string
		changePasswordReq models.ChangePasswordReq
		whereEleList      []interface{}
	)

	log.EnterFn(0, "HandleChangePassRequest")
	defer func() { log.ExitFn(0, "HandleChangePassRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in change password request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from change password request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &changePasswordReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Change Password request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Change Password request", http.StatusBadRequest, nil)
		return
	}

	if (len(changePasswordReq.CurrentPassword) <= 0) || (len(changePasswordReq.NewPassword) <= 0) {
		err = fmt.Errorf("Empty New or Current Password")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty New or Old Password Not Allowed", http.StatusBadRequest, nil)
		return
	}

	userEmailId = req.Context().Value("emailid").(string)

	/* Validate the current credentials for user before update */
	creds := models.Credentials{
		EmailId:  userEmailId,
		Password: changePasswordReq.CurrentPassword,
	}

	_, _, roleName, _, err := ValidateUser(creds)
	if err != nil {
		log.FuncErrorTrace(0, "Invalid Current Password err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Current Password", http.StatusUnauthorized, nil)
		return
	}

	if roleName == "DB User" || roleName == "Admin" {
		userNameQuery := "select db_username from user_details WHERE LOWER(email_id) = LOWER($1)"
		whereEleList = append(whereEleList, userEmailId)
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, userNameQuery, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get ar import data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get ar import data from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			username, ok := data[0]["db_username"].(string)
			if ok && len(username) > 0 {
				username = data[0]["db_username"].(string)
				sqlStatement := fmt.Sprintf("ALTER ROLE %s WITH PASSWORD '%s';", username, changePasswordReq.NewPassword)
				err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to update OWEDB Password err: %v", err)
					appserver.FormAndSendHttpResp(resp, "Failed update the DB Password", http.StatusInternalServerError, nil)
					return
				}
			}
		} else {
			log.FuncErrorTrace(0, "Failed to get user details from DB: %v", err)
			appserver.FormAndSendHttpResp(resp, "User does not exists in DB", http.StatusInternalServerError, nil)
			return
		}
	}

	/* Now Update the new password in DB */
	err = UpdatePassword(changePasswordReq.NewPassword, userEmailId)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update the new password err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update the new password", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Password Updated Successfully", http.StatusOK, nil)
}
