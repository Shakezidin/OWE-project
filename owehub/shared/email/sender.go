/**************************************************************************
 *	File            : sender.go
 * 	DESCRIPTION     : This file contains functions to send emails
 *	DATE            : 11-Jan-2024
 **************************************************************************/
package email

import (
	log "OWEApp/shared/logger"
	"OWEApp/shared/types"
	"bytes"
	"errors"
	"os"
	"reflect"
	"strings"
	"text/template"

	"github.com/sendgrid/rest"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

var emailTemplate *template.Template

func getEmailTemplate() (*template.Template, error) {
	var err error
	log.EnterFn(0, "getEmailTemplate")
	defer func() { log.ExitFn(0, "getEmailTemplate", err) }()

	if emailTemplate != nil {
		return emailTemplate, nil
	}

	emailTemplate, err = template.ParseFS(os.DirFS("email-templates"), "*.html")

	if err != nil {
		return nil, err
	}

	return emailTemplate, nil
}

/******************************************************************************
 * FUNCTION:        RenderTemplate
 *
 * DESCRIPTION:     This function will render the email template. Exposed for
 *                  testing purposes.
 * INPUT:           templateData
 * RETURNS:         string
 ******************************************************************************/
func RenderTemplate(templateData any) (string, error) {
	var (
		err        error
		tmplName   string
		emailTmpl  *template.Template
		tmplWriter *bytes.Buffer
	)

	log.EnterFn(0, "RenderTemplate")
	defer func() { log.ExitFn(0, "RenderTemplate", err) }()

	if !isLoaded {
		err = errors.New("Email config is not loaded. Call FetchEmailCfg() on service init to do it.")
		log.FuncErrorTrace(0, "%v", err)
		return "", err
	}

	emailTmpl, err = getEmailTemplate()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read email template err: %v", err)
		return "", err
	}

	tmplName, _ = strings.CutPrefix(reflect.TypeOf(templateData).Name(), "TemplateData")
	tmplName = tmplName + ".html"

	tmplWriter = bytes.NewBufferString("")

	err = emailTmpl.ExecuteTemplate(tmplWriter, tmplName, templateData)
	if err != nil {
		log.FuncErrorTrace(0, "Bad input data for email template err: %v", err)
		return "", err
	}

	return tmplWriter.String(), nil
}

/******************************************************************************
 * FUNCTION:        SendEmail
 *
 * DESCRIPTION:     This function will send the email
 * INPUT:           toEmail
 *                  subject
 *                  body
 * RETURNS:         error
 ******************************************************************************/
func SendEmail(request SendEmailRequest) error {
	var (
		err       error
		emailHtml string
		resp      *rest.Response
	)

	log.EnterFn(0, "SendEmail")
	defer func() { log.ExitFn(0, "SendEmail", err) }()

	emailHtml, err = RenderTemplate(request.TemplateData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to render email template err: %v", err)
		return err
	}

	// Send the email
	from := mail.NewEmail(types.CommGlbCfg.EmailCfg.SenderName, types.CommGlbCfg.EmailCfg.SenderEmail)
	to := mail.NewEmail(request.ToName, request.ToEmail)
	message := mail.NewSingleEmail(from, request.Subject, to, "", emailHtml)
	client := sendgrid.NewSendClient(types.CommGlbCfg.EmailCfg.SendgridKey)
	resp, err = client.Send(message)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to send email err: %v", err)
		return err
	}

	log.FuncDebugTrace(0, "Email sent successfully with response %+v", resp.Body)

	return nil
}
