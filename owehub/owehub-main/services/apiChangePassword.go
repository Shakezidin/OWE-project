/**************************************************************************
 * File       	   : apiChangePassword.go
 * DESCRIPTION     : This file contains functions for change password handler
 * DATE            : 19-Jan-2024
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
		username          string
	)

	log.EnterFn(0, "HandleChangePassRequest")
	defer func() { log.ExitFn(0, "HandleChangePassRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in change password request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from change password request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &changePasswordReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Change Password request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Change Password request", http.StatusBadRequest, nil)
		return
	}

	if (len(changePasswordReq.CurrentPassword) <= 0) || (len(changePasswordReq.NewPassword) <= 0) {
		err = fmt.Errorf("Empty New or Current Password")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty New or Old Password Not Allowed", http.StatusBadRequest, nil)
		return
	}

	userEmailId = req.Context().Value("emailid").(string)

	userNameQuery := fmt.Sprintf("select db_username from user_details ud JOIN user_roles ur on ur.role_id = ud.role_id where (ud.role_id = 10 or ud.role_id = 1) and email_id = '%s'", userEmailId)

	/* Validate the current credentials for user before update */
	creds := models.Credentials{
		EmailId:  userEmailId,
		Password: changePasswordReq.CurrentPassword,
	}

	_, _, roleName, _, err := ValidateUser(creds)
	if err != nil {
		log.FuncErrorTrace(0, "Invalid Current Password err: %v", err)
		FormAndSendHttpResp(resp, "Invalid Current Password", http.StatusUnauthorized, nil)
		return
	}

	if roleName == "DB User" || roleName == "Admin" {
		// err = db.ExecQueryDB(db.RowDataDBIndex, userNameQuery)
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, userNameQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get ar import data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get ar import data from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			username, nameOk := data[0]["db_username"].(string)
			if !nameOk || username == "" {
				log.FuncErrorTrace(0, "empty username")
				FormAndSendHttpResp(resp, "Failed to process the password, empty username", http.StatusInternalServerError, nil)
				return
			}
		} else {
			log.FuncErrorTrace(0, "Failed empy data response: %v", err)
			FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
			return
		}
		
		username = data[0]["db_username"].(string)
		sqlStatement := fmt.Sprintf("ALTER ROLE %s WITH PASSWORD '%s';", username, changePasswordReq.NewPassword)
		err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
		log.FuncErrorTrace(0, " sqlStatement err %+v", err)
		log.FuncErrorTrace(0, "sqlStatement %v", sqlStatement)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create user already exists: %v", err)
			FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
			return
		}
	}

	/* Now Update the new password in DB */
	err = UpdatePassword(changePasswordReq.NewPassword, userEmailId)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update the new password err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update the new password", http.StatusInternalServerError, nil)
		return
	}

	FormAndSendHttpResp(resp, "Password Updated Successfully", http.StatusOK, nil)
}
