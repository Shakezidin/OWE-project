package services

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

/******************************************************************************
 * FUNCTION:		SendMailToClient
 * DESCRIPTION:     function to send the mail of user creation to client
 * INPUT:			email
 * RETURNS:    		void
 ******************************************************************************/
func SendMailToClient(email string, username string) (err error) {

	log.EnterFn(0, "SendMailToClient")
	defer func() { log.ExitFn(0, "SendMailToClient", nil) }()

	from := mail.NewEmail("OWE", "it@ourworldenergy.com")
	subject := "Welcome to Our World Energy"
	to := mail.NewEmail("", email)

	plainTextContent := fmt.Sprintf("Dear %s,\n\nWe're thrilled to welcome you to Our World Energy!\n\nYour account has been successfully created.\n\nHere are your account details:\nEmail: %s\nPassword: %s\n\nThank you for choosing us!\nLogin Url: http://155.138.163.236:3000/login \n\nBest regards,\nThe Team", username, email, createUserReqPassword)
	htmlContent := ""

	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient("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")
	response, err := client.Send(message)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(response.StatusCode)
		fmt.Println(response.Body)
		fmt.Println(response.Headers)
	}

	log.EnterFn(0, "SendOTPToClient")
	defer func() { log.ExitFn(0, "SendOTPToClient", nil) }()
	return nil
}

/******************************************************************************
 * FUNCTION:		SendMailToUserFromUI
 * DESCRIPTION:     function to send the mail
 * INPUT:			email
 * RETURNS:    		void
 ******************************************************************************/
func SendMailToUserFromUI(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.MailRequestBody
	)

	log.EnterFn(0, "SendMailToUserFromUI")
	defer func() { log.ExitFn(0, "SendMailToUserFromUI", nil) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ar schedule data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar schedule data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ar schedule data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get ar schedule data Request body", http.StatusBadRequest, nil)
		return
	}

	from := mail.NewEmail("OWE", "it@ourworldenergy.com")
	to := mail.NewEmail("", dataReq.ToMail)

	plainTextContent := dataReq.Message
	htmlContent := ""
	subject := dataReq.Subject

	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient("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")
	client.Send(message)

	FormAndSendHttpResp(resp, "Email send succesfully", http.StatusAccepted, fmt.Sprintf("email sent succesfully to %v", dataReq.ToMail), 1)
}
