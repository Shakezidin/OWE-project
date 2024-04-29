package models

type GetAutoAdderData struct {
	RecordId              int64   `json:"record_id"`
	UniqueID              string  `json:"unique_id"`
	TypeAAMktg            string  `json:"type_aa_mktg"`
	GC                    string  `json:"gc"`
	ExactAmount           string  `json:"exact_amount"`
	PerKWAmount           float64 `json:"per_kw_amount"`
	RepDollDivbyPer       float64 `json:"rep_doll_divby_per"`
	DescriptionRepVisible string  `json:"description_rep_visible"`
	NotesNotRepVisible    string  `json:"notes_not_rep_visible"`
	Type                  string  `json:"type"`
	Rep1                  string  `json:"rep_1_name"`
	Rep2                  string  `json:"rep_2_name"`
	SysSize               float64 `json:"sys_size"`
	State                 string  `json:"state"`
	RepCount              float64 `json:"rep_count"`
	PerRepAddrShare       float64 `json:"per_rep_addr_share"`
	PerRepOvrdShare       float64 `json:"per_rep_ovrd_share"`
	R1PayScale            float64 `json:"r1_pay_scale"`
	Rep1DefResp           string  `json:"rep_1_def_resp"`
	R1AddrResp            string  `json:"r1_addr_resp"`
	R2PayScale            float64 `json:"r2_pay_scale"`
	Rep2DefResp           string  `json:"rep_2_def_resp"`
	R2AddrResp            string  `json:"r2_addr_resp"`
	ContractAmount        float64 `json:"contract_amount"`
	ProjectBaseCost       float64 `json:"project_base_cost"`
	CrtAddr               float64 `json:"crt_addr"`
	R1LoanFee             float64 `json:"r1_loan_fee"`
	R1Rebate              float64 `json:"r1_rebate"`
	R1Referral            float64 `json:"r1_referral"`
	R1RPlusR              float64 `json:"r1_r_plus_r"`
	TotalComm             float64 `json:"total_comm"`
	StartDate             string  `json:"start_date"`
	EndDate               string  `json:"end_date"`
}

type GetAutoAdderList struct {
	AutoAdderList []GetAutoAdderData `json:"auto_adder_list"`
}
