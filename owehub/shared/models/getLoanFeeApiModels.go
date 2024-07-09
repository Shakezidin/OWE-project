/**************************************************************************
 *	Function	: GetLoanFeeApiModels.go
 *	DESCRIPTION : Files contains struct for Get LoanFee models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetLoanFee struct {
	RecordId  int64   `json:"record_id"`
	Dealer    string  `json:"dealer"`
	Installer string  `json:"installer"`
	State     string  `json:"state"`
	LoanType  string  `json:"loan_type"`
	OweCost   float64 `json:"owe_cost"`
	DlrMu     float64 `json:"dlr_mu"`
	DlrCost   float64 `json:"dlr_cost"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
}

type GetLoanFeeList struct {
	LoanFeeList []GetLoanFee `json:"loan_fee_list"`
}
