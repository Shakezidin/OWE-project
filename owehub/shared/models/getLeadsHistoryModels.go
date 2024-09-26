/**************************************************************************
*	Function	: 		LeadsHistoryModels.go
*	DESCRIPTION : 	Contains struct for LeadsHistory data models
*	DATE        : 	21-Sept-2024
**************************************************************************/

package models

import "time"

// the structure for filtering lead history (request from UI)
type GetLeadsHistoryRequest struct {
	LeadsStatus int64  `json:"leads_status"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	PageSize    int    `json:"page_size"`   // page size
	PageNumber  int    `json:"page_number"` // pagination page number
	// SortBy      string `json:"sort_by"`     // sort according to deal won or loss
}

// Sent to UI
type GetLeadsHistoryResponse struct {
	LeadsID       int64            `json:"leads_id"`
	FirstName     string           `json:"first_name"`
	LastName      string           `json:"last_name"`
	PhoneNumber   string           `json:"phone_number"`
	EmailId       string           `json:"email_id"`
	StreetAddress string           `json:"street_address"`
	Zipcode       string           `json:"zipcode"`
	DealDate      string           `json:"deal_date"`   // Deal date (updated_at)
	DealStatus    string           `json:"deal_status"` // Won or Lost
	Timeline      GetLeadsTimeline `json:"timeline"`    // Lead timeline embedded in the response
}

// Lead timeline containing relevant dates
type GetLeadsTimeline struct {
	AppointmentScheduledDate *time.Time `json:"appointment_scheduled_date"`
	AppointmentAcceptedDate  *time.Time `json:"appointment_accepted_date"`
	AppointmentDeclinedDate  *time.Time `json:"appointment_declined_date"`
	AppointmentDate          *time.Time `json:"appointment_date"`
	DealWonDate              *time.Time `json:"deal_won_date"`
	DealLostDate             *time.Time `json:"deal_lost_date"`
	ProposalSentDate         *time.Time `json:"proposal_sent_date"`
}

// Wraps the list of lead history responses
type GetLeadsHistoryList struct {
	LeadsHistoryList []GetLeadsHistoryResponse `json:"leads_history_list"`
	TotalRecords     int64                     `json:"total_records"` // Total records for pagination
}
