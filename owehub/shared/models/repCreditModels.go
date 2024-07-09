/**************************************************************************
*	Function	: 		RepCreditModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										RepCredit data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateRepCredit struct {
	UniqueId   string  `json:"unique_id"`
	PerKwAmt   float64 `json:"per_kw_amt"`
	ExactAmt   float64 `json:"exact_amt"`
	Date       string  `json:"date"`
	ApprovedBy string  `json:"approved_by"`
	Notes      string  `json:"notes"`
}

type GetRepCredit struct {
	RecordId   int64   `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	PerKwAmt   float64 `json:"per_kw_amt"`
	ExactAmt   float64 `json:"exact_amt"`
	Date       string  `json:"date"`
	ApprovedBy string  `json:"approved_by"`
	Notes      string  `json:"notes"`
}

type GetRepCreditList struct {
	RepCreditList []GetRepCredit `json:"rep_credit_list"`
}

type UpdateRepCredit struct {
	RecordId   int     `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	PerKwAmt   float64 `json:"per_kw_amt"`
	ExactAmt   float64 `json:"exact_amt"`
	Date       string  `json:"date"`
	ApprovedBy string  `json:"approved_by"`
	Notes      string  `json:"notes"`
}

type ArchiveRepCredit struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
