/**************************************************************************
 *	Function	: updateInstallCostApiModels.go
 *	DESCRIPTION : Files contains struct for update rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type UpdateInstallCost struct {
	RecordId  int64   `json:"record_id"`
	UniqueId  string  `json:"unique_id"`
	Cost      float64 `json:"cost"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
}

type UpdateInstallCostArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
