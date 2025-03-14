/**************************************************************************
 *	Function	: DealerApiModels.go
 *	DESCRIPTION : Files contains struct for get Dealer models
 *	DATE        : 28-May-2024
 **************************************************************************/

package models

type GetCsvDownload struct {
	Email             string `json:"email"`
	Role              string
	StartDate         string   `json:"start_date"`
	EndDate           string   `json:"end_date"`
	PageNumber        int      `json:"page_number"`
	PageSize          int      `json:"page_size"`
	DealerNames       []string `json:"dealer_names"`
	Recruiters        []string `json:"recruiter"`
	UniqueIds         []string `json:"unique_ids"`
	SelectedMilestone string   `json:"selected_milestone"`
	GroupBy           string   `json:"group_by"`
	ProjectStatus     []string `json:"project_status"`
	SortBy            string   `json:"sort_by"`
}

type GetCsvPerformance struct {
	UniqueId                string
	HomeOwner               string
	Email                   string
	PhoneNumber             string
	Address                 string
	State                   string
	ContractAmount          string
	SystemSize              string
	ContractDate            string
	SiteSurevyScheduleDate  string
	SiteSurveyCompletedDate string
	CadReadyDate            string
	CadCompletedDate        string
	PermitSubmittedDate     string
	IcSubmittedDate         string
	PermitApprovedDate      string
	IcApprovedDate          string
	RoofingCreatedDate      string
	RoofingCompleteDate     string
	PvInstallCreatedDate    string
	BatteryScheduledDate    string
	BatteryCompletedDate    string
	PvInstallCompletedDate  string
	MpuCreatedDate          string
	DerateCreateDate        string
	TrenchingWSOpenDate     string
	DerateCompleteDate      string
	MpucompleteDate         string
	TrenchingCompleteDate   string
	FinCreateDate           string
	FinPassDate             string
	PtoSubmittedDate        string
	PtoDate                 string
	DaysPendingNTP          string `json:"days_ntp,omitempty"`
	DaysPendingPermits      string `json:"days_permits,omitempty"`
	DaysPendingInstall      string `json:"days_install,omitempty"`
	DaysPendingPTO          string `json:"days_pto,omitempty"`
	DaysPendingProjectAge   string `json:"days_project_age,omitempty"`
	DaysPendingSurvey       string `json:"days_survey_design,omitempty"`
	DaysPendingCadDesign    string `json:"days_cad_design,omitempty"`
	DaysPendingRoofing      string `json:"days_roofing,omitempty"`
	DaysPendingInspection   string `json:"days_inspection,omitempty"`
	DaysPendingActivation   string `json:"days_activation,omitempty"`
}

type GetCsvPerformanceList struct {
	GetCsvPerformance []GetCsvPerformance `json:"performance_csv"`
}
