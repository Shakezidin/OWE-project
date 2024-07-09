/**************************************************************************
 *	Function	: createAdjustmentsApiModels.go
 *	DESCRIPTION : Files contains struct for create rebate data models
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type CreateAdjustments struct {
	UniqueId      string  `json:"unique_id"`
	Date          string  `json:"date"`
	Notes         string  `json:"notes"`
	Amount        float64 `json:"amount"`
}
