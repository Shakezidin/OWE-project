/**************************************************************************
 *	Function	: GetApptSettersModels.go
 *	DESCRIPTION : Files contains struct for Get appointment setter API
 *	DATE        : 01-Apr-2024
 **************************************************************************/

package models

type GetApptSettersReq struct {
	RecordId  int64  `json:"record_id"`
	UniqueId  string `json:"unique_id"`
	Name      string `json:"name"`
	TeamName  string `json:"team_name"`
	PayRate   string `json:"pay_rate"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type GetApptSettersList struct {
	ApptSettersList []GetApptSettersReq `json:"appt_setters_list"`
}
