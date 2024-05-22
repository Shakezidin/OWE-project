/**************************************************************************
 *	Function	: getDealerCreditDataApiModels.go
 *	DESCRIPTION : Files contains struct for get referral data models
 *	DATE        : 25-Apr-2024
 **************************************************************************/

package models

type GetDealerCredit struct {
	RecordId    int64   `json:"record_id"`
	UniqueID    string  `json:"unique_id"`
	ExactAmount float64  `json:"exact_amount"`
	PerKWAmount float64 `json:"per_kw_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
	TotalAmount float64 `json:"total_amount"`
	SysSize     float64 `json:"sys_size"`
	Date        string  `json:"date"`
}

type GetDealerCreditList struct {
	DealerCreditList []GetDealerCredit `json:"dealer_credit_data_list"`
}
