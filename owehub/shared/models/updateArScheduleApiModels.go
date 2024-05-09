/**************************************************************************
 *	Function	: updateArScheduleApiModels.go
 *	DESCRIPTION : Files contains struct for update rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type UpdateArSchedule struct {
	RecordId      int64  `json:"record_id"`
	PartnerName   string `json:"partner_name"`
	InstallerName string `json:"installer_name"`
	SaleTypeName  string `json:"sale_type_name"`
	StateName     string `json:"state_name"`
	RedLine       string `json:"red_line"`
	CalcDate      string `json:"calc_date"`
	PermitPay     string `json:"permit_pay"`
	PermitMax     string `json:"permit_max"`
	InstallPay    string `json:"install_pay"`
	PtoPay        string `json:"pto_pay"`
	StartDate     string `json:"start_date"`
	EndDate       string `json:"end_date"`
}

type UpdateArScheduleArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
