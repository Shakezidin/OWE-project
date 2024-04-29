/**************************************************************************
 *	File            : types.go
 * 	DESCRIPTION     : This file contains common structures used across all packages in
 *							 service
 *	DATE            : 11-Jan-2024
 **************************************************************************/

package types

import (
	CfgModels "OWEApp/shared/models"
)

type UserRoles string

const (
	RoleAdmin           UserRoles = "Admin"
	RoleDealer          UserRoles = "Dealer"
	RoleRegionalManager UserRoles = "RegionalManager"
	RoleSalesManager    UserRoles = "SalesManager"
	RoleSalesRep        UserRoles = "SalesRep"
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
