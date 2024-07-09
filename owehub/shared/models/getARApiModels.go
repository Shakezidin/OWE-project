/**************************************************************************
 *	Function	: GetArModels.go
 *	DESCRIPTION : Files contains struct for Get adder Credit API Model
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetARReq struct {
	RecordId     int64   `json:"record_id"`
	UniqueId     string  `json:"unique_id"`
	CustomerName string  `json:"customer_name"`
	Date         string  `json:"date"`
	Amount       float64  `json:"amount"`
	PaymentType  string  `json:"payment_type"`
	Bank         string  `json:"bank"`
	Ced          string  `json:"ced"`
	PartnerName  string  `json:"partner_name"`
	TotalPaid    float64 `json:"total_paid"`
	StateName    string  `json:"state_name"`
}

type GetARList struct {
	ARList []GetARReq `json:"ar__list"`
}
