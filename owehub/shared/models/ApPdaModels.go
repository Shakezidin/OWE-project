/**************************************************************************
*	Function	: 		ApPdaModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										ApPda data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateApPda struct {
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	AmountOvrd  float64 `json:"amount_ovrd"`
	ApprovedBy  string  `json:"approved_by"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
}

type GetApPda struct {
	RecordId    int64   `json:"record_id"`
	ApprovedBy  string  `json:"approved_by"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	AmountOvrd  float64 `json:"amount_ovrd"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
	Dealer      string  `json:"dealer"`
	Customer    string  `json:"customer"`
}

type GetApPdaList struct {
	ApPdaList []GetApPda `json:"ap_pda_list"`
}

type UpdateApPda struct {
	RecordId    int     `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	AmountOvrd  float64 `json:"amount_ovrd"`
	ApprovedBy  string  `json:"approved_by"`
	Date        string  `json:"date"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
}

type ArchiveApPda struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
