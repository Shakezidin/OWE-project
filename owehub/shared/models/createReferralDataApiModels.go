package models

type CreateReferralData struct {
	UniqueID        string  `json:"unique_id"`
	NewCustomer     string  `json:"new_customer"`
	ReferrerSerial  string  `json:"referrer_serial"`
	ReferrerName    string  `json:"referrer_name"`
	Date            string  `json:"start_date"`
	Amount          float64 `json:"amount"`
	RepDollDivbyPer float64 `json:"rep_doll_divby_per"`
	Notes           string  `json:"notes"`
}
