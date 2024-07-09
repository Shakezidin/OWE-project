/**************************************************************************
 *	Function	: createDLR_OTHApiModels.go
 *	DESCRIPTION : Files contains struct for create dlr_oth models
 *	DATE        : 26-JApr-2024
 **************************************************************************/

package models

type CreateDLR_OTH struct {
	Unique_Id   string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
}
