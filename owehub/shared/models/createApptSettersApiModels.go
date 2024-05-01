/**************************************************************************
 *	Function	: createApptSettersModels.go
 *	DESCRIPTION : Files contains struct for create appointment setter API
 *	DATE        : 01-Apr-2024
 **************************************************************************/

package models

type CreateApptSettersReq struct {
	UniqueId  string `json:"unique_id"`
	Name      string `json:"name"`
	TeamName  string `json:"team_name"`
	PayRate   string `json:"pay_rate"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}
