/**************************************************************************
 *	Function	: createRateAdjustmentsApiModels.go
 *	DESCRIPTION : Files contains struct for create rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type CreateRateAdjustments struct {
	UniqueId   string  `json:"unique_id"`
	PayScale   string  `json:"pay_scale"`
	Position   string  `json:"position"`
	Adjustment string  `json:"adjustment"`
	MinRate    float64 `json:"min_rate"`
	MaxRate    float64 `json:"max_rate"`
	IsArchived string  `json:"is_archived"`
}
