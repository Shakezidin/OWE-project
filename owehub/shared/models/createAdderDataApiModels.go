/**************************************************************************
 *	Function	: createAdderDataApiModels.go
 *	DESCRIPTION : Files contains struct for create rebate data models
 *	DATE        : 03-May-2024
 **************************************************************************/

package models

type CreateAdderData struct {
	UniqueId    string  `json:"unique_id"`
	Date        string  `json:"date"`
	TypeAdMktg  string  `json:"type_ad_mktg"`
	Gc          string  `json:"gc"`
	ExactAmount float64 `json:"exact_amount"`
	PerKwAmt    float64 `json:"per_kw_amt"`
	RepPercent  float64 `json:"rep_percent"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
}
