/**************************************************************************
 *	Function	: getUsersDetailsApiModels.go
 *	DESCRIPTION : Files contains struct for get users detail models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetUsersData struct {
	Name              string `json:"name"`
	EmailID           string `json:"email_id"`
	MobileNumber      string `json:"mobile_number"`
	Designation       string `json:"user_designation"`
	RoleName          string `json:"role_name"`
	UserCode          string `json:"user_code"`
	PasswordChangeReq bool   `json:"password_change_required"`
	ReportingManager  string `json:"reporting_manager"`
	UserStatus        string `json:"user_status"`
	Description       string `json:"description"`
}

type GetUsersDataList struct {
	UsersDataList []GetUsersData `json:"users_data_list"`
}
