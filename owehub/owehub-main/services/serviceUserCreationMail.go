package services

import (
	log "OWEApp/shared/logger"
	"fmt"

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
