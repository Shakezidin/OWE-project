/**************************************************************************
 *	Function	: GetAdderResponsibilityModels.go
 *	DESCRIPTION : Files contains struct for Get adder responsibility API
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetAdderResponsibilityReq struct {
	RecordId   int64   `json:"record_id"`
	UniqueId   string  `json:"unique_id"`
	Pay_Scale  string  `json:"pay_scale"`
	Percentage float64 `json:"percentage"`
}

type GetAdderResponsibilityList struct {
	AdderResponsibilityList []GetAdderResponsibilityReq `json:"adder_responsibility_list"`
}
