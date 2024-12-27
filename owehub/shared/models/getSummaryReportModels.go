/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for summary report models
 *	DATE        : 22-Dec-2024
 **************************************************************************/

package models

type SummaryReportRequest struct {
	Year       string   `json:"year"`
	Week       string   `json:"week"`
	ReportType string   `json:"report_type"`
	Office     []string `json:"office"`
}

type TimelineReportRequest struct {
	Year    string   `json:"year"`
	Quarter []int    `json:"quarter"`
	State   []string `json:"state"`
	Ahj     []string `json:"ahj"`
	Office  []string `json:"office"`
}

type SaleToInstallSpeedSummaryReportRequest struct {
	Year            string   `json:"year"`
	Week            string   `json:"week"`
	BatteryIncluded string   `json:"batteryincluded"`
	Office          []string `json:"office"`
}

type DataPoint struct {
	Value map[string]interface{} `json:"value"`
	Index int                    `json:"index,omitempty"`
}

type SummaryReportResponse struct {
	Data    map[string][]DataPoint `json:"data"`
	Summary interface{}            `json:"summary,omitempty"`
}
