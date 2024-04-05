/**************************************************************************
 *	Function	: updateTierLoanFeeApiModels.go
 *	DESCRIPTION : Files contains struct for update Tier loan Fee user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateTierLoanFee struct {
	RecordId    int64  `json:"record_id"`
	DealerTier  string `json:"dealer_tier"`
	Installer   string `json:"installer"`
	State       string `json:"state"`
	FinanceType string `json:"finance_type"`
	OweCost     string `json:"owe_cost"`
	DlrMu       string `json:"dlr_mu"`
	DlrCost     string `json:"dlr_cost"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
}
