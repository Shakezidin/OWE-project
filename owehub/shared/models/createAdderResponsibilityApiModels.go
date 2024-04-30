/**************************************************************************
 *	Function	: createAdderResponsibilityModels.go
 *	DESCRIPTION : Files contains struct for create adder responsibility API
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type CreateAdderResponsibilityReq struct {
	Unique_Id  string  `json:"unique_id"`
	Pay_Scale  string  `json:"pay_scale"`
	Percentage float64 `json:"percentage"`
}
