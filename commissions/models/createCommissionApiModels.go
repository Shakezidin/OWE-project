/**************************************************************************
 *	Function	: createCommissionApiModels.go
 *	DESCRIPTION : Files contains struct for create commission models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateCommission struct {
	Partner   string  `json:"partner"`
	Installer string  `json:"installer"`
	State     string  `json:"state"`
	SaleType  string  `json:"sale_type"`
	SalePrice float64 `json:"sale_price"`
	RepType   string  `json:"rep_type"`
	RL        float64 `json:"rl"`
	Rate      float64 `json:"rate"`
	StartDate string  `json:"start_date" sql:"NOT NULL"`
	EndDate   string  `json:"end_date"`
}
