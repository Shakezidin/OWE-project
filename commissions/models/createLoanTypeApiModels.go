/**************************************************************************
 *	Function	: createLoanTypeApiModels.go
 *	DESCRIPTION : Files contains struct for update loan type user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateLoanType struct {
	RecordId    int64  `json:"record_id"`
	ProductCode string `json:"product_code"`
	Active      int    `json:"active"`
	Adder       int    `json:"adder"`
	Description string `json:"description"`
}
