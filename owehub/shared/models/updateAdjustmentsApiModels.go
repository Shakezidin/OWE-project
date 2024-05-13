/**************************************************************************
 *	Function	: updateAdjustmentsApiModels.go
 *	DESCRIPTION : Files contains struct for update rebate data models
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type UpdateAdjustments struct {
	RecordId      int64   `json:"record_id"`
	UniqueId      string  `json:"unique_id"`
	Date          string  `json:"date"`
	Notes         string  `json:"notes"`
	Amount        string `json:"amount"`
}

type UpdateAdjustmentsArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
