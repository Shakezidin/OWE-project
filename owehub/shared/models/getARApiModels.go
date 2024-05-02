/**************************************************************************
 *	Function	: GetArModels.go
 *	DESCRIPTION : Files contains struct for Get adder Credit API Model
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetARReq struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	PayScale    string  `json:"pay_scale"`
	Position    string  `json:"position"`
	Adjustment  string  `json:"adjustment"`
	MinRate     float64 `json:"min_rate"`
	MaxRate     float64 `json:"max_rate"`
	Is_Archived bool    `json:"is_archived"`
}

type GetARList struct {
	ARList []GetARReq `json:"ar__list"`
}
