/**************************************************************************
 * File       	   : apiChangePassword.go
 * DESCRIPTION     : This file contains functions for chnage password handler
 * DATE            : 19-Jan-2024
 **************************************************************************/

package services

import (
	db "OWEApp/db"
	log "OWEApp/logger"
	"encoding/json"

	"fmt"
	"io/ioutil"
	"net/http"
)

type ChangePasswordReq struct {
	CurrentPassword string `json:"currentpassword"`
	NewPassword     string `json:"newpassword"`
}

/******************************************************************************
 * FUNCTION:		HandleChnagePassRequest
 * DESCRIPTION:     handler for chnage password request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleChnagePassRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		userEmailId       string
		changePasswordReq ChangePasswordReq
	)

	log.EnterFn(0, "HandleChnagePassRequest")
	defer func() { log.ExitFn(0, "HandleChnagePassRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in chnage password request")
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from chnage password request err: %v", err)
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
		err = fmt.Errorf("empty new or old password")
		FormAndSendHttpResp(resp, "Empty New or Old Password Not Allowed", http.StatusBadRequest, nil)
		return
	}

	userEmailId = req.Context().Value("emailid").(string)

	/* Validate the current credentials for user before update */
	creds := Credentials{userEmailId, changePasswordReq.CurrentPassword}
	_, _, _, err = ValidateUser(creds)
	if err != nil {
		err = fmt.Errorf("Invalid Current Password")
		FormAndSendHttpResp(resp, "Invalid Current Password", http.StatusUnauthorized, nil)
		return
	}

	/* Now Update the new password in DB */
	err = UpdatePassword(changePasswordReq.NewPassword, userEmailId)
	if err != nil {
		err = fmt.Errorf("Failed to update the new password")
		FormAndSendHttpResp(resp, "Failed to update the new password", http.StatusInternalServerError, nil)
		return
	}

	FormAndSendHttpResp(resp, "Password Updated Sucessfully", http.StatusOK, nil)
}

func UpdatePassword(newPassword string, userEmailId string) (err error) {
	var (
		query        string
		whereEleList []interface{}
	)

	log.EnterFn(0, "UpdatePassword")
	defer func() { log.ExitFn(0, "UpdatePassword", err) }()

	hashedPassBytes, err := GenerateHashPassword(newPassword)
	if err != nil || hashedPassBytes == nil {
		log.FuncErrorTrace(0, "Failed to hash the new password err: %v", err)
		return err
	}

	query = "UPDATE user_auth SET password = $1 where email_id = LOWER($2)"
	whereEleList = append(whereEleList, string(hashedPassBytes))
	whereEleList = append(whereEleList, userEmailId)

	err = db.UpdateDataInDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update the new password err: %v", err)
		return err
	}

	return nil
}
