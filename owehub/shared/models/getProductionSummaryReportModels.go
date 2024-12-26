/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for summary report models
 *	DATE        : 23-Dec-2024
 **************************************************************************/

package models

type ProductionSummaryReportRequest struct {
	Year       int      `json:"year"`
	ReportType string   `json:"report_type"`
	Office     []string `json:"office"`
}

type ProductionSummarySubReport struct {
	SubReportName string                   `json:"sub_report_name"`
	TableData     []map[string]interface{} `json:"table_data"`
	ChartData     []map[string]interface{} `json:"chart_data"`
}

type ProductionSummaryReportResponse struct {
	SubReports []ProductionSummarySubReport `json:"sub_reports"`
}
