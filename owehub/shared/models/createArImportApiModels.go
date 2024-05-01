/**************************************************************************
 *	Function	: createArImportModels.go
 *	DESCRIPTION : Files contains struct for create ar_import API
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type CreateArImportReq struct {
	UniqueId string `json:"unique_id"`
	Customer string `json:"customer"`
	Date     string `json:"date"`
	Amount   string `json:"amount"`
	Notes    string `json:"notes"`
}
