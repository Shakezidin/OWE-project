package models

type CreateNonCommDlrPay struct {
	UniqueID    string  `json:"unique_id"`
	Customer    string  `json:"customer"`
	DealerName  string  `json:"dealer_name"`
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
