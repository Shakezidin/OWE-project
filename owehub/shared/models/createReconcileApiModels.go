/**************************************************************************
 *	Function	: createReconcileApiModels.go
 *	DESCRIPTION : Files contains struct for create rebate data models
 *	DATE        : 01-May-2024
 **************************************************************************/

package models

type CreateReconcile struct {
	UniqueId    string  `json:"unique_id"`
	Customer    string  `json:"customer"`
	PartnerName string  `json:"partner_name"`
	StateName   string  `json:"state_name"`
	SysSize     float64 `json:"sys_size"`
	Status      string  `json:"status"`
	StartDate        string  `json:"start_date"`
	EndDate        string  `json:"end_date"`
	Amount      float64 `json:"amount"`
	Notes       string  `json:"notes"`
}
