/**************************************************************************
 *	Function	: UpdateAdderDataModels.go
 *	DESCRIPTION : Files contains struct for Update adder Data API
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type UpdateAdderDataReq struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Date        string  `json:"date"`
	TypeAdMktg  string  `json:"type_ad_mktg"`
	Gc          string  `json:"gc"`
	ExactAmount float64 `json:"exact_amount"`
	PerKwAmt    float64 `json:"per_kw_amt"`
	RepPercent  float64 `json:"rep_percent"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
	AdderCalc   float64
}

type UpdateAdderDataArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
