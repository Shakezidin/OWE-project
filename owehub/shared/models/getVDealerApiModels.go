/**************************************************************************
 *	Function	: getVDealerApiModels.go
 *	DESCRIPTION : Files contains struct for get Dealer models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetVDealerData struct {
	RecordId    int64  `json:"record_id"`
	DealerCode  string `json:"dealer_code"`
	DealerName  string `json:"dealer_name"`
	Description string `json:"Description"`
	DealerLogo  string `json:"dealer_logo"`
}

type GetVDealersList struct {
	VDealersList []GetVDealerData `json:"vdealers_list"`
}
