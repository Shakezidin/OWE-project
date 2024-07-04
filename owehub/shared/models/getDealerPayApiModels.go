/**************************************************************************
 *	Function	: DealerApiModels.go
 *	DESCRIPTION : Files contains struct for get Dealer models
 *	DATE        : 28-May-2024
 **************************************************************************/

package models

type GetDealerPay struct {
	PayRollStartDate string   `json:"pay_roll_start_date"`
	PayRollEndDate   string   `json:"pay_roll_end_date"`
	UseCutoff        string   `json:"use_cutoff"`
	DealerName       string   `json:"dealer_name"`
	SortBy           string   `json:"sort_by"`
	PageNumber       int      `json:"page_number"`
	PageSize         int      `json:"page_size"`
	CommissionModel  string   `json:"commission_model"`
	Filters          []Filter `json:"filters"`
}

type GetDealerPayPRData struct {
	Home_owner    string  `json:"home_owner"`
	CurrentStatus string  `json:"current_status"`
	StatusDate    string  `json:"status_date"`
	UniqueId      string  `json:"unique_id"`
	Dealer        string  `json:"dealer"`
	DBA           string  `json:"dba"`
	PaymentType   string  `json:"payment_type"`
	FinanceType   string  `json:"finance_type"`
	Today         string  `json:"today"`
	Amount        float64 `json:"amount"`
	SysSize       float64 `json:"sys_size"`
	ContractValue float64 `json:"contract_value"`
	LoanFee       float64 `json:"loan_fee"`
	OtherAdders   float64 `json::"other_adders"`
	Epc           float64 `json:"epc"`
	NetEpc        float64 `json:"net_epc"`
	RL            float64 `json:"rl"`
	Credit        float64 `json:"credit"`
	Rep1          string  `json:"rep1"`
	Rep2          string  `json:"rep2"`
	RepPay        float64 `json:"rep_pay"`
	NetRev        float64 `json:"net_rev"`
	DrawAmt       float64 `json:"draw_amt"`
	AmtPaid       float64 `json:"amt_paid"`
	Balance       float64 `json:"balance"`
	St            string  `json:"state"`
	ContractDate  string  `json:"contract_date"`
}

type GetDealerPayPRDataList struct {
	DealerPayList []GetDealerPayPRData `json:"dealer_pay_list"`
}
