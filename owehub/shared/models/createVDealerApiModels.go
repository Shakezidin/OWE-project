/**************************************************************************
 *	Function	: createVDealerApiModels.go
 *	DESCRIPTION : Files contains struct for create v_adders user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateVDealer struct {
	DealerCode    string `json:"dealer_code"`
	DealerName    string `json:"dealer_name"`
	Description   string `json:"Description"`
	DealerLogo    string `json:"dealer_logo"`
	BgColour      string `json:"bg_colour"`
	PreferredName string `json:"preferred_name"`
}
