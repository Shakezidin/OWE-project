package models

import (
	"time"
)

type GetLeadInfoRequest struct {
	LeadsID int64 `json:"leads_id"`
}

// Lead info data
type GetLeadInfoRes struct {
	LeadsID                  int64      `json:"leads_id"`
	FirstName                string     `json:"first_name"`
	LastName                 string     `json:"last_name"`
	PhoneNumber              string     `json:"phone_number"`
	EmailId                  string     `json:"email_id"`
	StreetAddress            string     `json:"street_address"`
	StatusID                 int64      `json:"status_id"`
	CreatedAt                *time.Time `json:"created_at,omitempty"`
	AppointmentDate          *time.Time `json:"appointment_date,omitempty"`
	AppointmentScheduledDate *time.Time `json:"appointment_scheduled_date,omitempty"`
	AppointmentAcceptedDate  *time.Time `json:"appointment_accepted_date,omitempty"`
	AppointmentDeclinedDate  *time.Time `json:"appointment_declined_date,omitempty"`
}
