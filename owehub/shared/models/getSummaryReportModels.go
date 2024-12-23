/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for summary report models
 *	DATE        : 22-Dec-2024
 **************************************************************************/

package models

import "time"

type SummaryReportRequest struct {
	Year       string   `json:"year"`
	Week       string   `json:"week"`
	Day        string   `json:"day"`
	ReportType string   `json:"report_type"`
	Office     []string `json:"office"`
}

type ProductionSummaryReportResponse struct {
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

type DataPoint struct {
	Value map[string]float64 `json:"value"`
}

type OverallSpeedSummaryReportResponse struct {
	Data map[string][]DataPoint `json:"data"`
}
