/**************************************************************************
 *	Function	: getDLR_OTHApiModels.go
 *	DESCRIPTION : Files contains struct for get dlr_oth data
 *	DATE        : 26-Apr-2024
 **************************************************************************/

package models

type UpdateDLR_OTHData struct {
	Record_Id    int64   `json:"record_id"`
	Unique_Id   string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      string  `json:"amount"`
	Description string  `json:"description"`
	Balance     float64 `json:"balance"`
	Paid_Amount float64 `json:"paid_amount"`
	StartDate   string  `json:"start_date"`
	EndDate     string  `json:"end_date"`
}

type UpdateDLR_OTHArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
