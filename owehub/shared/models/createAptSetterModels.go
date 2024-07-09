/**************************************************************************
 *	Function	: createAptSetterModels.go
 *	DESCRIPTION : Files contains struct for create appointment setter API
 *	DATE        : 23-Jan-2024
 **************************************************************************/

package models

type CreateAptSetterReq struct {
	TeamName    string  `json:"team_name"`
	FirstName   string  `json:"first_name"`
	LastName    string  `json:"last_name"`
	PayRate     float32 `json:"pay_rate"`
	StartDate   string  `json:"start_date"`
	EndDate     string  `json:"end_date"`
	Description string  `json:"description"`
}
