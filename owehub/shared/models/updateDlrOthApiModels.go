/**************************************************************************
 *	Function	: getDLR_OTHApiModels.go
 *	DESCRIPTION : Files contains struct for get dlr_oth data
 *	DATE        : 26-Apr-2024
 **************************************************************************/

package models

type UpdateDLR_OTHData struct {
	Record_Id   int64   `json:"record_id"`
	Unique_Id   string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Description string  `json:"description"`
	Date        string  `json:"date"`
}

type UpdateDLR_OTHArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
