package models




//model for get report by id request

type GetReportByIdReq struct {
	ReportId int64 `json:"report_id"`
}

//response model for get report by id request

type GetReportByIdResponse struct {
	Category    string  `json:"category"`
	Title       string `json:"title"`
	Subtitle    string `json:"subtitle"`
	DashboardId string `json:"dashboard_id"`
}
