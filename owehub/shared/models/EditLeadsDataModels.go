/**************************************************************************
 *	Function	: EditLeadsDataModels.go
 *	DESCRIPTION : Files contains struct for editing leads
 *	DATE        : 27-sep-2024
 **************************************************************************/

package models

type EditLeadsDataReq struct {
	LeadId int64 `json:"leads_id"`

	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	PhoneNumber   string `json:"phone_number"`
	EmailId       string `json:"email_id"`
	StreetAddress string `json:"street_address"`
	Notes         string `json:"notes"`
	SalerepID     int64  `json:"salerep_id"`
	LeadSource    string `json:"lead_source"`
}
