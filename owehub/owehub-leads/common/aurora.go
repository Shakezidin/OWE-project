/**************************************************************************
 *	File            : aurora.go
 * 	DESCRIPTION     : This file contains common aurora config and helpers
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package common

type AuroraConfig struct {
	TenantId    string `json:"tenantId"`
	BearerToken string `json:"bearerToken"`
	ApiBaseUrl  string `json:"apiBaseUrl"`
}

var AuroraCfg AuroraConfig
