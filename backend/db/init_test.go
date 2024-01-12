/**************************************************************************
 *      File        : test.go
 *      DESCRIPTION : This file contains UT for DB Initialization
 *      DATE        : 11-Jan-2024
 **************************************************************************/

package db

import (
	CfgModels "models"

	"testing"
)

func TestInitializeDB(t *testing.T) {
	var databases []string
	var err error

	databases = append(databases, db.SharedDB)
	var dbConfInfo CfgModels.DBCustersCfg

	dbConfInfo.DBClusterCfg = make([]CfgModels.ClustDetails, 1)
	dbConfInfo.DBClusterCfg[0].DbDetails.Username = "postgresDB"
	dbConfInfo.DBClusterCfg[0].DbDetails.Password = "postgresDB"
	dbConfInfo.DBClusterCfg[0].DbDetails.HostName = "172.20.0.211:5432"
	dbConfInfo.DBClusterCfg[0].OpId.ServiceID = "slice1"
	dbConfInfo.DBClusterCfg[0].OpId.TenantID = "enterprise1"

	_, err = InitializeDB(&dbConfInfo, databases)
	if err != nil {
		t.Fatalf("InitializeDB Failed error = %v\n", err)
	}
}
