/**************************************************************************
*	Function	: 	LeadsModels.go
*	DESCRIPTION : 	Files contains struct for get Leads data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

import "time"

type GetLeadsRequest struct {
	LeadStatus     string `json:"status"`
	Search         string `json:"search"`
	ProgressFilter string `json:"progress_filter"`
	IsArchived     bool   `json:"is_archived"`
	PageNumber     int    `json:"page_number"`
	PageSize       int    `json:"page_size"`
	StartDate      string `json:"start_date"`
	EndDate        string `json:"end_date"`
}

type GetLeadsData struct {
	LeadID                 int64      `json:"leads_id"`
	StatusID               int64      `json:"status_id"`
	FirstName              string     `json:"first_name"`
	LastName               string     `json:"last_name"`
	EmailID                string     `json:"email_id"`
	PhoneNumber            string     `json:"phone_number"`
	StreetAddress          string     `json:"street_address"`
	AppointmentStatusLabel string     `json:"appointment_status_label"`
	AppointmentStatusDate  *time.Time `json:"appointment_status_date"`
	WonLostLabel           string     `json:"won_lost_label"`
	WonLostDate            *time.Time `json:"won_lost_date"`
	FinanceCompany         string     `json:"finance_company"`
	FinanceType            string     `json:"finance_type"`
	QCAudit                string     `json:"qc_audit"`
	ProposalID             string     `json:"proposal_id"`
	ProposalStatus         string     `json:"proposal_status"`
}

// This struct is for deleting Leads
type DeleteLeadsRequest struct {
	IDs []int64 `json:"ids"`
}

// This struct is for updating status WON
type StatusWinRequest struct {
	LeadsId int `json:"leads_id"`
}
