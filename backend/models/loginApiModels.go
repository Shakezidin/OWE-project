/**************************************************************************
 *	Function	: loginApiModels.go
 *	DESCRIPTION : Files contains struct for login API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type Credentials struct {
	EmailId  string `json:"emailid"`
	Password string `json:"password"`
}

type LoginResp struct {
	EmailId                  string `json:"emailid"`
	RoleName                 string `json:"rolename"`
	IsPasswordChangeRequired bool   `json:"ispasswordchangerequired"`
	JwtToken                 string `json:"jwttoken"`
}
