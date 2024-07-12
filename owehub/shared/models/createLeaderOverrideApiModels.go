/**************************************************************************
 *	Function	: createLeaderOverrideApiModels.go
 *	DESCRIPTION : Files contains struct for create dealer user models
 *	DATE        : 28-Apr-2024
 **************************************************************************/

package models

type CreateLeaderOverride struct {
	// UniqueID   string  `json:"unique_id"`
	TeamName   string  `json:"team_name"`
	LeaderName string  `json:"leader_name"`
	Type       string  `json:"type"`
	Term       string  `json:"term"`
	Qual       string  `json:"qual"`
	SalesQ     float64 `json:"sales_q"`
	TeamKwQ    float64 `json:"team_kw_q"`
	PayRate    float64  `json:"pay_rate"`
	IsArchived bool    `json:"is_archived"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
}
