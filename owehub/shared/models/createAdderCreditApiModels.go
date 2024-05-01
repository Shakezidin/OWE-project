/**************************************************************************
 *	Function	: createAdderCreditModels.go
 *	DESCRIPTION : Files contains struct for create adder Credit API
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type CreateAdderCredit struct {
	Unique_Id string  `json:"unique_id"`
	Pay_Scale string  `json:"pay_scale"`
	Type      string  `json:"type"`
	Min_Rate  float64 `json:"min_rate"`
	Max_Rate  float64 `json:"max_rate"`
}
