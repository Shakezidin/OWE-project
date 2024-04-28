/**************************************************************************
 *	Function	: getUsersDetailsApiModels.go
 *	DESCRIPTION : Files contains struct for get users detail models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetUsersData struct {
	Name              string `json:"name"`
	UserCode          string `json:"user_code"`
	EmailId           string `json:"email_id"`
	MobileNumber      string `json:"mobile_number"`
	Designation       string `json:"designation"`
	RoleName          string `json:"role_name"`
	PasswordChangeReq bool   `json:"password_change_required"`
	ReportingManager  string `json:"reporting_manager"`
	DealerOwner       string `json:"dealer_owner"`
	UserStatus        string `json:"user_status"`
	Description       string `json:"description"`
	StreetAddress     string `json:"street_address"`
	State             string `json:"state"`
	City              string `json:"city"`
	Zipcode           string `json:"zipcode"`
	Country           string `json:"country"`
}

type GetUsersDataList struct {
	UsersDataList []GetUsersData `json:"users_data_list"`
}
