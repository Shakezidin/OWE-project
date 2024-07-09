package models

type CreateNonCommDlrPay struct {
	UniqueID    string  `json:"unique_id"`
	ExactAmount float64 `json:"exact_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
	Date        string  `json:"date"`
}
