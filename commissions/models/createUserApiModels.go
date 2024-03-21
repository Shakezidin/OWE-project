/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create user API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateUserReq struct {
	Name             string `json:"name"`
	EmailId           string `json:"email_id"`
	MobileNumber      string `json:"mobile_number"`
	Password          string `json:"password"`
	Designation       string `json:"designation"`
	RoleName          string `json:"role_name"`
	UserCode          string `json:"user_code"`
	PasswordChangeReq bool   `json:"password_change_required"`
	ReportingManager  string `json:"reporting_manager"`
	UserStatus        string `json:"user_status"`
	Description       string `json:"description"`
}
