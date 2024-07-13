/**************************************************************************
 *	Function	: UpdateAdderCreditModels.go
 *	DESCRIPTION : Files contains struct for Update adder Credit API Model
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type UpdateAdderCredit struct {
	RecordId  int64   `json:"record_id"`
	Pay_Scale string  `json:"pay_scale"`
	Type      string  `json:"type"`
	Min_Rate  float64 `json:"min_rate"`
	Max_Rate  float64 `json:"max_rate"`
}

type UpdateAdderCreditArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
