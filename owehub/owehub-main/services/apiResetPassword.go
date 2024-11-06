package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"
)

/******************************************************************************
* FUNCTION:		HandleResetPasswordRequest
* DESCRIPTION:     handler for create user request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleResetPasswordRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		recoverPasswordReq models.RecoverPasswordReq
	)

	log.EnterFn(0, "HandleResetPasswordRequest")
	defer func() { log.ExitFn(0, "HandleResetPasswordRequest", err) }()

	role, _ := req.Context().Value("rolename").(string)
	if role != "Dealer Owner" && role != "Admin" {
		err = fmt.Errorf("access denied: insufficient permissions")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Access denied", http.StatusForbidden, nil)
		return
	}

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in password recovery request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from password recovery request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &recoverPasswordReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal password recovery request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal password recovery request", http.StatusBadRequest, nil)
		return
	}

	hashedPassword, err := GenerateHashPassword("Welcome@123")
	if err != nil {
		log.FuncErrorTrace(0, "Failed to hash the default password err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
		return
	}

	err = ResetPasswordsForUsers(recoverPasswordReq.UserEmails, string(hashedPassword))
	if err != nil {
		log.FuncErrorTrace(0, "Failed to reset passwords for users: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to reset passwords", http.StatusInternalServerError, nil)
		return
	}

	for _, email := range recoverPasswordReq.UserEmails {
		err = SendPasswordResetSuccessMailToClient(email, "Your password has been reset to the default.")
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send email to %s with err: %v", email, err)
		}
	}

	appserver.FormAndSendHttpResp(resp, "Passwords reset successfully", http.StatusOK, nil)
}

/******************************************************************************
* FUNCTION:		ResetPasswordsForUsers
* DESCRIPTION:     handler for create user request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func ResetPasswordsForUsers(userEmails []string, hashedPassword string) error {
	var err error
	log.EnterFn(0, "ResetPasswordsForUsers")
	defer func() { log.ExitFn(0, "ResetPasswordsForUsers", err) }()

	if len(userEmails) == 0 {
		return fmt.Errorf("no user emails provided")
	}

	emailList := "'" + strings.Join(userEmails, "', '") + "'"
	query := fmt.Sprintf(`
		UPDATE user_details
		SET password = '%s',
			password_change_required = TRUE
		WHERE email_id IN (%s);`,
		hashedPassword, emailList,
	)

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		return fmt.Errorf("failed to update passwords: %v", err)
	}

	return nil
}
