/**************************************************************************
 *	Function	: UpdateArModels.go
 *	DESCRIPTION : Files contains struct for Update ar_ API Model
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type UpdateAR struct {
	RecordId     int64  `json:"record_id"`
	UniqueId     string `json:"unique_id"`
	CustomerName string `json:"customer_name"`
	Date         string `json:"date"`
	Amount       string `json:"amount"`
	Notes        string `json:"notes"`
}

type UpdateARArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
