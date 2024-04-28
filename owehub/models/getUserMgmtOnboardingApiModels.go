/**************************************************************************
 *	Function	: getUserMgmtOnboardingApiModels.go
 *	DESCRIPTION : Files contains struct for get user management onboarding models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetUsMgmtOnbData struct {
	RoleName  string `json:"role_name"`
	UserCount int64  `json:"user_count"`
}

type GetUsMgmtOnbList struct {
	UsrMgmtOnbList []GetUsMgmtOnbData `json:"usermgmt_onboarding_list"`
}
