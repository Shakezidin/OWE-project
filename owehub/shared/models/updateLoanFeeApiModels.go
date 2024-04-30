/**************************************************************************
 *	Function	: UpdateLoanFeeApiModels.go
 *	DESCRIPTION : Files contains struct for Update LoanFee models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type UpdateLoanFee struct {
	RecordId  int64   `json:"record_id"`
	UniqueID  string  `json:"unique_id"`
	Dealer    string  `json:"dealer"`
	Installer string  `json:"installer"`
	State     string  `json:"state"`
	LoanType  string  `json:"loan_type"`
	OweCost   float64 `json:"owe_cost"`
	DlrMu     string  `json:"dlr_mu"`
	DlrCost   string  `json:"dlr_cost"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
}

type UpdateLoanFeeArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
