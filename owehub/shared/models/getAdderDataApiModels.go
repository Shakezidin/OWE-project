/**************************************************************************
 *	Function	: getAdderDataApiModels.go
 *	DESCRIPTION : Files contains struct for get rebate data models
 *	DATE        : 03-May-2024
 **************************************************************************/

package models

type GetAdderData struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Date        string  `json:"date"`
	TypeAdMktg  string  `json:"type_ad_mktg"`
	Type        string  `json:"type"`
	Gc          string  `json:"gc"`
	ExactAmount string  `json:"exact_amount"`
	PerKwAmt    float64 `json:"per_kw_amt"`
	RepPercent  int     `json:"rep_percent"`
	Description string  `json:"description"`
	Notes       string  `json:"notes"`
	SysSize     float64 `json:"sys_size"`
	AdderCal    float64 `json:"adder_cal"`
}

type GetAdderDataList struct {
	AdderDataList []GetAdderData `json:"adder_data_list"`
}
