/**************************************************************************
 *      File            : email.go
 *      DESCRIPTION     : This file contains structure for email
 *      DATE            : 11-Jan-2024
**************************************************************************/

package email

type SendEmailRequest struct {
	ToName       string
	ToEmail      string
	Subject      string
	TemplateData any
}

/******************************************************************************
 *
 * Template Data Structures:
 * These represent the data that will be used to fill the email html templates.
 *
 * There is 1 convention for naming the structs:
 * TemplateData + <template name>
 * For example, if the template name is "LeadProposalSigned.html", then the struct
 * name will be "TemplateDataLeadProposalSigned".
 *
******************************************************************************/

type TemplateDataLeadProposalSigned struct {
	LeadId          int64
	LeadFirstName   string
	LeadLastName    string
	LeadEmailId     string
	LeadPhoneNumber string
	ProposalPdfUrl  string
	UserName        string
}
