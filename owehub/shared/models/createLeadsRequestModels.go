/**************************************************************************
 *	Function	: createLeadsRequestModels.go
 *	DESCRIPTION : Files contains struct for create leads API
 *	DATE        : 12-Sept-2024
 **************************************************************************/

package models

type
CreateLeadsReq struct {
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	PhoneNumber   string `json:"phone_number"`
	EmailId       string `json:"email_id"`
	StreetAddress string `json:"street_address"`
	Zipcode       string `json:"zipcode"`
	Notes         string `json:"notes"`
	SalerepID     int64  `json:"salerep_id"`
	LeadSource    string `json:"lead_source"`
	BaseURL       string `json:"base_url"`
	SetterID      int64  `json:"setter_id"`
}
