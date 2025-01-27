/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create user API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateUserReq struct {
	Name                  string            `json:"name"`
	EmailId               string            `json:"email_id"`
	MobileNumber          string            `json:"mobile_number"`
	PasswordChangeReq     bool              `json:"password_change_required"`
	ReportingManager      string            `json:"reporting_manager"`
	DealerOwner           string            `json:"dealer_owner"`
	RoleName              string            `json:"role_name"`
	UserStatus            string            `json:"user_status"`
	Designation           string            `json:"designation"`
	Description           string            `json:"description"`
	Region                string            `json:"region"`
	StreetAddress         string            `json:"street_address"`
	State                 string            `json:"state"`
	City                  string            `json:"city"`
	Zipcode               string            `json:"zipcode"`
	Country               string            `json:"country"`
	UserCode              string            `json:"user_code"`
	Dealer                string            `json:"dealer"`
	DealerLogo            string            `json:"dealer_logo"`
	TablesPermissions     []TablePermission `json:"tables_permissions"`
	TeamName              string            `json:"team_name"`
	RevokeTablePermission []TablePermission `json:"revoke_table_permission"`
	ManagerRole           string            `json:"manager_role"`
}

type DeleteUsers struct {
	UserCodes       []string `json:"user_codes"`
	Usernames       []string `json:"usernames"`
	EmailIds        []string `json:"email_id"`
	DeleteFromPodio bool     `json:"podio_checked"`
}
