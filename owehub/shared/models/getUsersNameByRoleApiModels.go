/**************************************************************************
 *	Function	: getUsersNamesByRoleApiModels.go
 *	DESCRIPTION : Files contains struct for get users detail models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetUsers struct {
	Role    string `json:"role"`
	Name    string `json:"name"`
	SubRole string `json:"sub_role"`
}

type GetUsersName struct {
	Name     string `json:"name"`
	UserCode string `json:"user_code"`
}

type GetUsersNameList struct {
	UsersNameList []GetUsersName `json:"users_name_list"`
}

type GetUserByDealer struct {
	DealerName string `json:"dealer_name"`
	Role       string `json:"role"`
}
