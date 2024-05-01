/**************************************************************************
 *	Function	: updateAdjustmentsApiModels.go
 *	DESCRIPTION : Files contains struct for update rebate data models
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

import "time"

type UpdateAdjustments struct {
	RecordId      int64     `json:"record_id"`
	UniqueId      string    `json:"unique_id"`
	Customer      string    `json:"customer"`
	PartnerName   string    `json:"partner_name"`
	InstallerName string       `json:"installer_name"`
	StateName     string    `json:"state_name"`
	SysSize       float64   `json:"sys_size"`
	Bl            string    `json:"bl"`
	Epc           float64   `json:"epc"`
	Date          time.Time `json:"date"`
	Notes         string    `json:"notes"`
	Amount        float64   `json:"amount"`
	StartDate     string    `json:"start_date"`
	EndDate       string    `json:"end_date"`
}

type UpdateAdjustmentsArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
