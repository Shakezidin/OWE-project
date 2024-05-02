/**************************************************************************
 *	Function	: UpdateArImportModels.go
 *	DESCRIPTION : Files contains struct for Update ar_import API Model
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type UpdateArImport struct {
	RecordId int64  `json:"record_id"`
	UniqueId string `json:"unique_id"`
	Customer string `json:"customer"`
	Date     string `json:"date"`
	Amount   string `json:"amount"`
	Notes    string `json:"notes"`
}

type UpdateArImportArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
