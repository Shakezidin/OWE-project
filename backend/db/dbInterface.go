/**************************************************************************
 * File            : dbInterface.go
 * DESCRIPTION     : This file contains common structures and functions
 * DATE            : 15-Jan-2024
 **************************************************************************/

package db

import (
	log "OWEApp/logger"
	CfgModels "OWEApp/models"
	types "OWEApp/types"
	"time"

	"database/sql"
	"fmt"
)

var (
	dbHandleCxt CfgModels.DBHandleCxt
)

const (
	OWEDB        string = "owe_db"
	dbDriverName string = "postgres"
)

func InitDBConnection() (err error) {
	log.EnterFn(0, "InitDBConnection")
	defer func() { log.ExitFn(0, "InitDBConnection", err) }()

	dbConfig := types.CommGlbCfg.DbConfInfo

	openConnValue, _ := types.UtilsGetInt("DB_MAX_OPEN_CONN", 2000)
	idleConnValue, _ := types.UtilsGetInt("DB_MAX_IDLE_CONN", 100)

	connStr := fmt.Sprintf("postgres://%v:%v@%v/%v?sslmode=disable",
		dbConfig.Username, dbConfig.Password, dbConfig.HostName, OWEDB)

	log.FuncInfoTrace(0, "Connection String is %s", connStr)
	var retry int = 1
	for {
		err = InitializeDB(connStr)
		if (retry >= 3) || (err == nil) {
			break
		}
		retry++
		time.Sleep(2 * time.Second)
	}

	dbHandleCxt.CtxH.SetMaxOpenConns(openConnValue)
	dbHandleCxt.CtxH.SetMaxIdleConns(idleConnValue)
	err = dbHandleCxt.CtxH.Ping()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Ping the Database error = %v\n", err.Error())
		return err
	}

	log.FuncInfoTrace(0, "Database Initialized Sucessfully")
	return err
}

/******************************************************************************
 * FUNCTION:        InitializeDB
 * DESCRIPTION:     This will Initialize the db context
 * INPUT:			dbName,
 * RETURNS:    		err
 ******************************************************************************/
func InitializeDB(dbConnString string) (err error) {
	defer func() {
		log.ExitFn(0, "InitializeDB", nil)
	}()
	log.EnterFn(0, "InitializeDB")

	ctxH, err := sql.Open(dbDriverName, dbConnString)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to initialize Database error = %v", err.Error())
		return err
	}

	dbHandleCxt.CtxH = ctxH
	return err
}

/******************************************************************************
 * FUNCTION:        getDBConnection
 * DESCRIPTION:     This will return the connection of DB
 * INPUT:			dbName
 * RETURNS:    		err
 ******************************************************************************/
func getDBConnection(dbName string) (con *CfgModels.DBHandleCxt, err error) {
	defer func() {
		log.ExitFn(0, "getDBConnection", nil)
	}()
	log.EnterFn(0, "getDBConnection")

	return &dbHandleCxt, nil
}
