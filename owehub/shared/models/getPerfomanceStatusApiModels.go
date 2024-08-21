/**************************************************************************
 *	Function	: getPerfomanceStatusApiModels.go
 *	DESCRIPTION : Files contains struct for PerfomanceStatus request
 *	DATE        : 07-May-2024
 **************************************************************************/

package models

type EmptyReq struct{}

type PerfomanceStatusReq struct {
	PageNumber   int `json:"page_number"`
	PageSize     int `json:"page_size"`
	Email        string
	UniqueIds    []string `json:"unique_ids"`
	ProjectLimit int
	DealerName   interface{}
	IntervalDays string
	ItemLastSeen int64  `json:"item_last_seen"`
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
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
}

type PerfomanceListResponse struct {
	PerfomanceList   []PerfomanceResponse `json:"perfomance_response_list"`
	SiteSurveyCount  int64                `json:"site_survey_count"`
	CadDesignCount   int64                `json:"cad_design_count"`
	PerimittingCount int64                `json:"permitting_count"`
	RoofingCount     int64                `json:"roofing_count"`
	InstallCount     int64                `json:"isntall_count"`
	ElectricalCount  int64                `json:"electrical_count"`
	InspectionCount  int64                `json:"inspection_count"`
	ActivationCount  int64                `json:"activation_count"`
}

// shift the below struct to project

type ProjectStatusReq struct {
	Email        string
	UniqueId     string `json:"unique_id"`
	Customer     string `json:"customer"`
	UniqueIds    []string
	ProjectLimit int
	DealerName   interface{}
	IntervalDays string
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
	Ntp         NTP               `json:"ntp"`
	Qc          QC                `json:"qc"`
}

type QC struct {
	PowerClerk                           string `json:"powerclerk_sent"`
	ACHWaiveSendandSignedCashOnly        string `json:"ACH_waiver(sent_and_signed)(cash_only)"`
	GreenAreaNMOnly                      string `json:"green_area(nm_only)"`
	FinanceCreditApprovalLoanorLease     string `json:"finance_credit_approval(loan_or_lease)"`
	FinanceAgreementCompletedLoanorLease string `json:"finance_agreement_completed(loan_or_lease)"`
	OWEDocumentsCompleted                string `json:"OWE_documents_completed"`
}

type NTP struct {
	ProductionDiscrepancy                       string `json:"production_discrepancy"`
	Sunpixel                                    string `json:"sunpixel"`
	LeaseAgreementUploaded                      string `json:"lease_agreement_uploaded"`
	LightReachDesignVerification                string `json:"light_reach_design_verification"`
	OWEAgreementUploaded                        string `json:"OWE_agreement_uploaded"`
	HOFUploaded                                 string `json:"HOF_uploaded"`
	UtilityAcknowledgementAndDisclaimerUploaded string `json:"utility_acknowledgement_and_disclaimer_uploaded"`
	ACHWaiverCashCustomerOnlyUploaded           string `json:"ACH_waiver_cash_customer_only_uploaded"`
	FinanceNTPOfProject                         string `json:"finance_ntp_of_project"`
	FinanceCreditApproval                       string `json:"finance_credit_approval"`
	FinanceAgreementCompleted                   string `json:"finance_agreement_completed"`
	OWEDocumentsCompleted                       string `json:"OWE_documents_completed"`
}

