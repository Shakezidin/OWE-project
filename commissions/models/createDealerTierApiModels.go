/**************************************************************************
 *	Function	: createDealerTierApiModels.go
 *	DESCRIPTION : Files contains struct for create dealer Tier user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateDealerTier struct {
	DealerName string `json:"dealer_name"`
	Tier       string `json:"tier"`
	StartDate  string `json:"start_date" sql:"NOT NULL"`
	EndDate    string `json:"end_date"`
}
