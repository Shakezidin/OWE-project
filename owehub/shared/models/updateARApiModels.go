/**************************************************************************
 *	Function	: UpdateArModels.go
 *	DESCRIPTION : Files contains struct for Update ar_ API Model
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type UpdateAR struct {
	RecordId   int64   `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	PayScale   string  `json:"pay_scale"`
	Position   string  `json:"position"`
	Adjustment string  `json:"adjustment"`
	MinRate    float64 `json:"min_rate"`
	MaxRate    float64 `json:"max_rate"`
}

type UpdateARArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
