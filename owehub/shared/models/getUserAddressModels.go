/**************************************************************************
 *	Function	: getTimelineSlaApiModels.go
 *	DESCRIPTION : Files contains struct for get timeline sla type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetUserAddressData struct {
	UniqueId  string `json:"unique_id"`
	HomeOwner string `json:"home_owner"`
	Address   string `json:"address"`
	Latitute  string `json:"latitute"`
	Longitude string `json:"lognitude"`
}

type GetUserAddressList struct {
	UserAddressList []GetUserAddressData `json:"user_address_list"`
}
