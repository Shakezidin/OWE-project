package models

type CreateDealerCredit struct {
	UniqueId    string  `json:"unique_id"`
	Date        string  `json:"date"`
	ExactAmount float64 `json:"exact_amount"`
	PerKwAmount float64 `json:"per_kw_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
}
