/**************************************************************************
 *	Function	: createRebateDataApiModels.go
 *	DESCRIPTION : Files contains struct for create rebate data models
 *	DATE        : 24-Apr-2024
 **************************************************************************/

package models

type CreateRebateData struct {
	CustomerVerf    string  `json:"customer_verf"`
	UniqueId        string  `json:"unique_id"`
	Date            string  `json:"date"`
	Type            string  `json:"type"`
	Item            string  `json:"item"`
	Amount          float64 `json:"amount"`
	RepDollDivbyPer float64 `json:"rep_doll_divby_per"`
	Notes           string  `json:"notes"`
}
