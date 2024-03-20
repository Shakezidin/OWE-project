/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create user API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateUserReq struct {
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	EmailId      string `json:"email_id"`
	MobileNumber string `json:"mobile_number"`
	Password     string `json:"password"`
	Designation  string `json:"designation"`
	RoleName     string `json:"role_name"`
}
