/**************************************************************************
 *	Function	: getUserMgmtOnboardingApiModels.go
 *	DESCRIPTION : Files contains struct for get user management onboarding models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetUsMgmtOnbData struct {
	Record_Id int64  `json:"record_id"`
	RoleName  string `json:"role_name"`
	UserCount int64  `json:"user_count"`
}

type GetUsMgmtOnbList struct {
	UsrMgmtOnbList  []GetUsMgmtOnbData `json:"usermgmt_onboarding_list"`
	ActiveSaleRep   int64              `json:"active_sale_rep"`
	InactiveSaleRep int64              `json:"inactive_sale_rep"`
	Users           []string           `json:"string"`
}

type GetUserMngmnt struct {
	Usertype string `json:"user_type"`
}
