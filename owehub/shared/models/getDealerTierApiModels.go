/**************************************************************************
 *	Function	: getDealerTierApiModels.go
 *	DESCRIPTION : Files contains struct for get dealer Tier user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetDealerTierData struct {
	RecordId  int64   `json:"record_id"`
	DealerName string `json:"dealer_name"`
	Tier       string `json:"tier"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
}

type GetDealersTierList struct {
	DealersTierList []GetDealerTierData `json:"dealers_tier_list"`
}
