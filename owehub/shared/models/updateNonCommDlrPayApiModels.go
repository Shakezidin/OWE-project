/**************************************************************************
 *	Function	: updateUpdateNonCommDlrPayApiModels.go
 *	DESCRIPTION : Files contains struct for update UpdateNonCommDlrPay models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateNonCommDlrPay struct {
	RecordId    int64   `json:"record_id"`
	UniqueID    string  `json:"unique_id"`
	Customer    string  `json:"customer"`
	Dealer      string  `json:"dealer"`
	DealerDBA   string  `json:"dealer_dba"`
	ExactAmount string  `json:"exact_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
	Balance     float64 `json:"balance"`
	PaidAmount  float64 `json:"paid_amount"`
	DBA         string  `json:"dba"`
	StartDate   string  `json:"start_date"`
	EndDate     *string `json:"end_date,omitempty"`
}

type UpdateNonCommDlrPayArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
