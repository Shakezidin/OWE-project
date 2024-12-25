/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for Quality Summary Report Models
 *	DATE        : 22-Dec-2024
 **************************************************************************/

package models

// for quality summary report
type QualitySummaryReportRequest struct {
	ReportType string   `json:"report_type"`
	Year       int64    `json:"year"`
	Week       string   `json:"week"`
	Office     []string `json:"office"`
}

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
