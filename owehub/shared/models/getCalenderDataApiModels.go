package models

type GetCalenderDataReq struct {
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
	Email     string
	Role      string
	Name      string
}

type GetCalenderData struct {
	SurveyStatus  string `json:"survey_status"`
	UniqueId      string `json:"unique_id"`
	Address       string `json:"address"`
	HomeOwner     string `json:"hoeme_owner"`
	InstallStatus string `json:"install_status"`
	SurveyDate    string `json:"survey_date"`
	InstallDate   string `json:"install_date"`
}

type GetCalenderDataList struct {
	CalenderDataList []GetCalenderData `json:"calender_data_list"`
}
