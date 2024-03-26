/**************************************************************************
 *	Function	: createTimelineSlaApiModels.go
 *	DESCRIPTION : Files contains struct for create timeline sla user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateTimelineSla struct {
	TypeM2M   string `json:"type_m2m"`
	State     string `json:"state"`
	Days      string `json:"days"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}
