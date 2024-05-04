/**************************************************************************
 *	Function	: createArModels.go
 *	DESCRIPTION : Files contains struct for create ar API
 *	DATE        : 30-Apr-2024
 **************************************************************************/

package models

type CreateARReq struct {
	UniqueId     string `json:"unique_id"`
	CustomerName string `json:"customer_name"`
	Date         string `json:"date"`
	Amount       string `json:"amount"`
	Notes        string `json:"notes"`
}
