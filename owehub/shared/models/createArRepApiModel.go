/**************************************************************************
 *	Function	: createApRepApiModels.go
 *	DESCRIPTION : Files contains struct for create ap-rep API
 *	DATE        : 21-May-2024
 **************************************************************************/

package models

type CreateApRepReq struct {
	UniqueId    string  `json:"unique_id"`
	Rep         string  `json:"rep"`
	Dba         string  `json:"dba"`
	Type        string  `json:"type"`
	Date        string  `json:"date"`
	Amount      float64 `json:"amount"`
	Method      string  `json:"method"`
	Cbiz        string  `json:"cbiz"`
	Transaction string  `json:"transaction"`
	Notes       string  `json:"notes"`
}
