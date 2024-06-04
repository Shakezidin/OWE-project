/**************************************************************************
 *	Function	: DealerApiModels.go
 *	DESCRIPTION : Files contains struct for get Dealer models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

import "time"

type GetDealerData struct {
	RecordId  int64     `json:"record_id"`
	SubDealer string    `json:"sub_dealer"`
	Dealer    string    `json:"dealer"`
	State     string    `json:"state"`
	PayRate   string    `json:"pay_rate"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

type GetDealersList struct {
	DealersList []GetDealerData `json:"Dealers_list"`
}
