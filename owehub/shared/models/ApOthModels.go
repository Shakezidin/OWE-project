/**************************************************************************
*	Function	: 		ApOthModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										ApOth data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateApOth struct {
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
}

type GetApOth struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
	Dealer      string  `json:"dealer"`
}

type GetApOthList struct {
	ApOthList []GetApOth `json:"ap_oth_list"`
}

type UpdateApOth struct {
	RecordId    int     `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
}

type ArchiveApOth struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
