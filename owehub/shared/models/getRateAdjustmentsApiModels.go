/**************************************************************************
 *	Function	: getRateAdjustmentsApiModels.go
 *	DESCRIPTION : Files contains struct for get rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetRateAdjustments struct {
	RecordId   int64   `json:"record_id"`
	PayScale   string  `json:"pay_scale"`
	Position   string  `json:"position"`
	Adjustment string  `json:"adjustment"`
	MinRate    float64 `json:"min_rate"`
	MaxRate    float64 `json:"max_rate"`
}

type GetRateAdjustmentsList struct {
	RateAdjustmentsList []GetRateAdjustments `json:"rate_adjustments_list"`
}
