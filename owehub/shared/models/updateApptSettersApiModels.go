/**************************************************************************
 *	Function	: UpdateApptSettersModels.go
 *	DESCRIPTION : Files contains struct for Update appointment setter API
 *	DATE        : 01-Apr-2024
 **************************************************************************/

package models

type UpdateApptSettersReq struct {
	RecordId  int64  `json:"record_id"`
	UniqueId  string `json:"unique_id"`
	Name      string `json:"name"`
	TeamName  string `json:"team_name"`
	PayRate   string `json:"pay_rate"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type UpdateApptSettersArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
