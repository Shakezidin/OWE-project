/**************************************************************************
 *	Function	: getTimelineSlaApiModels.go
 *	DESCRIPTION : Files contains struct for get timeline sla type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetTimelineSlaData struct {
	TypeM2M   string `json:"type_m2m"`
	State     string `json:"state"`
	Days      string `json:"days"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type GetTimelineSlaList struct {
	TimelineSlaList []GetTimelineSlaData `json:"timelinesla_list"`
}
