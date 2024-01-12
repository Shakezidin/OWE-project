/**************************************************************************
 *      Function        : dbConfig.go
 *      DESCRIPTION     : structure to contains the information about DB
 *      DATE            : 5-May-2023
 **************************************************************************/

package ConfigModels

import (
	"database/sql"
)

type DatabaseCfg struct {
	HostName string `json:"hostName"`
	Password string `json:"password"`
	Username string `json:"username"`
}

type DBHandleCxt struct {
	CtxH *sql.DB
}

type DBCtxMap struct {
	DbConnMap map[string]map[string]DBHandleCxt
}
