/**************************************************************************
 *	Function	: createTierLoanFeeApiModels.go
 *	DESCRIPTION : Files contains struct for create Tier loan Fee user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetTierLoanFeeData struct {
	RecordId   int64   `json:"record_id"`
	DealerTier string  `json:"dealer_tier"`
	Installer  string  `json:"installer"`
	State      string  `json:"state"`
	LoanType   string  `json:"loan_type"`
	OweCost    float64 `json:"owe_cost"`
	DlrMu      float64 `json:"dlr_mu"`
	DlrCost    float64 `json:"dlr_cost"`
	StartDate  string  `json:"start_date"`
	EndDate    string  `json:"end_date"`
}

type GetTierLoanFeeList struct {
	TierLoanFeeList []GetTierLoanFeeData `json:"tier_loan_fee_list"`
}
