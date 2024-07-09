/**************************************************************************
 *	Function	: getNonCommDlrPayDataApiModels.go
 *	DESCRIPTION : Files contains struct for get NonComm Dealer Pay models
 *	DATE        : 25-Apr-2024
 **************************************************************************/

package models

type GetNonCommDlrPay struct {
	RecordId    int64   `json:"record_id"`
	UniqueID    string  `json:"unique_id"`
	Customer    string  `json:"customer"`
	DealerName  string  `json:"dealer_name"`
	DealerDBA   string  `json:"dealer_dba"`
	ExactAmount float64 `json:"exact_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
	Balance     float64 `json:"balance"`
	PaidAmount  float64 `json:"paid_amount"`
	DBA         string  `json:"dba"`
	Date        string  `json:"date"`
}

type GetNonCommDlrPayList struct {
	NonCommDlrPayList []GetNonCommDlrPay `json:"noncomm_dlr_pay_data_list"`
}
