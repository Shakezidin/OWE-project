/**************************************************************************
*	Function	: 		ApDedModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										ApDed data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateApDed struct {
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
}

type GetApDed struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
	Dealer      string  `json:"dealer"`
}

type GetApDedList struct {
	ApDedList []GetApDed `json:"ap_ded_list"`
}

type UpdateApDed struct {
	RecordId    int     `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
}

type ArchiveApDed struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
