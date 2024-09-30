/**************************************************************************
 * File       	   : apiForgotPassword.go
 * DESCRIPTION     : This file contains functions for forgot password handler
 * DATE            : 20-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleForgotPassRequest
 * DESCRIPTION:     handler for chnage password request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleForgotPassRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		data              []map[string]interface{}
		err               error
		otp               string
		forgotPasswordReq models.ForgotPasswordReq
	)

	log.EnterFn(0, "HandleForgotPassRequest")
	defer func() { log.ExitFn(0, "HandleForgotPassRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in forgot password request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from forgot password request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &forgotPasswordReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal forgot Password request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal forgot Password request", http.StatusBadRequest, nil)
		return
	}

	if len(forgotPasswordReq.EmailId) <= 0 {
		err = fmt.Errorf("Empty Email id Received")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Email Id Not Allowed", http.StatusBadRequest, nil)
		return
	}

	/* Validate is user with provided email Id is exists or nor */
	data, err = GetUserInfo(forgotPasswordReq.EmailId)
	if err != nil || data == nil {
		log.FuncErrorTrace(0, "Invalid Email Id User doesnot exists err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Email Id", http.StatusBadRequest, nil)
		return
	}

	if len(forgotPasswordReq.Otp) <= 0 {
		/* Generate a new OTP */
		otp, err = GenerateRandomNumWithLen(ForgotPasswordOTPLen)
		if err != nil || len(otp) <= 0 {
			log.FuncErrorTrace(0, "Failed to generate OTP err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to generate the OTP", http.StatusInternalServerError, nil)
			return
		}

		/* Send the OTP to user Email */
		// subject := "OTP for Password Reset"

		// plainTextContent := fmt.Sprintf("OTP for password reset. Valid for %v Minutes", ForgotPassOtpExpireInMin)
		// 	htmlContent := fmt.Sprintf(`
		//     <div style="
		//         border: 2px solid black;
		//         padding: 10px;
		//         font-size: 24px;
		//         width: fit-content;
		//         margin: auto;
		//     ">
		//         <strong>%s</strong>
		//     </div>
		// `, otp)
		err = SendOTPToClient(forgotPasswordReq.EmailId, otp)
		if err != nil || len(otp) <= 0 {
			log.FuncErrorTrace(0, "Failed to send OTP to client err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to send the OTP to client", http.StatusInternalServerError, nil)
			return
		}

		/* Store OTP in local buffer against user Email Id */
		StoreForgotPassOTP(forgotPasswordReq.EmailId, otp)
		appserver.FormAndSendHttpResp(resp, "OTP Generated Successfully", http.StatusOK, nil)
	} else {

		if len(forgotPasswordReq.NewPassword) <= 0 || len(forgotPasswordReq.Otp) <= 0 {
			err = fmt.Errorf("Empty New Password or OTP Received")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Empty New Password or OTP Not Allowed", http.StatusBadRequest, nil)
			return
		}

		/* Validate the OTP before updating password in DB */
		if !ValidateForgotPassOTP(forgotPasswordReq.EmailId, forgotPasswordReq.Otp) {
			err = fmt.Errorf("Invalid OTP provided")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Invalid OTP", http.StatusUnauthorized, nil)
			return
		}

		/* Now Update the new password in DB */
		err = UpdatePassword(forgotPasswordReq.NewPassword, forgotPasswordReq.EmailId)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update the new password err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update the new password", http.StatusInternalServerError, nil)
			return
		}

		appserver.FormAndSendHttpResp(resp, "Password Updated Successfully", http.StatusOK, nil)
	}
}
