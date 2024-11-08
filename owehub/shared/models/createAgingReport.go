package models

type AgingReport struct {
	Days_Pending_NTP         string `json:"days_ntp,omitempty"`
	Days_Pending_Permits     string `json:"days_permints,omitempty"`
	Days_Pending_Install     string `json:"days_install,omitempty"`
	Days_Pending_PTO         string `json:"days_pto,omitempty"`
	Days_Pending_Project_Age string `json:"days_project_age,omitempty"`
}
