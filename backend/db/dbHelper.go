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

	defer func() { log.ExitFn(0, "ReteriveFromDB", err) }()
	log.EnterFn(0, "ReteriveFromDB")

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
