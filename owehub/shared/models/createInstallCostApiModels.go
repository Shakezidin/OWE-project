/**************************************************************************
 *	Function	: createInstallCostApiModels.go
 *	DESCRIPTION : Files contains struct for create rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type CreateInstallCost struct {
	UniqueId  string  `json:"unique_id"`
	Cost      float64 `json:"cost"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
}
