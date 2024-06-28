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
	UniqueIds    []string
	ProjectLimit int
	DealerName   interface{}
	IntervalDays string
}

type PerfomanceResponse struct {
	UniqueId               string `json:"unqiue_id"`
	Customer               string `json:"customer"`
	ContractDate           string `json:"contract_date"`
	PermitApprovedDate     string `json:"permit_approved_date"`
	PvInstallCompletedDate string `json:"install_completed_date"`
	PtoDate                string `json:"pto_date"`
	SiteSurveyCompleteDate string `json:"site_survey_complete_date"`
	InstallReadyDate       string `json:"install_ready_date"`
}

type PerfomanceListResponse struct {
	PerfomanceList []PerfomanceResponse `json:"perfomance_response_list"`
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
}

type ProjectResponse struct {
	UniqueId              string `json:"unqiue_id"`
	SalesCompleted        string `json:"sales_completed"`
	NtpPending            string `json:"ntp_pending"`
	NtpCompleted          string `json:"ntp_completed"`
	SiteSurveyScheduled   string `json:"site_survey_scheduled"`
	SiteSurevyRescheduled string `json:"site_survey_rescheduled"`
	SiteSurveyCompleted   string `json:"site_survey_completed"`
	RoofingPending        string `json:"roofing_pending"`
	RoofingScheduled      string `json:"roofing_scheduled"`
	RoofingCompleted      string `json:"roofing_completed"`
	MpuPending            string `json:"mpu_pending"`
	MpuScheduled          string `json:"mpu_scheduled"`
	MpuCompleted          string `json:"mpu_completed"`
	DeratePending         string `json:"derate_pending"`
	DerateScheduled       string `json:"derate_scheduled"`
	DerateCompleted       string `json:"derate_completed"`
	TrenchingPending      string `json:"trenching_pending"`
	TrenchingScheduled    string `json:"tenching_scheduled"`
	TrenchingCompleted    string `json:"trenching_completed"`
	// ElectricalPending        string  `json:"electrical_pending"`
	// ElectricalScheduled      string  `json:"electrical_scheduled"`
	// ElectricalCompleted      string  `json:"electrical_completed"`
	PvPermitPending          string  `json:"pv_permit_pending"`
	PvPermitScheduled        string  `json:"pv_permit_scehduled"`
	PvPermitCompleted        string  `json:"pv_permit_completed"`
	IcPermitPending          string  `json:"ic_permit_pending"`
	IcPermitScheduled        string  `json:"ic_permit_scheduled"`
	IcPermitCompleted        string  `json:"ic_permit_completed"`
	InstallPending           string  `json:"install_pending"`
	InstallReady             string  `json:"install_ready"`
	InstallScheduled         string  `json:"install_scheduled"`
	InstallCompleted         string  `json:"install_completed"`
	FinalInspectionSubmitted string  `json:"final_inspection_submitted"`
	FinalInspectionApproved  string  `json:"final_inspection_approved"`
	PtoInProcess             string  `json:"pto_in_process"`
	PtoSubmitted             string  `json:"pto_submitted"`
	PtoCompleted             string  `json:"pto_completed"`
	SystemSize               float64 `json:"system_size"`
	Adder                    string  `json:"adder"`
	AHJ                      string  `json:"ajh"`
	Epc                      string  `json:"epc"`
	State                    string  `json:"state"`
	ContractAmount           float64 `json:"contract_amount"`
	FinancePartner           string  `json:"finance_partner"`
	NetEPC                   float64 `json:"net_epc"`
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
	// "derate_created_date_1":        "TrenchingPending",
	// "derate_scheduled_date_2":      "TrenchingScheduled",
	// "derate_completed_date_2":   "TrenchingCompleted",
	"permit_created":            "PvPermitPending",
	"permit_submitted_date":     "PvPermitScheduled",
	"permit_approved_date":      "PvPermitCompleted",
	"ic_created_date":           "IcPermitPending",
	"ic_submitted_date":         "IcPermitScheduled",
	"ic_approved_date":          "IcPermitCompleted",
	"pv_install_created_date_2": "InstallPending", // check
	"pv_install_created_date":   "InstallReady",
	"pv_install_scheduled_date": "InstallScheduled",
	"pv_install_completed_date": "InstallCompleted",
	"fin_scheduled_date":        "FinalInspectionSubmitted",
	"fin_pass_date":             "FinalInspectionApproved",
	"pto_created_date":          "PtoInProcess",
	"pto_submitted_date":        "PtoSubmitted",
	"pto_date":                  "PtoCompleted",
	"system_size":               "SystemSize",
	"prospect":                  "Adder", // unsure value
	"ahj":                       "AHJ",
	"epc":                       "Epc", //check
	"state":                     "State",
	"contract_total":            "ContractAmount",
	"finance_company":           "FinancePartner",
	"net_epc":                   "NetEPC",
}
