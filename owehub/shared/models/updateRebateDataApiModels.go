/**************************************************************************
 *	Function	: updateRebateDataApiModels.go
 *	DESCRIPTION : Files contains struct for update rebate data models
 *	DATE        : 24-Apr-2024
 **************************************************************************/

package models

type UpdateRebateData struct {
	RecordId        int64   `json:"record_id"`
	CustomerVerf    string  `json:"customer_verf"`
	UniqueId        string  `json:"unique_id"`
	Date            string  `json:"date"`
	Type            string  `json:"type"`
	Item            string  `json:"item"`
	Amount          float64 `json:"amount"`
	RepDollDivbyPer float64 `json:"rep_doll_divby_per"`
	Notes           string  `json:"notes"`
}

type UpdateRebateDataArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
