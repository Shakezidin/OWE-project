/**************************************************************************
 *	Function	: UpdateAdderResponsibilityModels.go
 *	DESCRIPTION : Files contains struct for Update adder responsibility API
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type UpdateAdderResponsibilityReq struct {
	Record_Id  int64   `json:"record_id"`
	Pay_Scale  string  `json:"pay_scale"`
	Percentage float64 `json:"percentage"`
}

type UpdateAdderResponsibilityArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
