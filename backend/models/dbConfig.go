/**************************************************************************
 *      Function        : dbConfig.go
 *      DESCRIPTION     : structure to contains the information about DB
 *      DATE            : 5-May-2023
 **************************************************************************/

package models

import (
	"database/sql"
)

type DbDetails struct {
	HostName string `json:"hostName"`
	Password string `json:"password"`
	Username string `json:"username"`
}

type DBClusterConfig struct {
	DbDetails DbDetails          `json:"DbDetails"`
	OpId      OperatorIdentifier `json:"opId"`
}

type DBCustersCfg struct {
	DBClusterCfg []DBClusterConfig `json:"DBClusterConfig"`
}

type DBHandleCxt struct {
	CtxH *sql.DB
}

type DBCtxMap struct {
	DbConnMap map[string]map[string]DBHandleCxt
}

type OperatorIdentifier struct {
	ServiceID string `json:"serviceID,omitempty"`
	TenantID  string `json:"tenantId,omitempty"`
}
