/**************************************************************************
*	Function	: 		LeadsHistoryModels.go
*	DESCRIPTION : 	Contains struct for LeadsHistory data models
*	DATE        : 	21-Sept-2024
**************************************************************************/

package models

import (
	"time"
)

// the structure for filtering lead history (request from UI)
type GetLeadsHistoryRequest struct {
	LeadsStatus int64  `json:"leads_status"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	IsArchived  bool   `json:"is_archived"`
	PageSize    int    `json:"page_size"`   // page size
	PageNumber  int    `json:"page_number"` // pagination page number
}

// Lead timeline containing relevant dates
type GetLeadsTimelineItem struct {
	Label string     `json:"label"`
	Date  *time.Time `json:"date"`
}

// Sent to UI
type GetLeadsHistoryResponse struct {
	LeadsID       int64                  `json:"leads_id"`
	StatusID      int64                  `json:"status_id"`
	FirstName     string                 `json:"first_name"`
	LastName      string                 `json:"last_name"`
	PhoneNumber   string                 `json:"phone_number"`
	EmailId       string                 `json:"email_id"`
	StreetAddress string                 `json:"street_address"`
	DealDate      *time.Time             `json:"deal_date"`
	DealStatus    string                 `json:"deal_status"` // Won or Lost
	SetterName    string                 `json:"setter_name"` // New field
	Timeline      []GetLeadsTimelineItem `json:"timeline"`
}

// Wraps the list of lead history responses
type GetLeadsHistoryList struct {
	LeadsHistoryList []GetLeadsHistoryResponse `json:"leads_history_list"`
}
