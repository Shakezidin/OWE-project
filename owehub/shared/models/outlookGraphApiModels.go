/**************************************************************************
 *	Function        : outlookGraphApiConfigs.go
 *  DESCRIPTION     : structure to contains the information about Podio
 *  DATE            : 5-May-2023
 **************************************************************************/

package models

type GraphApiConfInfo struct {
	TenantId     string `json:"tenand_id"`
	ClientId     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}
