/**************************************************************************
 *	Function	: createLoanFeeApiModels.go
 *	DESCRIPTION : Files contains struct for create LoanFee models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type CreateLoanFee struct {
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
