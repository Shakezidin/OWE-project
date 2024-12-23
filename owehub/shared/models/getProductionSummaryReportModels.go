/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for summary report models
 *	DATE        : 22-Dec-2024
 **************************************************************************/

package models

//import "time"

type ProductionSummaryReportRequest struct {

	Year       string   `json:"year"`
	Week       string   `json:"week"`
	Day        string   `json:"day"`
	ReportType string   `json:"report_type"`
	Office     []string   `json:"office"`
}

type ProductionSummarySubReport struct {
    SubReportName string                 `json:"sub_report_name"`
    Fields        []string               `json:"fields,omitempty"`
    Data          []map[string]interface{} `json:"data,omitempty"` 
}

type ProductionSummaryReportResponse struct {
		ReportType string                    `json:"report_type"`
		Year       string                    `json:"year"`
		Week       string                    `json:"week"`
		Day        string                    `json:"day"`
		SubReports []ProductionSummarySubReport `json:"sub_reports"`
}
