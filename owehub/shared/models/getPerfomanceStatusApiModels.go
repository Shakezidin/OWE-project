/**************************************************************************
 *	Function	: getPerfomanceStatusApiModels.go
 *	DESCRIPTION : Files contains struct for PerfomanceStatus request
 *	DATE        : 07-May-2024
 **************************************************************************/

package models

type EmptyReq struct{}

type PerfomanceStatusReqOld struct {
	PageNumber        int    `json:"page_number"`
	PageSize          int    `json:"page_size"`
	SelectedMilestone string `json:"selected_milestone"`
	Email             string
	UniqueIds         []string `json:"unique_ids"`
	ProjectLimit      int
	DealerNames       []string `json:"dealer_names"`
	IntervalDays      string
	ItemLastSeen      int64    `json:"item_last_seen"`
	StartDate         string   `json:"start_date"`
	EndDate           string   `json:"end_date"`
	ProjectStatus     []string `json:"project_status"`
}

type PerfomanceStatusReq struct {
	PageNumber              int    `json:"page_number"`
	PageSize                int    `json:"page_size"`
	SelectedMilestone       string `json:"selected_milestone"`
	Email                   string
	UniqueIds               []string `json:"unique_ids"`
	DealerNames             []string `json:"dealer_names"`
	ProjectStatus           []string `json:"project_status"`
	Fields                  []string `json:"fields,omitempty"`
	ProjectPendingStartDate int64    `json:"pending_start_date,omitempty"`
	ProjectPendingEndDate   int64    `json:"pending_end_date,omitempty"`
}

type PerfomanceTileDataReq struct {
	Email         string
	DealerNames   []string `json:"dealer_names"`
	ProjectStatus []string `json:"project_status"`
}

type PerfomanceTileDataResponse struct {
	SiteSurveyCount  int64 `json:"site_survey_count"`
	CadDesignCount   int64 `json:"cad_design_count"`
	PerimittingCount int64 `json:"permitting_count"`
	RoofingCount     int64 `json:"roofing_count"`
	InstallCount     int64 `json:"isntall_count"`
	ElectricalCount  int64 `json:"electrical_count"`
	InspectionCount  int64 `json:"inspection_count"`
	ActivationCount  int64 `json:"activation_count"`
}

type PerfomanceResponse struct {
	UniqueId          string `json:"unqiue_id"`
	Customer          string `json:"customer"`
	SiteSurevyDate    string `json:"site_survey_date"`
	CadDesignDate     string `json:"cad_design_date"`
	PermittingDate    string `json:"permitting_date"`
	RoofingDate       string `json:"roofing_date"`
	InstallDate       string `json:"install_date"`
	ElectricalDate    string `json:"electrical_date"`
	InspectionDate    string `json:"inspection_date"`
	ActivationDate    string `json:"activation_date"`
	SiteSurveyColour  string `json:"site_survey_colour"`
	CADDesignColour   string `json:"cad_design_colour"`
	PermittingColour  string `json:"permitting_colour"`
	RoofingColour     string `json:"roofing_colour"`
	InstallColour     string `json:"install_colour"`
	ElectricalColour  string `json:"electrical_colour"`
	InspectionsColour string `json:"inspectionsColour"`
	ActivationColour  string `json:"activation_colour"`
	CADLink           string `json:"cad_link"`
	DATLink           string `json:"dat_link"`
	PodioLink         string `json:"podio_link"`
	CoStatus          string `json:"co_status"`
	Ntp               NTP    `json:"ntp"`
	Qc                QC     `json:"qc"`
	NTPdate           string `json:"ntp_date"`
	// Aging Report fields remain as string
	Days_Pending_NTP         string `json:"days_ntp,omitempty"`
	Days_Pending_Permits     string `json:"days_permits,omitempty"`
	Days_Pending_Install     string `json:"days_install,omitempty"`
	Days_Pending_PTO         string `json:"days_pto,omitempty"`
	Days_Pending_Project_Age string `json:"days_project_age,omitempty"`
	Days_Pending_Survey      string `json:"days_survey_design,omitempty"`
	Days_Pending_Cad_Design  string `json:"days_cad_design,omitempty"`
	Days_Pending_Roofing     string `json:"days_roofing,omitempty"`
	Days_Pending_Inspection  string `json:"days_inspection,omitempty"`
	Days_Pending_Activation  string `json:"days_activation,omitempty"`
}

type PerfomanceListResponse struct {
	PerfomanceList []PerfomanceResponse `json:"perfomance_response_list"`
}

// shift the below struct to project

type ProjectStatusReq struct {
	Email         string
	UniqueId      string `json:"unique_id"`
	Customer      string `json:"customer"`
	UniqueIds     []string
	ProjectLimit  int
	ProjectStatus []string `json:"project_status"`
	DealerNames   []string
}

// project management list
type ProjectLstResponse struct {
	UniqueId string `json:"unqiue_id"`
	Customer string `json:"customer"`
}

type ProjectLstsResponse struct {
	ProjectList []ProjectLstResponse `json:"project_response_list"`
}

var ColumnToFields = map[string]string{
	"unique_id": "UniqueId",
}

// project management

