/**************************************************************************
 *	Function	: getInstallCostApiModels.go
 *	DESCRIPTION : Files contains struct for get rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetInstallCost struct {
	RecordId   int64   `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	Cost       float64 `json:"cost"`
	IsArchived bool    `json:"is_archived"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
}

type GetInstallCostList struct {
	InstallCostList []GetInstallCost `json:"install_cost_list"`
}
