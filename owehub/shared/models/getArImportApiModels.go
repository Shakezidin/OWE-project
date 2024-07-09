/**************************************************************************
 *	Function	: GetArImportModels.go
 *	DESCRIPTION : Files contains struct for Get adder Credit API Model
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetArImportReq struct {
	RecordId    int64  `json:"record_id"`
	UniqueId    string `json:"unique_id"`
	Customer    string `json:"customer"`
	Date        string `json:"date"`
	Amount      string `json:"amount"`
	Notes       string `json:"notes"`
	Is_Archived bool   `json:"is_archived"`
}

type GetArImportList struct {
	ArImportList []GetArImportReq `json:"ar_import_list"`
}
