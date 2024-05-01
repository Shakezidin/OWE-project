/**************************************************************************
 *	Function	: createArModels.go
 *	DESCRIPTION : Files contains struct for create ar API
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type CreateARReq struct {
	UniqueId   string  `json:"unique_id"`
	PayScale   string  `json:"pay_scale"`
	Position   string  `json:"position"`
	Adjustment string  `json:"adjustment"`
	MinRate    float64 `json:"min_rate"`
	MaxRate    float64 `json:"max_rate"`
}
