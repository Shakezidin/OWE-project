/**************************************************************************
 *	Function	: updateRateAdjustmentsApiModels.go
 *	DESCRIPTION : Files contains struct for update rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type UpdateRateAdjustments struct {
	RecordId   int64   `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	PayScale   string  `json:"pay_scale"`
	Position   string  `json:"position"`
	Adjustment string  `json:"adjustment"`
	MinRate    float64 `json:"min_rate"`
	MaxRate    float64 `json:"max_rate"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
}

type UpdateRateAdjustmentsArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
