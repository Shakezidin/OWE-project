/**************************************************************************
 *	Function	: getReconcileApiModels.go
 *	DESCRIPTION : Files contains struct for get rebate data models
 *	DATE        : 24-Apr-2024
 **************************************************************************/

package models

import "time"

type GetReconcile struct {
	RecordId    int64     `json:"record_id"`
	UniqueId    string    `json:"unique_id"`
	Customer    string    `json:"customer"`
	PartnerName string    `json:"partner_name"`
	StateName   string    `json:"state_name"`
	SysSize     float64   `json:"sys_size"`
	Status      string    `json:"status"`
	Date        time.Time `json:"date"`
	Amount      float64   `json:"amount"`
	Notes       string    `json:"notes"`
	IsArchived  bool      `json:"is_archived"`
}

type GetReconcileList struct {
	ReconcileList []GetReconcile `json:"reconcile_list"`
}
