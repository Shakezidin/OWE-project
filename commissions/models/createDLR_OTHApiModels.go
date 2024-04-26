/**************************************************************************
 *	Function	: createDLR_OTHApiModels.go
 *	DESCRIPTION : Files contains struct for create dlr_oth models
 *	DATE        : 26-Jan-2024
 **************************************************************************/

package models

type CreateDLR_OTH struct {
	Unique_Id   string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      string  `json:"amount"`
	Description string  `json:"description"`
	Balance     float64 `json:"balance"`
	Paid_Amount float64 `json:"paid_amount"`
	StartDate   string  `json:"start_date"`
	EndDate     string  `json:"end_date"`
}
