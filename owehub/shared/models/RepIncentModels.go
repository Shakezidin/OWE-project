/**************************************************************************
*	Function	: 		RepIncentModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										RepIncent data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateRepIncent struct {
	Name      string  `json:"name"`
	DollDivKw float64 `json:"doll_div_kw"`
	Month     string  `json:"month"`
	Comment   string  `json:"comment"`
}

type GetRepIncent struct {
	RecordId  int64   `json:"record_id"`
	Name      string  `json:"name"`
	DollDivKw float64 `json:"doll_div_kw"`
	Month     string  `json:"month"`
	Comment   string  `json:"comment"`
}

type GetRepIncentList struct {
	RepIncentList []GetRepIncent `json:"rep_incent_list"`
}

type UpdateRepIncent struct {
	RecordId  int     `json:"record_id"`
	Name      string  `json:"name"`
	DollDivKw float64 `json:"doll_div_kw"`
	Month     string  `json:"month"`
	Comment   string  `json:"comment"`
}

type ArchiveRepIncent struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
