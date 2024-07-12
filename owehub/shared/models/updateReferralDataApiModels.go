/**************************************************************************
 *	Function	: updateReferralDataApiModels.go
 *	DESCRIPTION : Files contains struct for update AutoAdder models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateReferralData struct {
	RecordId        int64   `json:"record_id"`
	UniqueID        string  `json:"unique_id"`
	NewCustomer     string  `json:"new_customer"`
	ReferrerSerial  string  `json:"referrer_serial"`
	ReferrerName    string  `json:"referrer_name"`
	Date            string  `json:"start_date"`
	Amount          float64 `json:"amount"`
	RepDollDivbyPer float64 `json:"rep_doll_divby_per"`
	Notes           string  `json:"notes"`
}

type UpdateReferralDataArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
