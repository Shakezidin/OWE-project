/**************************************************************************
 *	Function	: GetArModels.go
 *	DESCRIPTION : Files contains struct for Get adder Credit API Model
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetARReq struct {
	RecordId     int64  `json:"record_id"`
	UniqueId     string `json:"unique_id"`
	CustomerName string `json:"customer_name"`
	Date         string `json:"date"`
	Amount       string `json:"amount"`
	Notes        string `json:"notes"`
}

type GetARList struct {
	ARList []GetARReq `json:"ar__list"`
}
