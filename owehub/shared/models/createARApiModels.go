/**************************************************************************
 *	Function	: createArModels.go
 *	DESCRIPTION : Files contains struct for create ar API
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type CreateARReq struct {
	UniqueId    string  `json:"unique_id"`
	Date        string  `json:"date"`
	Amount      float64 `json:"amount"`
	PaymentType string  `json:"payment_type"`
	Bank        string  `json:"bank"`
	Ced         string  `json:"ced"`
}
