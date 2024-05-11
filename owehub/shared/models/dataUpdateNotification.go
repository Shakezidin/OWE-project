/**************************************************************************
 *	Function	: dataUpdateNotification.go
 *	DESCRIPTION : Files contains struct for login API
 *	DATE        : 28-April-2024
 **************************************************************************/

package models

type DataUpdateNotification struct {
	UniqueIDs []string `json:"unique_ids"`
}
