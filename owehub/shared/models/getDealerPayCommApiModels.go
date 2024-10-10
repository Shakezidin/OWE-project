/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for dealer pay models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

import "time"

type DealerPayReportRequest struct {
	PartnerName []string `json:"partner_name"`
	PayroleDate string   `json:"payrole_date"`
}

type DealerPayReportResponse struct {
	Home_Owner     string    `json:"home_owner"`
	Current_Status string    `json:"current_status"`
	Unique_ID      string    `json:"unique_id"`
	Dealer_Code    string    `json:"dealer_code"`
	Sys_Size       string    `json:"sys_size"`
	Contract       string    `json:"contract"`
	Other_Adders   string    `json:"other_adders"`
	Rep1           string    `json:"rep1"`
	Rep2           string    `json:"rep2"`
	Setter         string    `json:"setter"`
	ST             string    `json:"st"`
	Contract_Date  time.Time `json:"contract_date"`
	Loan_Fee       string    `json:"loan_fee"`
	Net_EPC        string    `json:"net_epc"`
	Credit         string    `json:"credit"`
	Draw_Amt       float64   `json:"draw_amt"`
	RL             string    `json:"rl"`
	Type           string    `json:"type"`
	Today          time.Time `json:"today"`
	Amount         float64   `json:"amount"`
	EPC            string    `json:"epc"`
	Amt_Paid       float64   `json:"amt_paid"`
	Balance        string    `json:"balance"`
}

type DealerPayCommissions struct {
	DealerPayComm []DealerPayReportResponse
}
