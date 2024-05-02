/**************************************************************************
 *	Function	: getAdjustmentsApiModels.go
 *	DESCRIPTION : Files contains struct for get referral data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetAdjustments struct {
	RecordId      int64     `json:"record_id"`
	UniqueId      string    `json:"unique_id"`
	Customer      string    `json:"customer"`
	PartnerName   string    `json:"partner_name"`
	InstallerName string    `json:"installer_name"`
	StateName     string    `json:"state_name"`
	SysSize       float64   `json:"sys_size"`
	IsArchived    bool      `json:"is_archived"`
	Bl            string    `json:"bl"`
	Epc           float64   `json:"epc"`
	Date          string `json:"date"`
	Notes         string    `json:"notes"`
	Amount        float64   `json:"amount"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
}

type GetAdjustmentsList struct {
	AdjustmentsList []GetAdjustments `json:"adjustments_list"`
}
