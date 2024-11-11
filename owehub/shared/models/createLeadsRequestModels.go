/**************************************************************************
 *	Function	: createLeadsRequestModels.go
 *	DESCRIPTION : Files contains struct for create leads API
 *	DATE        : 12-Sept-2024
 **************************************************************************/

package models

type CreateLeadsReq struct {
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	PhoneNumber   string `json:"phone_number"`
	EmailId       string `json:"email_id"`
	StreetAddress string `json:"street_address"`
	// State         string `json:"state"`
	// City          string `json:"city"`
	Zipcode string `json:"zipcode"`
	// Country       string `json:"country"`
	Notes        string `json:"notes"`
	SalesRepName string `json:"sales_rep_name"`
	LeadSource   string `json:"lead_source"`
}
