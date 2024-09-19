/**************************************************************************
 *	Function	: getTimelineSlaApiModels.go
 *	DESCRIPTION : Files contains struct for get timeline sla type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetUserAddressReq struct {
	PageNumber    int      `json:"page_number"`
	PageSize      int      `json:"page_size"`
	UniqueIds     []string `json:"unique_ids"`
	StartDate     string   `json:"start_date"`
	EndDate       string   `json:"end_date"`
	Email         string   `json:"email"`
	ProjectStatus []string `json:"project_status"`
	DealerNames   []string
}

type GetUserAddressData struct {
	UniqueId      string `json:"unique_id"`
	HomeOwner     string `json:"home_owner"`
	Address       string `json:"address"`
	Latitute      string `json:"latitute"`
	Longitude     string `json:"lognitude"`
	ProjectStatus string `json:"project_status"`
}

type GetUserAddressList struct {
	UserAddressList []GetUserAddressData `json:"user_address_list"`
}
