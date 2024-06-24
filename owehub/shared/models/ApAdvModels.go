/**************************************************************************
*	Function	: 		ApAdvModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										ApAdv data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateApAdv struct {
	UniqueId   string  `json:"unique_id"`
	Payee      string  `json:"payee"`
	Date       string  `json:"date"`
	AmountOvrd float64 `json:"amount_ovrd"`
	ApprovedBy string  `json:"approved_by"`
	Notes      string  `json:"notes"`
}

type GetApAdv struct {
	RecordId   int64   `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	Dealer     string  `json:"dealer"`
	Customer   string  `json:"customer"`
	Payee      string  `json:"payee"`
	Date       string  `json:"date"`
	AmountOvrd float64 `json:"amount_ovrd"`
	ApprovedBy string  `json:"approved_by"`
	Notes      string  `json:"notes"`
}

type GetApAdvList struct {
	ApAdvList []GetApAdv `json:"ap_adv_list"`
}

type UpdateApAdv struct {
	RecordId   int64   `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	Payee      string  `json:"payee"`
	Date       string  `json:"date"`
	AmountOvrd float64 `json:"amount_ovrd"`
	ApprovedBy string  `json:"approved_by"`
	Notes      string  `json:"notes"`
}

type ArchiveApAdv struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
