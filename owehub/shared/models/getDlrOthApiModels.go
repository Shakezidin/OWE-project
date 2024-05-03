/**************************************************************************
 *	Function	: getDLR_OTHApiModels.go
 *	DESCRIPTION : Files contains struct for get dlr_oth data
 *	DATE        : 26-Apr-2024
 **************************************************************************/

package models

type GetDLR_OTHData struct {
	RecordId    int64   `json:"record_id"`
	Unique_Id   string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      string  `json:"amount"`
	Description string  `json:"description"`
	Balance     float64 `json:"balance"`
	Paid_Amount float64 `json:"paid_amount"`
	StartDate   string  `json:"start_date"`
	EndDate     string  `json:"end_date"`
}

type GetDLR_OTHList struct {
	DLR_OTHList []GetDLR_OTHData `json:"dlr_othlist"`
}
