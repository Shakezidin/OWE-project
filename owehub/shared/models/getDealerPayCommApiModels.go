/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for dealer pay models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

import "time"

type DealerPayReportRequest struct {
	Filters     []Filter `json:"filters"`
	PageNumber  int      `json:"page_number"`
	PageSize    int      `json:"page_size"`
	PartnerName []string `json:"partner_name"`
	PayroleDate string   `json:"payrole_date"`
	SearchInput string   `json:"search_input"`
	Paginate    bool     `json:"paginate"`
	Role string
	Email string
}

type Adder struct {
	SmallSystemSize float64 `json:"small_system_size"`
	Credit          string  `json:"credit"`
	Referral        string  `json:"referral"`
	Rebate          string  `json:"rebate"`
	Marketing       float64 `json:"marketing"`
}

type DealerPayReportResponse struct {
	Home_Owner     string    `json:"home_owner"`
	Current_Status string    `json:"current_status"`
	Unique_ID      string    `json:"unique_id"`
	Dealer_Code    string    `json:"dealer_code"`
	Sys_Size       float64   `json:"sys_size"`
	Contract       float64   `json:"contract"`
	Other_Adders   float64   `json:"other_adders"`
	Rep1           string    `json:"rep1"`
	Rep2           string    `json:"rep2"`
	Setter         string    `json:"setter"`
	ST             string    `json:"st"`
	Contract_Date  time.Time `json:"contract_date"`
	Loan_Fee       float64   `json:"loan_fee"`
	Net_EPC        float64   `json:"net_epc"`
	Credit         string    `json:"credit"`
	Draw_Amt       float64   `json:"draw_amt"`
	RL             float64   `json:"rl"`
	Type           string    `json:"finance_type"`
	Today          time.Time `json:"today"`
	Amount         float64   `json:"amount"`
	EPC            float64   `json:"epc"`
	Amt_Paid       float64   `json:"amt_paid"`
	Balance        float64   `json:"balance"`
	Adder          Adder     `json:"adder"`
	Watt           float64   `json:"watt"`
	Commissions    float64   `json:"commissions"`
	Paid           float64   `json:"paid"`
}

type DealerPayCommissions struct {
	DealerPayComm         []DealerPayReportResponse
	AmountPrepaid         float64 `json:"amount_prepaid"`
	AmountPrepaidPerc     float64 `json:"amount_prepaid_per"`
	Pipeline_Remaining    float64 `json:"pipeline_remaining"`
	PipelineRemainingPerc float64 `json:"pipeline_remaining_per"`
	Current_Due           float64 `json:"current_Due "`
	CurrentDuePerc        float64 `json:"current_due_per "`
}
