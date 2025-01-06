package models

// Model for **get report by id request**
type GetReportByIdReq struct {
    ReportId int64 `json:"report_id"`
}

// Response model for **get report by id request**
type GetReportByIdResponse struct {
    Category    string `json:"category"`
    Title       string `json:"title"`
    Subtitle    string `json:"subtitle"`
    DashboardId string `json:"dashboard_id"`
}

// Model for **edit report request**
type EditReportReq struct {
    ReportId    int64  `json:"report_id"`
    Category    string `json:"category"`
    Title       string `json:"title"`
    Subtitle    string `json:"subtitle"`
    DashboardId string `json:"dashboard_id"`
}

// Response model for **edit report request**
type EditReportResp struct {
    Message string `json:"message"`
}
