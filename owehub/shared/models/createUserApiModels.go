/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create user API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type TablePermission struct {
	TableName     string `json:"table_name"`
	PrivilegeType string `json:"privilege_type"`
}

type CreateUserReq struct {
	Name              string            `json:"name"`
	EmailId           string            `json:"email_id"`
	MobileNumber      string            `json:"mobile_number"`
	Password          string            `json:"password"`
	Designation       string            `json:"designation"`
	RoleName          string            `json:"role_name"`
	PasswordChangeReq bool              `json:"password_change_required"`
	ReportingManager  string            `json:"reporting_manager"`
	DealerOwner       string            `json:"dealer_owner"`
	UserStatus        string            `json:"user_status"`
	Description       string            `json:"description"`
	Region            string            `json:"region"`
	StreetAddress     string            `json:"street_address"`
	State             string            `json:"state"`
	City              string            `json:"city"`
	Zipcode           string            `json:"zipcode"`
	Country           string            `json:"country"`
	TeamName          string            `json:"team_name"`
	Dealer            string            `json:"dealer"`
	DealerLogo        string            `json:"dealer_logo"`
	TablesPermissions []TablePermission `json:"tables_permissions"`
	AddToPodio        bool              `json:"podio_checked"`
	ManagerRole       string            `json:"manager_role"`
}

type RecoverPasswordReq struct {
	UserEmails []string `json:"user_emails"` // List of user emails
}
