/**************************************************************************
 *	Function	: loginApiModels.go
 *	DESCRIPTION : Files contains struct for login API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type Credentials struct {
	EmailId  string `json:"email_id"`
	Password string `json:"password"`
}

type LoginResp struct {
	EmailId                  string `json:"email_id"`
	RoleName                 string `json:"role_name"`
	IsPasswordChangeRequired bool   `json:"is_password_change_required"`
	AccessToken              string `json:"access_token"`
}
