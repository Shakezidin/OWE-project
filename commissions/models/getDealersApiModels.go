/**************************************************************************
 *	Function	: DealerApiModels.go
 *	DESCRIPTION : Files contains struct for get Dealer models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetDealerData struct {
	SubDealer string `json:"sub_dealer"`
	Dealer    string `json:"dealer"`
	PayRate   string `json:"pay_rate"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type GetDealersList struct {
	DealersList []GetDealerData `json:"Dealers_list"`
}
