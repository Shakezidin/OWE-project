/**************************************************************************
 *	Function	: GetApRepModels.go
 *	DESCRIPTION : Files contains struct for Get ar_rep API Model
 *	DATE        : 21-May-2024
 **************************************************************************/

package models

type GetApRep struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Rep         string  `json:"rep"`
	Dba         string  `json:"dba"`
	Type        string  `json:"final"`
	Date        string  `json:"date"`
	Amount      float64 `json:"amount"`
	Method      string  `json:"method"`
	Cbiz        string  `json:"cbiz"`
	Transaction string  `json:"transaction"`
	Notes       string  `json:"notes"`
}

type GetApRepDataList struct {
	ApRepList []GetApRep `json:"ap_rep_list"`
}
