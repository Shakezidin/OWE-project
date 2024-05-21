/**************************************************************************
 *	Function	: UpdateApRepModels.go
 *	DESCRIPTION : Files contains struct for Update ap_rep API Model
 *	DATE        : 21-May-2024
 **************************************************************************/

package models

type UpdateApRep struct {
	RecordId    int64   `json:"record_id"`
	Rep         string  `json:"rep"`
	Dba         string  `json:"dba"`
	Type        string  `json:"final"`
	Date        string  `json:"date"`
	Amount      float64 `json:"amount"`
	Method      string  `json:"method"`
	Cbiz        string  `json:"cbiz"`
	Transaction int64   `json:"transaction"`
	Notes       string  `json:"notes"`
}

type UpdateApRepArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
