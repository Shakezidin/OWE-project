/**************************************************************************
 *	Function	: GetAdderCreditModels.go
 *	DESCRIPTION : Files contains struct for Get adder Credit API Model
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetAdderCreditReq struct {
	RecordId  int64   `json:"record_id"`
	UniqueId  string  `json:"unique_id"`
	Pay_Scale string  `json:"pay_scale"`
	Type      string  `json:"type"`
	Min_Rate  float64 `json:"min_rate"`
	Max_Rate  float64 `json:"max_rate"`
}

type GetAdderCreditList struct {
	AdderCreditList []GetAdderCreditReq `json:"adder_credit_list"`
}
