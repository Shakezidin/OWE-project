/**************************************************************************
 *	Function	: dataUpdateNotification.go
 *	DESCRIPTION : Files contains struct for login API
 *	DATE        : 28-April-2024
 **************************************************************************/

package models

type DataUpdateNotification struct {
	UniqueID string `json:"uniqueId"`
    HookType string `json:"hookType"`
}
