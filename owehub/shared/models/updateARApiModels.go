/**************************************************************************
 *	Function	: UpdateArModels.go
 *	DESCRIPTION : Files contains struct for Update ar_ API Model
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type UpdateAR struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Date        string  `json:"date"`
	Amount      float64 `json:"amount"`
	PaymentType string  `json:"payment_type"`
	Bank        string  `json:"bank"`
	Ced         string  `json:"ced"`
}

type UpdateARArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
