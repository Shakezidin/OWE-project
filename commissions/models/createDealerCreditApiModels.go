package models

type CreateDealerCredit struct {
	UniqueID    string  `json:"unique_id"`
	Customer    string  `json:"customer"`
	DealerName  string  `json:"dealer_name"`
	DealerDBA   string  `json:"dealer_dba"`
	ExactAmount string  `json:"exact_amount"`
	PerKWAmount float64 `json:"per_kw_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
	TotalAmount float64 `json:"total_amount"`
	SysSize     float64 `json:"sys_size"`
	StartDate   string  `json:"start_date"`
	EndDate     *string `json:"end_date"`
}
