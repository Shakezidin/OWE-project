package services

import (
	"OWEApp/shared/appserver"
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

	plainTextContent := ""

	htmlContent := fmt.Sprintf(`
	<html>
  <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        background-color: #ffffff;
        margin: 50px auto;
        padding: 20px;
        max-width: 600px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="text-align: center; padding-bottom: 20px">
        <h1 style="font-size: 24px; color: #333333; margin: 0">
          Welcome to Our World Energy
        </h1>
      </div>
      <div style="font-size: 16px; color: #555555; line-height: 1.6">
        <p>Dear %s,</p>
        <p>
          We're excited to have you on
          board and can't wait for you to start exploring our platform.
        </p>
        <p>
          To get started, please take a moment to set up your account. This will
          help you access all the features and resources available to you.
        </p>
        <p>
          <a 
		    clicktracking="off"
            href="https://www.owe-hub.com/login"
            style="color: #007bff; border-radius: 5px"
            >Click here to set up your account</a
          >
        </p>

        <p><strong>Email:</strong> %s</p>
        <p><strong>Password:</strong>%s</p>

        <p>Here's a quick guide to help you through the setup process:</p>
        <p>
          <a 
		    clicktracking="off"
            href="https://www.loom.com/share/a19e3761db904b1fb91c69de971a597a"
            style="color: #007bff"
            >Watch the Setup Video</a
          >
        </p>
        <p>
          If you have any questions or need assistance, feel free to reach out
          to our IT team at
          <a 
		    clicktracking="off"
            href="mailto:it@ourworldenergy.com"
            style="color: #007bff; text-decoration: none"
            >it@ourworldenergy.com</a
          >.
        </p>
        <p>
          Thank you for joining us, and we look forward to supporting you on
          your journey!
        </p>
        <p style="margin-top: 30px">Thanks again,</p>
        <p>Warm regards,<br /><strong>OWE IT Team</strong></p>
      </div>
      <div
        style="
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #888888;
        "
      >
        <p>&copy; 2024 Our World Energy. All rights reserved.</p>

        <img
          src="https://res.cloudinary.com/duscqq0ii/image/upload/v1737059485/1664759243008_np5w0v.jpg"
		  width="300"
        />
      </div>
    </div>
  </body>
</html>
   `,
		username, email, createUserReqPassword,
	)

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
 * FUNCTION:		SendPasswordResetSuccessMailToClient
 * DESCRIPTION:     Function to send a password reset confirmation email to the client
 * INPUT:			email, username
 * RETURNS:    		error
 ******************************************************************************/
func SendPasswordResetSuccessMailToClient(email string, username string) (err error) {

	log.EnterFn(0, "SendPasswordResetSuccessMailToClient")
	defer func() { log.ExitFn(0, "SendPasswordResetSuccessMailToClient", nil) }()

	from := mail.NewEmail("OWE", "it@ourworldenergy.com")
	subject := "Password Reset Successful - Our World Energy"
	to := mail.NewEmail("", email)

	plainTextContent := ""

	htmlContent := fmt.Sprintf(`
	<html>
  <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        background-color: #ffffff;
        margin: 50px auto;
        padding: 20px;
        max-width: 600px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      "
    >
      <div style="text-align: center; padding-bottom: 20px">
        <h1 style="font-size: 24px; color: #333333; margin: 0">
          Password Reset Successful
        </h1>
      </div>
      <div style="font-size: 16px; color: #555555; line-height: 1.6">
        <p>Dear %s,</p>
        <p>
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <p><strong>Email:</strong> %s</p>
        <p><strong>New Password:</strong> Welcome@123</p>
        <p>
          Please remember to change your password after logging in to keep your account secure.
        </p>
        <p>
          If you have any questions or need further assistance, feel free to contact our IT team at
          <a 
            clicktracking="off"
            href="mailto:it@ourworldenergy.com"
            style="color: #007bff; text-decoration: none"
            >it@ourworldenergy.com</a
          >.
        </p>
        <p style="margin-top: 30px">Best regards,</p>
        <p>OWE IT Team</p>
      </div>
      <div
        style="
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #888888;
        "
      >
        <p>&copy; 2024 Our World Energy. All rights reserved.</p>
        <img
          src="https://res.cloudinary.com/duscqq0ii/image/upload/v1737059485/1664759243008_np5w0v.jpg"
          width="300"
        />
      </div>
    </div>
  </body>
</html>
   `,
		username, email,
	)

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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ar schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get ar schedule data Request body", http.StatusBadRequest, nil)
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

	appserver.FormAndSendHttpResp(resp, "Email send succesfully", http.StatusAccepted, fmt.Sprintf("email sent succesfully to %v", dataReq.ToMail), 1)
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
		appserver.FormAndSendHttpResp(resp, "Failed to parse multipart form", http.StatusBadRequest, nil)
		return
	}

	// Extract JSON body
	jsonData := req.FormValue("data")
	if jsonData == "" {
		err = fmt.Errorf("missing JSON body")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Missing JSON body", http.StatusBadRequest, nil)
		return
	}

	// Unmarshal JSON body into dataReq
	err = json.Unmarshal([]byte(jsonData), &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal JSON body: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal JSON body", http.StatusBadRequest, nil)
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
			appserver.FormAndSendHttpResp(resp, "Unsupported file type. Only png, jpg, jpeg are allowed.", http.StatusBadRequest, nil)
			return
		}

		// Read file content
		fileContent, err := io.ReadAll(file)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to read file content: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to read file content", http.StatusBadRequest, nil)
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

	dataReq.ToMail = "it@ourworldenergy.com"

	from := mail.NewEmail("OWE", "it@ourworldenergy.com")
	to := mail.NewEmail("", "it@ourworldenergy.com")
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
		appserver.FormAndSendHttpResp(resp, "Failed to send email", http.StatusInternalServerError, nil)
		return
	}

	// Respond to client
	appserver.FormAndSendHttpResp(resp, "Email sent successfully", http.StatusAccepted, fmt.Sprintf("Email sent successfully to %v", dataReq.ToMail), 1)
}
