/**************************************************************************
 *	Function	: UpdateApRepModels.go
 *	DESCRIPTION : Files contains struct for Update ar_rep API Model
 *	DATE        : 21-May-2024
 **************************************************************************/

package models

type UpdateApRep struct {
	RecordId    int64   `json:"record_id"`
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

type UpdateApRepArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
