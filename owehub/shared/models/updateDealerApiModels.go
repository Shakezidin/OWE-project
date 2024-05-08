/**************************************************************************
 *	Function	: updateDealerApiModels.go
 *	DESCRIPTION : Files contains struct for update dealer user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateDealer struct {
	RecordId  int64  `json:"record_id"`
	SubDealer string `json:"sub_dealer"`
	Dealer    string `json:"dealer"`
	State     string `json:"state"`
	PayRate   string `json:"pay_rate"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type UpdateDealerArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
