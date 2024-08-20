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
	UserName                 string `json:"user_name"`
	RoleName                 string `json:"role_name"`
	IsPasswordChangeRequired bool   `json:"is_password_change_required"`
	AccessToken              string `json:"access_token"`
	TimeToExpire             int    `json:"time_to_expire_minutes"`
	DealerName               string `json:"dealer_name"`
}
