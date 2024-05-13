/**************************************************************************
 *	Function	: getAdderDataConfigApiModels.go
 *	DESCRIPTION : Files contains struct for get rebate data models
 *	DATE        : 11-May-2024
 **************************************************************************/

package models

type GetAdderDataConfig struct {
	RecordId          int64   `json:"record_id"`
	AdderName         string  `json:"adder_name"`
	Status            string  `json:"status"`
	AdderType         string  `json:"adder_type"`
	PriceType         string  `json:"price_type"`
	Price             float64 `json:"price"`
	RepCommission     string  `json:"rep_commission"`
	RepCommissionType string  `json:"rep_commission_type"`
	Details           string  `json:"details"`
}

type GetAdderDataConfigList struct {
	AdderDataConfigList []GetAdderDataConfig `json:"adder_data_config"`
}
