/**************************************************************************
 *	Function	: updateDealerCreditApiModels.go
 *	DESCRIPTION : Files contains struct for update DealerCredit models
 *	DATE        : 25-Apr-2024
 **************************************************************************/

package models

type UpdateDealerCredit struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Date        string  `json:"date"`
	ExactAmount float64 `json:"exact_amount"`
	PerKwAmount float64 `json:"per_kw_amount"`
	ApprovedBy  string  `json:"approved_by"`
	Notes       string  `json:"notes"`
}

type UpdateDealerCreditArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
