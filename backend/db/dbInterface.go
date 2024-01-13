/**************************************************************************
 *      File            : dbSupport.go
 *      DESCRIPTION     : This file contains common structures and functions
						  used for DB all over NRFGateway
 *      DATE            : 02-July-2023
 **************************************************************************/

package db

import (
	"fmt"
	"time"

	log "OWEApp/logger"
	CfgModels "OWEApp/models"
)

const (
	OWEDB string = "owe_db"
)

var (
	DBCtxMap *CfgModels.DBCtxMap
)

/******************************************************************************
 * FUNCTION:        InitializeDB
 *
 * DESCRIPTION:     This will initialize the DB Connection
 * INPUT:
 * RETURNS:    		err
 ******************************************************************************/
func SetupDBConnection(dbNames []string, dbCfg CfgModels.SvcConfig) (err error) {
	defer func() {
		log.ExitFn(0, "SetupDBConnection", err)
	}()
	log.EnterFn(0, "SetupDBConnection")

	/*
	 * It is possible that DB service is not initialized when NRFGW tries to connect to DB
	 * Retry 3 times with some sleep b/w each retry
	 */
	var retry int = 1
	for {
		DBCtxMap, err = InitializeDB(&dbCfg.DbConfInfo, dbNames)
		if (retry >= 3) || (err == nil) {
			break
		}
		retry++
		time.Sleep(2 * time.Second)
	}

	if err == nil {
		log.ConfDebugTrace(0, "DB connection Initialized sucessfully after retries = %v\n", retry)
	} else {
		log.ConfErrorTrace(0, "DB Connection initialization failed with err = %v retry = %v", err, retry)
	}

	return err
}

/******************************************************************************
 * FUNCTION:        getDBConnection
 *
 * DESCRIPTION:     This will return the connection of DB
 * INPUT:			dbName
 * RETURNS:    		err
 ******************************************************************************/
func getDBConnection(dbName string) (con CfgModels.DBHandleCxt, err error) {
	var ok bool
	defer func() {
		log.ExitFn(0, "getDBConnection", nil)
	}()
	log.EnterFn(0, "getDBConnection")

	if DBCtxMap != nil && DBCtxMap.DbConnMap != nil {
		con, ok = DBCtxMap.DbConnMap["tenant1"][dbName]
	}

	if ok {
		return con, nil
	} else {
		return con, fmt.Errorf("DB Connection Not Found")
	}
}
