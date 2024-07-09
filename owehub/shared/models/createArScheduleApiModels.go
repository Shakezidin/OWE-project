/**************************************************************************
 *	Function	: createArScheduleApiModels.go
 *	DESCRIPTION : Files contains struct for create ArSchedule models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type CreateArSchedule struct {
	PartnerName   string  `json:"partner_name"`
	InstallerName string  `json:"installer_name"`
	SaleTypeName  string  `json:"sale_type_name"`
	StateName     string  `json:"state_name"`
	RedLine       float64 `json:"red_line"`
	CalcDate      string  `json:"calc_date"`
	PermitPay     float64 `json:"permit_pay"`
	PermitMax     float64 `json:"permit_max"`
	InstallPay    float64 `json:"install_pay"`
	PtoPay        float64  `json:"pto_pay"`
	StartDate     string  `json:"start_date"`
	EndDate       string  `json:"end_date"`
}
