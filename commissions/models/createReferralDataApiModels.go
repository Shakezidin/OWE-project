package models

type CreateReferralData struct {
	ID                   int     `json:"id"`
	UniqueID             string  `json:"unique_id"`
	NewCustomer          string  `json:"new_customer"`
	ReferrerSerial       string  `json:"referrer_serial"`
	ReferrerName         string  `json:"referrer_name"`
	Amount               string  `json:"amount"`
	RepDollDivbyPer      float64 `json:"rep_doll_divby_per"`
	Notes                string  `json:"notes"`
	Type                 string  `json:"type"`
	Rep1Name             string  `json:"rep_1_name"`
	Rep2Name             string  `json:"rep_2_name"`
	SysSize              float64 `json:"sys_size"`
	RepCount             float64 `json:"rep_count"`
	State                string  `json:"state"`
	PerRepAddrShare      float64 `json:"per_rep_addr_share"`
	PerRepOvrdShare      float64 `json:"per_rep_ovrd_share"`
	R1PayScale           float64 `json:"r1_pay_scale"`
	R1ReferralCredit     string  `json:"r1_referral_credit_$"`
	R1ReferralCreditPerc string  `json:"r1_referral_credit_perc"`
	R1AddrResp           string  `json:"r1_addr_resp"`
	R2PayScale           float64 `json:"r2_pay_scale"`
	R2ReferralCredit     string  `json:"r2_referral_credit_$"`
	R2ReferralCreditPerc string  `json:"r2_referral_credit_perc"`
	R2AddrResp           string  `json:"r2_addr_resp"`
	StartDate            string  `json:"start_date"`
	EndDate              *string `json:"end_date"`
}
