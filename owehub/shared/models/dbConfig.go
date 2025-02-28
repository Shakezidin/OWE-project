/**************************************************************************
 *	Function        : dbConfig.go
 *  DESCRIPTION     : structure to contains the information about DB
 *  DATE            : 5-May-2023
 **************************************************************************/

package models

import (
	"database/sql"
)

type DbConfInfo struct {
	HostName string `json:"hostName"`
	Password string `json:"password"`
	Username string `json:"username"`
	DBName   string `json:"dbName"`
}

type DBConfigList struct {
	DBConfigs []DbConfInfo `json:"dbConfigs"`
}

type DBHandleCxt struct {
	CtxH *sql.DB
}
