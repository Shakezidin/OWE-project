/**************************************************************************
 *	Function	: apiGetPeriodicWonLostLeads.go
 *	DESCRIPTION : Files contains struct for get performance tile data models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type PipelineDealerDataList struct {
	PipelineDealerDataList []PipelineDealerData `json:"pipeline_dealer_data_list"`
}

type PipelineDealerData struct {
	HomeOwner             string `json:"home_owner"`
	PartnerDealer         string `json:"partner_dealer"`
	FinanceCompany        string `json:"finance_company"`
	Type                  string `json:"type"`
	LoanType              string `json:"loan_type"`
	UniqueId              string `json:"unique_id"`
	StreetAddress         string `json:"street_address"`
	State                 string `json:"state"`
	Email                 string `json:"email"`
	PhoneNumber           string `json:"phone_number"`
	Rep1                  string `json:"rep_1"`
	Rep2                  string `json:"rep_2"`
	SystemSize            string `json:"system_size"`
	ContractAmount        string `json:"contract_amount"`
	CreatedDate           string `json:"created_date"`
	ContractDate          string `json:"contract_date"`
	SurveyCompletionDate  string `json:"survey_final_completion_date"`
	NtpCompleteDate       string `json:"ntp_complete_date"`
	PermitSubmitDate      string `json:"permit_submit_date"`
	PermitApprovalDate    string `json:"permit_approval_date"`
	IcSubmitDate          string `json:"ic_submit_date"`
	IcApprovalDate        string `json:"ic_approval_date"`
	JeopardyStatus        bool   `json:"jeopardy_date"`
	CancelDate            string `json:"cancel_date"`
	PvInstallDate         string `json:"pv_install_date"`
	FinCompleteDate       string `json:"fin_complete_date"`
	PtoDate               string `json:"pto_date"`
	DaysPendingNTP        string `json:"days_ntp,omitempty"`
	DaysPendingPermits    string `json:"days_permits,omitempty"`
	DaysPendingInstall    string `json:"days_install,omitempty"`
	DaysPendingPTO        string `json:"days_pto,omitempty"`
	DaysPendingProjectAge string `json:"days_project_age,omitempty"`
	DaysPendingSurvey     string `json:"days_survey_design,omitempty"`
	DaysPendingCadDesign  string `json:"days_cad_design,omitempty"`
	DaysPendingRoofing    string `json:"days_roofing,omitempty"`
	DaysPendingInspection string `json:"days_inspection,omitempty"`
	DaysPendingActivation string `json:"days_activation,omitempty"`
}
