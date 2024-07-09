/**************************************************************************
 *	Function	: commissionApiModels.go
 *	DESCRIPTION : Files contains struct for get commission models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetCommissionData struct {
	RecordId  int64   `json:"record_id"`
	Partner   string  `json:"partner"`
	Installer string  `json:"installer"`
	State     string  `json:"state"`
	SaleType  string  `json:"sale_type"`
	SalePrice float64 `json:"sale_price"`
	RepType   string  `json:"rep_type"`
	RL        float64 `json:"rl"`
	Rate      float64 `json:"rate"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
}

type GetCommissionsList struct {
	CommissionsList []GetCommissionData `json:"commissions_list"`
}
