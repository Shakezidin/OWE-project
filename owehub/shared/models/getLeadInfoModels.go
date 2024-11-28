package models

import (
	"time"
)

type GetLeadInfoRequest struct {
	LeadsID int64 `json:"leads_id"`
}

// Lead info data
type GetLeadInfoRes struct {
	LeadsID                    int64      `json:"leads_id"`
	FirstName                  string     `json:"first_name"`
	LastName                   string     `json:"last_name"`
	PhoneNumber                string     `json:"phone_number"`
	EmailId                    string     `json:"email_id"`
	StreetAddress              string     `json:"street_address"`
	City                       string     `json:"city"`
	FinanceType                string     `json:"finance_type"`
	FinanceCompany             string     `json:"finance_company"`
	SaleSubmissionTriggered    bool       `json:"sale_submission_triggered"`
	QCAudit                    bool       `json:"qc_audit"`
	ProposalPdfUrl             string     `json:"proposal_pdf_url"`
	ProposalSigned             bool       `json:"proposal_signed"`
	AppointmentDisposition     string     `json:"appointment_disposition"`
	AppointmentDispositionNote string     `json:"appointment_disposition_note"`
	Notes                      string     `json:"notes"`
	CreatedAt                  *time.Time `json:"created_at"`
	UpdatedAt                  *time.Time `json:"updated_at"`
	AppointmentScheduledDate   *time.Time `json:"appointment_scheduled_date"`
	AppointmentAcceptedDate    *time.Time `json:"appointment_accepted_date"`
	AppointmentDeclinedDate    *time.Time `json:"appointment_declined_date"`
	LeadWonDate                *time.Time `json:"lead_won_date"`
	AppointmentDate            *time.Time `json:"appointment_date"`
	LeadLostDate               *time.Time `json:"lead_lost_date"`
	ProposalCreatedDate        *time.Time `json:"proposal_created_date"`
	StatusID                   int64      `json:"status_id"`
	CreatedByName              string     `json:"created_by"`
	ProposalType               string     `json:"proposal_type"`
	SalesRepName               string     `json:"sales_rep_name"`
	LeadSource                 string     `json:"lead_source"`
	SetterName                 string     `json:"setter_name"`
}
