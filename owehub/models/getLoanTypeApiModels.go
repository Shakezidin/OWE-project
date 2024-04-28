/**************************************************************************
 *	Function	: getLoanTypeApiModels.go
 *	DESCRIPTION : Files contains struct for get Loan type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetLoanTypeData struct {
	RecordId    int64  `json:"record_id"`
	ProductCode string `json:"product_code"`
	Active      int    `json:"active"`
	Adder       int    `json:"adder"`
	Description string `json:"description"`
}

type GetLoanTypeList struct {
	LoanTypeList []GetLoanTypeData `json:"loantype_list"`
}
