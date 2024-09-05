/**************************************************************************
*	Function	: 		SchedulingHomeModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										SchedulingHome data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

import "time"

type GetSchedulingHomeRequest struct {
	Queue      string `json:"queue"`
	Order      string `json:"order"`
	PageNumber int64  `json:"page_number"`
	PageSize   int64  `json:"page_size"`
}

type CreateSchedulingHome struct {
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
}

type GetSchedulingHome struct {
	RoofType            string  `json:"roof_type"`
	HomeOwner           string  `json:"home_owner"`
	CustomerEmail       string  `json:"customer_email"`
	CustomerPhoneNumber string  `json:"customer_phone_number"`
	SystemSize          float64 `json:"system_size"`
	Address             string  `json:"address"`
}

type GetSchedulingHomeList struct {
	SchedulingHomeList []GetSchedulingHome `json:"scheduling_list"`
}

type UpdateSchedulingHome struct {
	RecordId    int     `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
}

type ArchiveSchedulingHome struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}

type CreateSchedulingProjectReq struct {
	FirstName         string     `json:"first_name"`
	LastName          string     `json:"last_name"`
	Email             string     `json:"email"`
	Phone             string     `json:"phone"`
	Address           string     `json:"address"`
	RoofType          string     `json:"roof_type"`
	HouseStories      int        `json:"house_stories"`
	HouseAreaSqft     float64    `json:"house_area_sqft"`
	SystemSize        float64    `json:"system_size"`
	IsBatteryIncluded bool       `json:"is_battery_included"`
	SalesRepEmailID   string     `json:"sales_rep_email_id"`
	SiteSurveyStartDt *time.Time `json:"site_survey_start_dt,omitempty"`
	SiteSurveyEndDt   *time.Time `json:"site_survey_end_dt,omitempty"`
	Backup3           string     `json:"backup_3,omitempty"`
	Backup4           string     `json:"backup_4,omitempty"`
}

type UpdateSchedulingProjectReq struct {
	Email                 string     `json:"email"`
	IsAppointmentApproved bool       `json:"is_appointment_approved"`
	SiteSurveyStartDt     *time.Time `json:"site_survey_start_dt,omitempty"`
	SiteSurveyEndDt       *time.Time `json:"site_survey_end_dt,omitempty"`
}

type GetSchedulingProjectsReq struct {
	PageNumber int64 `json:"page_number"`
	PageSize   int64 `json:"page_size"`
}

type GetSchedulingProjects struct {
	FirstName    string  `json:"first_name"`
	LastName     string  `json:"last_name"`
	Email        string  `json:"email"`
	Phone        string  `json:"phone"`
	Address      string  `json:"address"`
	RoofType     string  `json:"roof_type"`
	SystemSize   float64 `json:"system_size"`
	SalesRepName string  `json:"sales_rep_name"`
}

type GetSchedulingProjectsList struct {
	SchedulingList []GetSchedulingProjects `json:"scheduling_list"`
}
