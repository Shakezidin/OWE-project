/**************************************************************************
 *	Function	: getPerfomanceStatusApiModels.go
 *	DESCRIPTION : Files contains struct for PerfomanceStatus request
 *	DATE        : 07-May-2024
 **************************************************************************/

package models

type EmptyReq struct{}

type PerfomanceStatusReq struct {
	Email        string
	UniqueIds    []string
	ProjectLimit int
	DealerName   interface{}
	IntervalDays string
}

type PerfomanceResponse struct {
	UniqueId               string `json:"unqiue_id"`
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
	UniqueIds    []string
	ProjectLimit int
	DealerName   interface{}
	IntervalDays string
}

var ColumnToField = map[string]string{
	"unique_id":                  "UniqueId",
	"contract_date":              "ContractDate",
	"permit_approved_date":       "PermitApprovedDate",
	"pv_install_completed_date":  "PvInstallCompletedDate",
	"pto_date":                   "PtoDate",
	"site_survey_completed_date": "SiteSurveyCompleteDate",
	"install_ready_date":         "InstallReadyDate",
}

type ProjectResponse struct {
	UniqueId               string `json:"unqiue_id"`
	ContractDate           string `json:"contract_date"`
	PermitApprovedDate     string `json:"permit_approved_date"`
	PvInstallCompletedDate string `json:"install_completed_date"`
	PtoDate                string `json:"pto_date"`
	SiteSurveyCompleteDate string `json:"site_survey_complete_date"`
	InstallReadyDate       string `json:"install_ready_date"`
}

type ProjectListResponse struct {
	ProjectList []ProjectResponse `json:"project_response_list"`
}

type ProjectLstResponse struct {
	UniqueId string `json:"unqiue_id"`
}

type ProjectLstsResponse struct {
	ProjectList []ProjectLstResponse `json:"project_response_list"`
}

var ColumnToFields = map[string]string{
	"unique_id": "UniqueId",
}
