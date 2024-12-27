/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for Quality Summary Report Models
 *	DATE        : 22-Dec-2024
 **************************************************************************/

package models

import "time"

type QualitySummaryReportRequest struct {
	ReportType string   `json:"report_type"`
	Year       int64    `json:"year"`
	Week       string   `json:"week"`
	Office     []string `json:"office"`
}

type FinSummaryReport struct {
	SourceOfFail        string    `json:"source_of_fail"`
	EmployeeResponsible string    `json:"employee_responsible"`
	Office              string    `json:"office"`
	AppStatus           string    `json:"app_status"`
	ProjectStatus       string    `json:"project_status"`
	PvRedlinedDate      time.Time `json:"pv_redlined_date"`
	PvFinDate           time.Time `json:"pv_fin_date"`
	FinRedlineReason    string    `json:"fin_redline_reason"`
	CustomerUniqueID    string    `json:"customer_unique_id"`
	Customer            string    `json:"customer"`
}

type PtoSummaryReport struct {
	PtoGranted          time.Time `json:"pto_granted"`           // Date when PTO was granted
	UtilityRedlinedDate time.Time `json:"utility_redlined_date"` // Date when utility was redlined
	Office              string    `json:"office"`                // Office name
	PtoAppStatus        string    `json:"pto_app_status"`        // PTO application status
	ProjectStatus       string    `json:"project_status"`        // Project status
	SourceOfFail        string    `json:"source_of_fail"`        // Source of failure
	EmployeeResponsible string    `json:"employee_responsible"`  // Employee responsible for the PTO
	RedlinedReason      string    `json:"redlined_reason"`       // Reason for redlining
	CustomerUniqueID    string    `json:"customer_unique_id"`    // Unique ID for the customer
	Customer            string    `json:"customer"`              // Customer name
}

type InstallFundingReport struct {
	ApprovedDate                  time.Time `json:"approved_date"`                    // Date when the installation was approved
	RedlinedDate                  time.Time `json:"redlined_date"`                    // Date when the installation was redlined
	Office                        string    `json:"office"`                           // Office name
	AppStatus                     string    `json:"app_status"`                       // Application status
	ProjectStatus                 string    `json:"project_status"`                   // Project status
	SourceOfFail                  string    `json:"source_of_fail"`                   // Source of failure
	EmployeeResponsibleForRedline string    `json:"employee_responsible_for_redline"` // Employee responsible for redlining
	RedlineReason                 string    `json:"redline_reason"`                   // Reason for redlining
	CustomerUniqueID              string    `json:"customer_unique_id"`               // Unique ID for the customer
	Customer                      string    `json:"customer"`                         // Customer name
}

type FinalFundingReport struct {
	Approved            time.Time `json:"approved"`             // Date when the funding was approved
	Redlined            time.Time `json:"redlined"`             // Date when the funding was redlined
	Office              string    `json:"office"`               // Office name
	AppStatus           string    `json:"app_status"`           // Application status
	ProjectStatus       string    `json:"project_status"`       // Project status
	SourceOfFail        string    `json:"source_of_fail"`       // Source of failure
	EmployeeResponsible string    `json:"employee_responsible"` // Employee responsible for redlining
	RedlineNotes        string    `json:"redline_notes"`        // Notes regarding redlining
	CustomerUniqueID    string    `json:"customer_unique_id"`   // Unique ID for the customer
	Customer            string    `json:"customer"`             // Customer name
}

//*===========

type QualitySummaryReportRequestResponse struct {
	Metrics []ResponseMetric `json:"metrics"`
	Charts  []ResponseChart  `json:"charts"` // Will hold multiple sets of 52 weeks data
}

type ResponseMetric struct {
	Type  string                 `json:"type"`
	Title string                 `json:"title"`
	Total string                 `json:"total"`
	Items map[string]interface{} `json:"items"`
}

// KVItem represents a key-value pair (for simple two-column tables)
type KVItem struct {
	Key   string `json:"key"`
	Value string `json:"value"`
}

// TableItem represents a table with multiple columns (for more than two columns)
type TableItem struct {
	Headers []string   `json:"headers"`
	Rows    [][]string `json:"rows"`
}

// Defining the structure for charts
type ResponseChart struct {
	Title string       `json:"title"`
	Weeks [][]WeekData `json:"weeks"` //Slice of slice // Multiple sets of 52 weeks of data
}
type WeekData struct {
	WeekNumber                int `json:"week_number"`
	PeoriaKingmanApproved     int `json:"Peoria_Kingman_Approved"`
	TempeApproved             int `json:"Tempe_Approved"`
	TucsonApproved            int `json:"Tucson_Approved"`
	AlbuquerqueEIPasoApproved int `json:"Albuquerque_EI_Paso_Approved"`
	TexasApproved             int `json:"Texas_Approved"`
	ColoradoApproved          int `json:"Colorado_Approved"`
}

// Office list Response
type GetOfficesListResponse struct {
	Offices []string `json:"offices"` // List of distinct office names
	States  []string `json:"states"`  // List of distinct states names
	Ahj     []string `json:"ahj"`     // List of distinct ahj names
}
