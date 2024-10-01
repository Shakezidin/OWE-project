/**************************************************************************
 *	Function	: dealerOverride.go
 *	DESCRIPTION : Files contains functions for dealer override config
 *	DATE        : 20-June-2024
 **************************************************************************/

package oweconfig

import "time"

type DealerOverrideStruct struct {
	ItemID    int64     `json:"item_id"`
	PodioLink string    `json:"podio_link"`
	SubDealer string    `json:"sub_dealer"`
	Dealer    string    `json:"dealer"`
	PayRate   float64   `json:"pay_rate"`
	State     string    `json:"state"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

type DealerOverride struct {
	DealerOverrideData []DealerOverrideStruct
}

func (dlrOvrd *DealerOverride) LoadConfigFromDB() {

}
