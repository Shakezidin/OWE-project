/**************************************************************************
 *	Function	: createLoanTypeApiModels.go
 *	DESCRIPTION : Files contains struct for create loan type user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateLoanType struct {
	ProductCode string `json:"product_code"`
	Active      int    `json:"active"`
	Adder       int    `json:"adder"`
	Description string `json:"description"`
}

type UpdateLoanTypeArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
