/**************************************************************************
 * File            : dbFunctions.go
 * DESCRIPTION     : This file contains DB wrapper functions like
						  insert, Delete, Update etc
 * DATE            : 02-July-2023
 **************************************************************************/

package db

import (
	log "OWEApp/logger"

	_ "github.com/lib/pq"
)

func ReteriveFromDB(query string,
	whereEleList []interface{}) (outData []map[string]interface{}, err error) {

	log.EnterFn(0, "ReteriveFromDB")
	defer func() { log.ExitFn(0, "ReteriveFromDB", err) }()

	log.FuncDebugTrace(0, "ReteriveData Query %v whereParams %+v", query, whereEleList)

	con, err := getDBConnection(OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "ReteriveFromDB Failed to get %v Connection with err = %v", OWEDB, err)
		return nil, err
	}

	rows, err := con.CtxH.Query(query, whereEleList...)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to ReteriveData from query %v error = %v", query, err)
		return nil, err
	}

	cols, cErr := rows.Columns()
	if cErr != nil {
		log.FuncErrorTrace(0, "Failed to get column data error = %v", err)
		return nil, cErr
	}

	for rows.Next() {
		colms := make([]interface{}, len(cols))
		cRef := make([]interface{}, len(cols))
		for i := range colms {
			cRef[i] = &colms[i]
		}

		if cErr = rows.Scan(cRef...); cErr != nil {
			return nil, cErr
		}

		m := make(map[string]interface{})
		for i, colName := range cols {

			val := cRef[i].(*interface{})
			m[colName] = *val
		}

		outData = append(outData, m)
	}

	return outData, err
}

func UpdateDataInDB(query string, whereEleList []interface{}) (err error) {

	log.EnterFn(0, "UpdateDataInDB")
	defer func() { log.ExitFn(0, "UpdateDataInDB", err) }()

	log.FuncDebugTrace(0, "UpdateDataInDB Query %v whereParams %+v", query, whereEleList)

	con, err := getDBConnection(OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Failed to get %v Connection with err = %v", OWEDB, err)
		return err
	}

	stmtIns, err := con.CtxH.Prepare(query)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Prepare Failed with error = %v", err)
		return err
	}

	res, err := stmtIns.Exec(whereEleList...)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Exec Failed with error = %v", err)
		return err
	}

	if stmtIns != nil {
		defer stmtIns.Close()
	}

	rows, err := res.RowsAffected()
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Failed to get the RowsAffected error = %v", err)
	} else {
		log.FuncDebugTrace(0, "UpdateDataInDB Update the rows = %v", rows)
	}

	return err
}
