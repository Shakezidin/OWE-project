/**************************************************************************
 *	Function	: getUsersDetailsApiModels.go
 *	DESCRIPTION : Files contains struct for get users detail models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetTablePermission struct {
	TableName     string `json:"table_name"`
	PrivilegeType string `json:"privilege_type"`
}

type GetUsersData struct {
	RecordId          int64                `json:"record_id"`
	Name              string               `json:"name"`
	UserCode          string               `json:"user_code"`
	EmailId           string               `json:"email_id"`
	MobileNumber      string               `json:"mobile_number"`
	Designation       string               `json:"designation"`
	RoleName          string               `json:"role_name"`
	PasswordChangeReq bool                 `json:"password_change_required"`
	ReportingManager  string               `json:"reporting_manager"`
	DealerOwner       string               `json:"dealer_owner"`
	UserStatus        string               `json:"user_status"`
	Description       string               `json:"description"`
	Region            string               `json:"region"`
	StreetAddress     string               `json:"street_address"`
	State             string               `json:"state"`
	City              string               `json:"city"`
	Zipcode           string               `json:"zipcode"`
	Country           string               `json:"country"`
	Dealer            string               `json:"dealer"`
	DealerLogo        string               `json:"dealer_logo"`
	BgColour          string               `json:"bg_colour"`
	PreferredName     string               `json:"preferred_name"`
	DealerCode        string               `json:"dealer_code"`
	DBUsername        string               `json:"db_username"`
	TablePermission   []GetTablePermission `json:"table_permission"`
	AssignManagerRole string               `json:"assign_manager_role"`
}

type GetUsersDataList struct {
	UsersDataList []GetUsersData `json:"users_data_list"`
}
