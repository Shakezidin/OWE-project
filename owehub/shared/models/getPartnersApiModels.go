/**************************************************************************
 *	Function	: getSaleTypeApiModels.go
 *	DESCRIPTION : Files contains struct for get sale type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPartnerData struct {
	PartnerName string `json:"partner_name"`
	Description string `json:"description"`
}

type GetPartnerList struct {
	PartnersList []GetPartnerData `json:"partner_list"`
}