type ProjectListResponse struct {
	ProjectList []ProjectResponse `json:"project_response_list"`
	CADLink     string            `json:"cad_link"`
	DATLink     string            `json:"dat_link"`
	PodioLink   string            `json:"podio_link"`
	CoStatus    string            `json:"co_status"`
	Ntp         NTP               `json:"ntp"`
	Qc          QC                `json:"qc"`
}

type QC struct {
	PowerClerk                           string `json:"powerclerk_sent_az"`
	ACHWaiveSendandSignedCashOnly        string `json:"ach_waiver_sent_and_signed_cash_only"`
	GreenAreaNMOnly                      string `json:"green_area_nm_only"`
	FinanceCreditApprovalLoanorLease     string `json:"finance_credit_approved_loan_or_lease"`
	FinanceAgreementCompletedLoanorLease string `json:"finance_agreement_completed_loan_or_lease"`
	OWEDocumentsCompleted                string `json:"owe_documents_completed"`
	ActionRequiredCount                  int64  `json:"qc_action_required_count"`
}

type NTP struct {
	ProductionDiscrepancy        string `json:"production_discrepancy"`
	FinanceNTPOfProject          string `json:"finance_NTP_of_project"`
	UtilityBillUploaded          string `json:"utility_bill_uploaded"`
	PowerClerkSignaturesComplete string `json:"powerclerk_signatures_complete"`
	ActionRequiredCount          int64  `json:"action_required_count"`
}

type ProjectResponse struct {
	UniqueId                     string            `json:"unqiue_id"`
	SalesCompleted               string            `json:"sales_completed"`
	NtpCompleted                 string            `json:"ntp_completed"`
	SiteSurveyScheduled          string            `json:"site_survey_scheduled"`
	SiteSurevyRescheduled        string            `json:"site_survey_rescheduled"`
	SiteSurveyCompleted          string            `json:"site_survey_completed"`
	RoofingPending               string            `json:"roofing_pending"`
	RoofingScheduled             string            `json:"roofing_scheduled"`
	RoofingCompleted             string            `json:"roofing_completed"`
	PvPermitPending              string            `json:"pv_permit_pending"`
	PvPermitScheduled            string            `json:"pv_permit_scehduled"`
	PvPermitCompleted            string            `json:"pv_permit_completed"`
	IcPermitPending              string            `json:"ic_permit_pending"`
	IcPermitScheduled            string            `json:"ic_permit_scheduled"`
	IcPermitCompleted            string            `json:"ic_permit_completed"`
	InstallReady                 string            `json:"install_ready"`
	PvInstallReadyDate           string            `json:"pv_install_ready_date"`
	InstallScheduled             string            `json:"install_scheduled"`
	InstallCompleted             string            `json:"install_completed"`
	FinalInspectionSubmitted     string            `json:"final_inspection_submitted"`
	FinalInspectionApproved      string            `json:"final_inspection_approved"`
	PtoInProcess                 string            `json:"pto_in_process"`
	PtoSubmitted                 string            `json:"pto_submitted"`
	PtoCompleted                 string            `json:"pto_completed"`
	SystemSize                   float64           `json:"system_size"`
	AddersTotal                  string            `json:"adders_total"`
	AdderBreakDownAndTotalString string            `json:"adder_breakdown_and_total_string"`
	AdderBreakDownAndTotal       map[string]string `json:"adder_breakdown_and_total"`
	AHJ                          string            `json:"ajh"`
	Epc                          float64           `json:"epc"`
	State                        string            `json:"state"`
	ContractAmount               float64           `json:"contract_amount"`
	FinancePartner               string            `json:"finance_partner"`
	NetEPC                       float64           `json:"net_epc"`
	HomeOwner                    string            `json:"home_owner"`
}

// first is db column name  // second is struct name
var ColumnToField = map[string]string{
	"unique_id":                    "UniqueId",
	"contract_date":                "SalesCompleted",
	"ntp_working_date":             "NtpPending",
	"ntp_date":                     "NtpCompleted",
	"site_survey_scheduled_date":   "SiteSurveyScheduled",
	"site_survey_rescheduled_date": "SiteSurevyRescheduled",
	"site_survey_completed_date":   "SiteSurveyCompleted",
	"permit_created":               "PvPermitPending",
	"permit_submitted_date":        "PvPermitScheduled",
	"permit_approved_date":         "PvPermitCompleted",
	"ic_created_date":              "IcPermitPending",
	"ic_submitted_date":            "IcPermitScheduled",
	"ic_approved_date":             "IcPermitCompleted",
	"pv_install_created_date":      "InstallReady",
	"pv_install_ready_date":        "PvInstallReadyDate",
	"pv_install_scheduled_date":    "InstallScheduled",
	"pv_install_completed_date":    "InstallCompleted",
	"fin_scheduled_date":           "FinalInspectionSubmitted",
	"fin_pass_date":                "FinalInspectionApproved",
	"pto_created_date":             "PtoInProcess",
	"pto_submitted_date":           "PtoSubmitted",
	"pto_date":                     "PtoCompleted",
	"home_owner":                   "HomeOwner",
	"system_size":                  "SystemSize",
	"state":                        "State",
	"epc":                          "Epc",
	"ahj":                          "AHJ",
	"adder_breakdown_and_total":    "AdderBreakDownAndTotalString",
	"contract_total":               "ContractAmount",
	"finance_company":              "FinancePartner",
	"net_epc":                      "NetEPC",
}
