/**************************************************************************
 *	Function	: EditLeadsDataModels.go
 *	DESCRIPTION : Files contains struct for editing leads
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type EditLeadsDataReq struct {
	LeadId        int64  `json:"leads_id"`
	EmailId       string `json:"email_id"`
	PhoneNumber   string `json:"phone_number"`
	StreetAddress string `json:"street_address"`
}

type EditLeadsDataRes struct {
	LeadID        int64  `json:"leads_id"`
	EmailId       string `json:"email_id"`
	PhoneNumber   string `json:"phone_number"`
	StreetAddress string `json:"street_address"`
}
