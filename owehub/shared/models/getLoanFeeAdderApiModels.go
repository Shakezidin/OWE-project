/**************************************************************************
 *	Function	: getLoanFeeAdderApiModels.go
 *	DESCRIPTION : Files contains struct for update LoanFeeAdder models
 *	DATE        : 24-Apr-2024
 **************************************************************************/

package models

type GetLoanFeeAdder struct {
	RecordId              int64   `json:"record_id"`
	UniqueID              string  `json:"unique_id"`
	TypeMktg              string  `json:"type_mktg"`
	Dealer                string  `json:"dealer"`
	Installer             string  `json:"installer"`
	State                 string  `json:"state"`
	Contract              float64 `json:"contract_$$"`
	DealerTier            string  `json:"dealer_tier"`
	OweCost               float64 `json:"owe_cost"`
	AddrAmount            float64 `json:"addr_amount"`
	PerKwAmount           float64 `json:"per_kw_amount"`
	RepDollDivbyPer       float64 `json:"rep_doll_divby_per"`
	DescriptionRepVisible string  `json:"description_rep_visible"`
	NotesNotRepVisible    string  `json:"notes_not_rep_visible"`
	Type                  string  `json:"type"`
	Rep1Name              string  `json:"rep1_Name"`
	Rep2Name              string  `json:"rep2_Name"`
	SysSize               float64 `json:"sys_size"`
	RepCount              float64 `json:"rep_count"`
	PerRepAddrShare       float64 `json:"per_rep_addr_share"`
	PerRepOvrdShare       float64 `json:"per_rep_ovrd_share"`
	R1PayScale            float64 `json:"r1_pay_scale"`
	Rep1DefResp           string  `json:"rep_1_def_resp"`
	R1AddrResp            string  `json:"r1_addr_resp"`
	R2PayScale            float64 `json:"r2_pay_scale"`
	Rep2DefResp           string  `json:"rep_2_def_resp"`
	R2AddrResp            string  `json:"r2_addr_resp"`
	StartDate             string  `json:"start_date"`
	EndDate               string  `json:"end_date"`
}

type GetLoanFeeAdderList struct {
	LoanFeeAdderList []GetLoanFeeAdder `json:"loan_fee_adder_list"`
}
