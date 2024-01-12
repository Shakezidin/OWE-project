/**************************************************************************
 *      File    	: init.go
 *      DESCRIPTION : This file contains DB initialize functions
 *      DATE        : 11-Jan-2024
 **************************************************************************/

package db

import (
	log "logger"
	CfgModels "models"

	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const (
	DbName string = "postgres"
)

/*
*****************************************************************************
  - FUNCTION:        InitializeDB
    *
  - DESCRIPTION:     function to initalize the DB Connections
  - INPUT:			DBCustersCfg
    database list
  - RETURNS: 		DBCtxMap
    error
    *****************************************************************************
*/
func InitializeDB(dbCfg *CfgModels.DBCustersCfg, dbNames []string) (DbConnCtx *CfgModels.DBCtxMap, err error) {
	log.EnterFn(0, "InitializeDB")
	defer func() { log.ExitFn(0, "InitializeDB", err) }()

	openConnValue, _ := types.UtilsGetInt("DB_MAX_OPEN_CONN", 2000)
	idleConnValue, _ := types.UtilsGetInt("DB_MAX_IDLE_CONN", 100)

	DbConnCtx = &CfgModels.DBCtxMap{}
	DbConnCtx.DbConnMap = make(map[string]map[string]CfgModels.DBHandleCxt)
	for _, cluster := range dbCfg.DBClusterCfg {
		tenantDBMap := make(map[string]CfgModels.DBHandleCxt)
		for _, db := range dbNames {
			connStr := fmt.Sprintf("postgres://%v:%v@%v/%v?sslmode=disable",
				cluster.DbDetails.Username, cluster.DbDetails.Password, cluster.DbDetails.HostName,
				db)

			log.FuncInfoTrace(0, "Connection String is %s", connStr)
			dbWrapH := CfgModels.DBHandleCxt{}
			ctxH, err := sql.Open(DbName, connStr)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to initialize Database error = %v", err.Error())
				return nil, err
			}

			dbWrapH.CtxH = ctxH
			tenantDBMap[db] = dbWrapH

			dbWrapH.CtxH.SetMaxOpenConns(openConnValue)
			dbWrapH.CtxH.SetMaxIdleConns(idleConnValue)
			err = dbWrapH.CtxH.Ping()
			if err != nil {
				log.FuncErrorTrace(0, "Failed to Ping the Database error = %v\n", err.Error())
				return nil, err
			}
		}
		DbConnCtx.DbConnMap[cluster.OpId.TenantID] = tenantDBMap
	}

	log.FuncInfoTrace(0, "Database Initialized Sucessfully")
	return DbConnCtx, nil
}
