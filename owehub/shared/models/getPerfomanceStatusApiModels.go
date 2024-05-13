/**************************************************************************
 *	Function	: getPerfomanceStatusApiModels.go
 *	DESCRIPTION : Files contains struct for PerfomanceStatus request
 *	DATE        : 07-May-2024
 **************************************************************************/

package models

type PerfomanceStatusReq struct {
	Email        string   `json:"email"`
	UniqueIds    []string `json:"unique_ids"`
	ProjectLimit int      `json:"project_limit"`
	DealerName   interface{}
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
