package services

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strings"

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
	htmlContent := dataReq.HtmlContent
	subject := dataReq.Subject

	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient("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")
	client.Send(message)

	FormAndSendHttpResp(resp, "Email send succesfully", http.StatusAccepted, fmt.Sprintf("email sent succesfully to %v", dataReq.ToMail), 1)
}

/***************************************************************************************
 * FUNCTION:		SendMailtoITfromUser
 * DESCRIPTION:     sending an email from a user to the IT department
 * INPUT:			attachments
 * RETURNS:    		void
***************************************************************************************/
func SendMailtoITfromUser(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.UserEmailBody
	)

	// Logging
	log.EnterFn(0, "SendMailtoITfromUser")
	defer func() { log.ExitFn(0, "SendMailtoITfromUser", nil) }()

	// Parse multipart form data
	err = req.ParseMultipartForm(10 << 20) // Limit to 10 MB
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse multipart form: %v", err)
		FormAndSendHttpResp(resp, "Failed to parse multipart form", http.StatusBadRequest, nil)
		return
	}

	// Extract JSON body
	jsonData := req.FormValue("data")
	if jsonData == "" {
		err = fmt.Errorf("missing JSON body")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Missing JSON body", http.StatusBadRequest, nil)
		return
	}

	// Unmarshal JSON body into dataReq
	err = json.Unmarshal([]byte(jsonData), &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal JSON body: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal JSON body", http.StatusBadRequest, nil)
		return
	}

	// Process attachment if present
	var attachment *mail.Attachment
	if file, fileHeader, err := req.FormFile("attachment"); err == nil {
		defer file.Close()

		// Check file type
		contentType := fileHeader.Header.Get("Content-Type")
		if !strings.HasPrefix(contentType, "image/") || (contentType != "image/png" && contentType != "image/jpeg" && contentType != "image/jpg") {
			log.FuncErrorTrace(0, "Unsupported file type: %v", contentType)
			FormAndSendHttpResp(resp, "Unsupported file type. Only png, jpg, jpeg are allowed.", http.StatusBadRequest, nil)
			return
		}

		// Read file content
		fileContent, err := io.ReadAll(file)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to read file content: %v", err)
			FormAndSendHttpResp(resp, "Failed to read file content", http.StatusBadRequest, nil)
			return
		}

		// Create attachment
		encoded := base64.StdEncoding.EncodeToString(fileContent)
		attachment = mail.NewAttachment()
		attachment.SetContent(encoded)
		attachment.SetType(contentType)
		attachment.SetFilename(fileHeader.Filename)
		attachment.SetDisposition("attachment")
	}

	from := mail.NewEmail("OWE", "it@ourworldenergy.com")
	to := mail.NewEmail("", dataReq.ToMail)
	plainTextContent := dataReq.Message
	htmlContent := dataReq.HtmlContent
	subject := dataReq.Subject

	// Optionally include issue in the message if provided
	if dataReq.Issue != nil {
		plainTextContent += fmt.Sprintf("\n\nIssue: %s", *dataReq.Issue)
		htmlContent += fmt.Sprintf("<br><br><b>Issue:</b> %s", *dataReq.Issue)
	}

	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)

	// Add attachment if present
	if attachment != nil {
		message.AddAttachment(attachment)
	}

	// Send the email
	client := sendgrid.NewSendClient("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")
	_, err = client.Send(message)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to send email: %v", err)
		FormAndSendHttpResp(resp, "Failed to send email", http.StatusInternalServerError, nil)
		return
	}

	// Respond to client
	FormAndSendHttpResp(resp, "Email sent successfully", http.StatusAccepted, fmt.Sprintf("Email sent successfully to %v", dataReq.ToMail), 1)
}
