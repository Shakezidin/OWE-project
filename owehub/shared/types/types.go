/**************************************************************************
 *	File            : types.go
 * 	DESCRIPTION     : This file contains common structures used across all packages in
 *							 service
 *	DATE            : 11-Jan-2024
 **************************************************************************/

package types

import (
	CfgModels "OWEApp/shared/models"

	"github.com/dgrijalva/jwt-go"
)

type Claims struct {
	EmailId  string `json:"emailid"`
	RoleName string `json:"rolename"`
	jwt.StandardClaims
}

type UserGroup string
type UserRoles string

const (
	GroupAdmin               UserGroup = "GroupAdmin"
	GroupDealerFinance       UserGroup = "GroupDealerFinance"
	GroupSalesManagement     UserGroup = "GroupSalesManagement"
	GroupEveryOne            UserGroup = "GroupEveryOne"
	GroupDb                  UserGroup = "GroupDb"
	GroupAdminDealer         UserGroup = "GroupAdminDealer"
	GroupAdminAccounts       UserGroup = "GroupAdminAccounts"
	GroupAdminDealerAccounts UserGroup = "GroupAdminDealerAccounts"
)

var (
	// Map user role groups to user roles
	UserRoleGroupMap = map[UserGroup][]UserRoles{
		GroupAdmin: {
			RoleAdmin,
		},
		GroupDb: {
			RoleAdmin,
			RoleDbUser,
		},
		GroupAdminDealer: {
			RoleAdmin,
			RoleDealerOwner,
			RoleSubDealerOwner,
		},
		GroupDealerFinance: {
			RoleDealerOwner,
			RoleFinAdmin,
		},
		GroupSalesManagement: {
			RoleRegionalManager,
			RoleSalesManager,
			RoleSalesRep,
		}, GroupEveryOne: {
			RoleAdmin,
			RoleDealerOwner,
			RoleSubDealerOwner,
			RolePartner,
			RoleRegionalManager,
			RoleSalesManager,
			RoleSalesRep,
			RoleApptSetter,
			RoleFinAdmin,
			RoleDbUser,
			RoleAccountExecutive,
			RoleAccountManager,
		}, GroupAdminAccounts: {
			RoleAdmin,
			RoleAccountManager,
			RoleAccountExecutive,
		}, GroupAdminDealerAccounts: {
			RoleAdmin,
			RoleDealerOwner,
			RoleAccountManager,
			RoleAccountExecutive,
		},
	}
)

const (
	RoleAdmin            UserRoles = "Admin"
	RoleDealerOwner      UserRoles = "Dealer Owner"
	RoleSubDealerOwner   UserRoles = "SubDealer Owner"
	RolePartner          UserRoles = "Partner"
	RoleRegionalManager  UserRoles = "Regional Manager"
	RoleSalesManager     UserRoles = "Sales Manager"
	RoleSalesRep         UserRoles = "Sale Representative"
	RoleApptSetter       UserRoles = "Appointment Setter"
	RoleFinAdmin         UserRoles = "Finance Admin"
	RoleDbUser           UserRoles = "DB User"
	RoleAccountManager   UserRoles = "Account Manager"
	RoleAccountExecutive UserRoles = "Account Executive"
)

var (
	CommGlbCfg CfgModels.SvcConfig
	ExitChan   chan error
	JwtKey     = []byte("9B$Vw#pLX6aY)0~[<l4?NjT+-yS=%s?bP/3C{m1G*!KQ]nJ`u>E)Dh]l;1Rx6Y`#X=[<k^C~Y}R-*b~K_ym0K&N=JVtnzRf@9z=c%B>Xt`ya9Ug(Uj")
)

type Data interface {
}

type ApiResponse struct {
	Status     int    `json:"status"`
	Message    string `json:"message"`
	DbRecCount int64  `json:"dbRecCount"`
	Data       Data   `json:"data"`
}

type SSERespPayload struct {
	Data   map[string]interface{} `json:"data"`
	Error  map[string]interface{} `json:"error"`
	IsDone bool                   `json:"is_done"`
}
