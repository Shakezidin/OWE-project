/**************************************************************************
 *	Function	: UpdateVDealerApiModels.go
 *	DESCRIPTION : Files contains struct for update Dealer models
 *	DATE        : 22-May-2024
 **************************************************************************/

package models

type UpdateVDealer struct {
	RecordId      string `json:"record_id"`
	DealerCode    string `json:"dealer_code"`
	DealerName    string `json:"dealer_name"`
	Description   string `json:"Description"`
	DealerLogo    string `json:"dealer_logo"`
	BgColour      string `json:"bg_colour"`
	PreferredName string `json:"preferred_name"`
}

type UpdateVDealerArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
