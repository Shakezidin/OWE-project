/**************************************************************************
*	Function	: 	LeadsModels.go
*	DESCRIPTION : 	Files contains struct for get Leads data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

import "time"

type GetLeadsRequest struct {
	LeadStatusId int    `json:"status_id"`
	IsArchived   bool   `json:"is_archived"`
	PageNumber   int    `json:"page_number"`
	PageSize     int    `json:"page_size"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
}

type GetLeadsData struct {
	LeadID                     int64      `json:"leads_id"`
	StatusID                   int64      `json:"status_id"`
	FirstName                  string     `json:"first_name"`
	LastName                   string     `json:"last_name"`
	EmailID                    string     `json:"email_id"`
	PhoneNumber                string     `json:"phone_number"`
	StreetAddress              string     `json:"street_address"`
	City                       string     `json:"city"`
	State                      int64      `json:"state"`
	Zipcode                    int64      `json:"zipcode"`
	ProposalType               string     `json:"proposal_type"`
	FinanceType                string     `json:"finance_type"`
	FinanceCompany             string     `json:"finance_company"`
	SaleSubmissionTriggered    bool       `json:"sale_submission_triggered"`
	QCAudit                    string     `json:"qc_audit"`
	ProposalSigned             string     `json:"proposal_signed"`
	AppointmentStatus          string     `json:"appoment_status"`
	AppointmentDate            *time.Time `json:"appoment_date"`
	AppointmentDispositionNote string     `json:"appointment_disposition_note"`
	IsArchived                 bool       `json:"is_archived"`
	Notes                      string     `json:"notes"`
	ActionNeededMessage        string     `json:"action_needed_message"`
}

// This struct is for deleting Leads
type DeleteLeadsRequest struct {
	IDs []int64 `json:"ids"`
}

// This struct is for updating status WON
type StatusWinRequest struct {
	LeadsId int `json:"leads_id"`
}
