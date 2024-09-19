/**************************************************************************
 *	Function        : podioConfigs.go
 *  DESCRIPTION     : structure to contains the information about Podio
 *  DATE            : 5-May-2023
 **************************************************************************/

package models

type PodioConfInfo struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	ClientId     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}

type PodioConfigList struct {
	PodioConfigs []PodioConfInfo `json:"podioConfigs"`
}

type PodioAppConfig struct {
	AppName string `json:"app_name"`
  AppId string `json:"app_id"`
}