type ProjectResponse struct {
	UniqueId                     string            `json:"unqiue_id"`
	SalesCompleted               string            `json:"sales_completed"`
	NtpPending                   string            `json:"ntp_pending"`
	NtpCompleted                 string            `json:"ntp_completed"`
	SiteSurveyScheduled          string            `json:"site_survey_scheduled"`
	SiteSurevyRescheduled        string            `json:"site_survey_rescheduled"`
	SiteSurveyCompleted          string            `json:"site_survey_completed"`
	RoofingPending               string            `json:"roofing_pending"`
	RoofingScheduled             string            `json:"roofing_scheduled"`
	RoofingCompleted             string            `json:"roofing_completed"`
	MpuPending                   string            `json:"mpu_pending"`
	MpuScheduled                 string            `json:"mpu_scheduled"`
	MpuCompleted                 string            `json:"mpu_completed"`
	DeratePending                string            `json:"derate_pending"`
	DerateScheduled              string            `json:"derate_scheduled"`
	DerateCompleted              string            `json:"derate_completed"`
	TrenchingPending             string            `json:"trenching_pending"`
	TrenchingScheduled           string            `json:"tenching_scheduled"`
	TrenchingCompleted           string            `json:"trenching_completed"`
	PvPermitPending              string            `json:"pv_permit_pending"`
	PvPermitScheduled            string            `json:"pv_permit_scehduled"`
	PvPermitCompleted            string            `json:"pv_permit_completed"`
	IcPermitPending              string            `json:"ic_permit_pending"`
	IcPermitScheduled            string            `json:"ic_permit_scheduled"`
	IcPermitCompleted            string            `json:"ic_permit_completed"`
	InstallPending               string            `json:"install_pending"`
	InstallReady                 string            `json:"install_ready"`
	InstallScheduled             string            `json:"install_scheduled"`
	InstallCompleted             string            `json:"install_completed"`
	FinalInspectionSubmitted     string            `json:"final_inspection_submitted"`
	FinalInspectionApproved      string            `json:"final_inspection_approved"`
	PtoInProcess                 string            `json:"pto_in_process"`
	PtoSubmitted                 string            `json:"pto_submitted"`
	PtoCompleted                 string            `json:"pto_completed"`
	CadReady                     string            `json:"cad_ready"`
	BatteryScheduleDate          string            `json:"battery_scheduled_date"`
	BatteryCompleteDate          string            `json:"battery_complete_date"`
	FinCreatedDate               string            `json:"fin_created_date"`
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
	"roofing_created_date":         "RoofingPending",
	"roofing_scheduled_date":       "RoofingScheduled",
	"roofing_completed_date":       "RoofingCompleted",
	"mpu_created_date":             "MpuPending",
	"mpu_scheduled_date":           "MpuScheduled",
	"mpu_complete_date":            "MpuCompleted",
	"derate_created_date":          "DeratePending",
	"derate_scheduled_date":        "DerateScheduled",
	"derate_completed_date":        "DerateCompleted",
	"trenching_ws_open":            "TrenchingPending",
	"trenching_scheduled":          "TrenchingScheduled",
	"trenching_completed":          "TrenchingCompleted",
	"permit_created":               "PvPermitPending",
	"permit_submitted_date":        "PvPermitScheduled",
	"permit_approved_date":         "PvPermitCompleted",
	"ic_created_date":              "IcPermitPending",
	"ic_submitted_date":            "IcPermitScheduled",
	"ic_approved_date":             "IcPermitCompleted",
	"pv_install_created_date_2":    "InstallPending", // check
	"pv_install_created_date":      "InstallReady",
	"pv_install_scheduled_date":    "InstallScheduled",
	"pv_install_completed_date":    "InstallCompleted",
	"fin_scheduled_date":           "FinalInspectionSubmitted",
	"fin_pass_date":                "FinalInspectionApproved",
	"pto_created_date":             "PtoInProcess",
	"pto_submitted_date":           "PtoSubmitted",
	"pto_date":                     "PtoCompleted",
	"cad_ready":                    "CadReady",
	"battery_scheduled_date":       "BatteryScheduleDate",
	"battery_complete_date":        "BatteryCompleteDate",
	"fin_created_date":             "FinCreatedDate",
	"system_size":                  "SystemSize",
	"adders_total":                 "AddersTotal",
	"adder_breakdown_and_total":    "AdderBreakDownAndTotalString",
	"ahj":                          "AHJ",
	"epc":                          "Epc", //check
	"state":                        "State",
	"contract_total":               "ContractAmount",
	"finance_company":              "FinancePartner",
	"net_epc":                      "NetEPC",
	"home_owner":                   "HomeOwner",
}
