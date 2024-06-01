/**************************************************************************
 *	Function	: updateUpdateNonCommDlrPayApiModels.go
 *	DESCRIPTION : Files contains struct for update UpdateNonCommDlrPay models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateNonCommDlrPay struct {
	RecordId    int64   `json:"record_id"`
	UniqueID    string  `json:"unique_id"`
	ExactAmount float64 `json:"exact_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
	Date        string  `json:"date"`
}

type UpdateNonCommDlrPayArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
