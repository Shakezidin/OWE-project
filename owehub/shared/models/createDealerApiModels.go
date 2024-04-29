/**************************************************************************
 *	Function	: createDealerApiModels.go
 *	DESCRIPTION : Files contains struct for create dealer user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateDealer struct {
	SubDealer string `json:"sub_dealer"`
	Dealer    string `json:"dealer"`
	PayRate   string `json:"pay_rate"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}
