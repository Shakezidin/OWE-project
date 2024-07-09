/**************************************************************************
 *	Function	: createPartnersApiModels.go
 *	DESCRIPTION : Files contains struct for create partner user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreatePartner struct {
	PartnerName string `json:"partner_name"`
	Description string `json:"description"`
}
