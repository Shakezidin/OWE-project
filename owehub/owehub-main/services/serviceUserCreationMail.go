package services

import (
	log "OWEApp/shared/logger"
	"fmt"
	"net/smtp"
)

/******************************************************************************
 * FUNCTION:		SendMailToClient
 * DESCRIPTION:     function to send the mail of user creation to client
 * INPUT:			email
 * RETURNS:    		void
 ******************************************************************************/
func SendMailToClient(email string, username string) error {
	log.EnterFn(0, "SendMailToClient")
	defer func() { log.ExitFn(0, "SendMailToClient", nil) }()

	to := email
	subject := "Welcome to Our World Energy!"
	body := fmt.Sprintf("Dear %s,\n\nWe're thrilled to welcome you to Our World Energy!\n\nYour account has been successfully created.\n\nHere are your account details:\nEmail: %s\nPassword: %s\n\nThank you for choosing us!\nLogin Url: http://144.202.31.130:3000/login \n\nBest regards,\nThe Team", username, email, createUserReqPassword)
	// Set up the authentication
	auth := smtp.PlainAuth("", FromEmailId, FromPassword, "smtp.gmail.com")

	// Set up the email content
	msg := []byte("To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body)

	log.FuncDebugTrace(0, "Shushank %+v", string(msg))

	// Connect to the SMTP server and send the email
	err := smtp.SendMail("smtp.gmail.com:587", auth, FromEmailId, []string{to}, msg)
	if err != nil {
		return err
	}

	return nil
}
