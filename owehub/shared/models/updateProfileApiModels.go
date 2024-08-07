/**************************************************************************
 *	Function	: createProfileApiModels.go
 *	DESCRIPTION : Files contains struct for create Profile API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateProfileReq struct {
	StreetAddress string `json:"street_address"`
	State         string `json:"state"`
	City          string `json:"city"`
	Zipcode       string `json:"zipcode"`
	Country       string `json:"country"`
	PreferredName string `json:"preferred_name"`
	DealerCode    string `json:"dealer_code"`
}
