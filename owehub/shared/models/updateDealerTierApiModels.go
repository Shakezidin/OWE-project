/**************************************************************************
 *	Function	: updateDealerTierApiModels.go
 *	DESCRIPTION : Files contains struct for update dealer Tier user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateDealerTier struct {
	RecordId   int64  `json:"record_id"`
	DealerName string `json:"dealer_name"`
	Tier       string `json:"tier"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
}

type UpdateDealerTierArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
