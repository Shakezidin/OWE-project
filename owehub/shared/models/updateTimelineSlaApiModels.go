/**************************************************************************
 *	Function	: updateTimelineSlaApiModels.go
 *	DESCRIPTION : Files contains struct for update timeline sla type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateTimelineSla struct {
	RecordId  int64  `json:"record_id"`
	TypeM2M   string `json:"type_m2m"`
	State     string `json:"state"`
	Days      int    `json:"days"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type UpdateTimelineSlaArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
