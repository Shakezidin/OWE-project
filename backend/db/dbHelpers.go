/**************************************************************************
 *      File            : dbFunctions.go
 *      DESCRIPTION     : This file contains DB wrapper functions like
						  insert, Delete, Update etc
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package db

import (
	"fmt"
	"strings"

	log "logger"
)

/*
*****************************************************************************
  - FUNCTION:        AddDataInDB
    *
  - DESCRIPTION:     This function will insert data in Database
  - INPUT:			 dbName
    tableName
    parameters map
  - RETURNS:    		err
    *****************************************************************************
*/
func AddDataInDB(dbName string, tableName string, data map[string]interface{}) (err error) {
	defer func() { log.ExitFn(0, "AddDataInDB", err) }()
	log.EnterFn(0, "AddDataInDB")

	log.FuncDebugTrace(0, "AddDataInDB in DB table: %v", tableName)

	con, err := getDBConnection(dbName)
	if err != nil {
		log.FuncErrorTrace(0, "AddDataInDB Failed to get %v Connection with err = %v", dbName, err)
		return err
	}

	var dataList []interface{}
	col := ""
	colIndex := ""
	itr := 1
	for key, value := range data {
		col += fmt.Sprintf("%v, ", key)
		colIndex += fmt.Sprintf("$%d, ", itr)

		switch values := value.(type) {
		case []uint8:
			valIns := fmt.Sprintf("%s", values)
			dataList = append(dataList, valIns)
		default:
			valIns := fmt.Sprintf("%v", values)
			dataList = append(dataList, valIns)
		}

		itr += 1
	}

	query := fmt.Sprintf("INSERT INTO %v (%v) VALUES(%v)",
		tableName, col[0:(len(col)-2)], colIndex[0:(len(colIndex)-2)])

	log.FuncDebugTrace(0, "query = %v ", query)

	stmtIns, err := con.CtxH.Prepare(query)
	if err == nil {
		_, err = stmtIns.Exec(dataList...)
		if stmtIns != nil {
			defer stmtIns.Close()
		}
	}

	if err != nil {
		log.FuncErrorTrace(0, "AddDataInDB Failed error = %v", err)
		return err
	}
	return err
}

/*
*****************************************************************************
  - FUNCTION:        ReteriveData
    *
  - DESCRIPTION:     This function will fetch data from Database
  - INPUT:			 dbName
    tableName
    selectParams map
    whereParams map
  - RETURNS:    		outData, err
    *****************************************************************************
*/
func ReteriveData(dbName string, tableName string, selectParams []string,
	whereParams map[string]interface{}) (outData []map[string]interface{}, err error) {

	defer func() { log.ExitFn(0, "ReteriveData", err) }()
	log.EnterFn(0, "ReteriveData")

	log.FuncDebugTrace(0, "ReteriveData tableName %v selectParams %+v whereParams %+v",
		tableName, selectParams, whereParams)

	con, err := getDBConnection(dbName)
	if err != nil {
		log.FuncErrorTrace(0, "ReteriveData Failed to get %v Connection with err = %v", dbName, err)
		return nil, err
	}

	selectQuery := "* "
	if selectParams != nil {
		selectQuery = strings.Join(selectParams, ",")
	}

	whereQuery := ""
	var whereEleList []interface{}
	itr := 1
	for key, value := range whereParams {
		whereQuery += fmt.Sprintf("%v = $%d AND ", key, itr)

		valIns := fmt.Sprintf("%v", value)
		whereEleList = append(whereEleList, valIns)

		itr += 1
	}

	var query string
	if len(whereQuery) == 0 {
		query = fmt.Sprintf("SELECT %v FROM %v", selectQuery, tableName)
	} else {
		query = fmt.Sprintf("SELECT %v FROM %v WHERE %v", selectQuery, tableName,
			whereQuery[0:(len(whereQuery)-4)])
	}

	log.FuncDebugTrace(0, "ReteriveData Query %v whereParams %+v", query, whereEleList)
	rows, err := con.CtxH.Query(query, whereEleList...)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to ReteriveData from table %v error = %v", tableName, err)
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

/*
*****************************************************************************
  - FUNCTION:        UpdateDBData
    *
  - DESCRIPTION:     This function will update the data in DB
  - INPUT:           dbName
    tableName
    updateParams map
    whereParams map
  - RETURNS:            outData, err
    *****************************************************************************
*/
func UpdateDBData(dbName string, tableName string, updateParams map[string]interface{},
	whereParams map[string]interface{}) (err error) {

	defer func() { log.ExitFn(0, "UpdateDBData", err) }()
	log.EnterFn(0, "UpdateDBData")

	log.FuncDebugTrace(0, "UpdateDBData tableName %v updateParams %+v whereParams %+v",
		tableName, updateParams, whereParams)

	con, err := getDBConnection(dbName)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDBData Failed to get %v Connection with err = %v", dbName, err)
		return err
	}

	if (len(updateParams) == 0) || (len(whereParams) == 0) {
		log.FuncDebugTrace(0, "UpdateDBData failed, invalid parameters received update/where")
		return fmt.Errorf("Invalid parameters recveived in UpdateDBData")
	}

	whereQuery := ""
	var eleList []interface{}
	itr := 1
	for key, value := range whereParams {
		whereQuery += fmt.Sprintf("%v = $%d AND ", key, itr)

		valIns := fmt.Sprintf("%v", value)
		eleList = append(eleList, valIns)

		itr += 1
	}

	setQuery := ""
	for key, value := range updateParams {
		setQuery += fmt.Sprintf("%v = $%d, ", key, itr)

		valIns := fmt.Sprintf("%v", value)
		eleList = append(eleList, valIns)

		itr += 1
	}

	query := fmt.Sprintf("UPDATE %v SET %v WHERE %v", tableName, setQuery[0:(len(setQuery)-2)], whereQuery[0:(len(whereQuery)-4)])
	log.FuncDebugTrace(0, "UpdateDBData Query %v setParams + whereParams = %+v", query, eleList)

	stmtIns, err := con.CtxH.Prepare(query)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDBData Prepare Failed with error = %v", err)
		return err
	}

	res, err := stmtIns.Exec(eleList...)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDBData Exec Failed with error = %v", err)
		return err
	}

	if stmtIns != nil {
		defer stmtIns.Close()
	}

	rows, err := res.RowsAffected()
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDBData Failed to get the RowsAffected error = %v", err)
	} else {
		log.FuncDebugTrace(0, "UpdateDBData Update the rows = %v in table = %v", rows, tableName)
	}

	return nil
}

/*
*****************************************************************************
  - FUNCTION:        ReteriveDataWithWhereQuery
    *
  - DESCRIPTION:     This function will fetch data from Database with where
    query string
  - INPUT:			 dbName
    tableName
    selectParams map
    where query
  - RETURNS:    		outData, err
    *****************************************************************************
*/
func ReteriveDataWithWhereQuery(dbName string, tableName string, selectParams []string,
	whereQuery string) (outData []map[string]interface{}, err error) {

	defer func() { log.ExitFn(0, "ReteriveDataWithWhereQuery", err) }()
	log.EnterFn(0, "ReteriveDataWithWhereQuery")

	log.FuncDebugTrace(0, "ReteriveDataWithWhereQuery tableName %v selectParams %+v whereQuery %+v",
		tableName, selectParams, whereQuery)

	con, err := getDBConnection(dbName)
	if err != nil {
		log.FuncErrorTrace(0, "ReteriveDataWithWhereQuery Failed to get %v Connection with err = %v", dbName, err)
		return nil, err
	}

	selectQuery := "* "
	if selectParams != nil {
		selectQuery = strings.Join(selectParams, ",")
	}

	var query string
	if len(whereQuery) == 0 {
		query = fmt.Sprintf("SELECT %v FROM %v", selectQuery, tableName)
	} else {
		query = fmt.Sprintf("SELECT %v FROM %v WHERE %v", selectQuery, tableName, whereQuery)
	}

	log.FuncDebugTrace(0, "ReteriveDataWithWhereQuery Query %v whereQuery %+v", query, whereQuery)
	rows, err := con.CtxH.Query(query)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to ReteriveData from table %v error = %v", tableName, err)
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

/*
*****************************************************************************
  - FUNCTION:        RemoveData
    *
  - DESCRIPTION:     This function will remove data from Database
  - INPUT:			 dbName
    tableName
    whereParams map
  - RETURNS:    		err
    *****************************************************************************
*/
func RemoveData(dbName string, tableName string, whereParams map[string]interface{}) (err error) {

	defer func() { log.ExitFn(0, "RemoveData", err) }()
	log.EnterFn(0, "RemoveData")

	log.FuncDebugTrace(0, "RemoveData tableName %v whereParams %+v", tableName, whereParams)

	con, err := getDBConnection(dbName)
	if err != nil {
		log.FuncErrorTrace(0, "RemoveData Failed to get %v Connection with err = %v", dbName, err)
		return err
	}

	whereQuery := ""
	var whereEleList []interface{}
	itr := 1
	for key, value := range whereParams {
		whereQuery += fmt.Sprintf("%v = $%d AND ", key, itr)

		valIns := fmt.Sprintf("%v", value)
		whereEleList = append(whereEleList, valIns)

		itr += 1
	}

	var query string
	if len(whereQuery) == 0 {
		query = fmt.Sprintf("DELETE FROM %v", tableName)
	} else {
		query = fmt.Sprintf("DELETE FROM %v WHERE %v", tableName, whereQuery[0:(len(whereQuery)-4)])
	}

	log.FuncDebugTrace(0, "RemoveData Query %v whereParams %+v", query, whereEleList)

	stmtIns, err := con.CtxH.Prepare(query)
	if err != nil {
		log.FuncErrorTrace(0, "RemoveData Prepare Failed with error = %v", err)
		return err
	}

	res, err := stmtIns.Exec(whereEleList...)
	if err != nil {
		log.FuncErrorTrace(0, "RemoveData Exec Failed with error = %v", err)
		return err
	}

	if stmtIns != nil {
		defer stmtIns.Close()
	}

	rows, err := res.RowsAffected()
	if err != nil {
		log.FuncErrorTrace(0, "RemoveData Failed to get the RowsAffected error = %v", err)
	} else {
		log.FuncDebugTrace(0, "RemoveData removed the rows = %v in table = %v", rows, tableName)
	}

	return nil
}

/*
*****************************************************************************
  - FUNCTION:        RemoveDataWithWhereQuery
    *
  - DESCRIPTION:     This function will remove data from Database
  - INPUT:			 dbName
    tableName
    whereParams query
  - RETURNS:    		err
    *****************************************************************************
*/
func RemoveDataWithWhereQuery(dbName string, tableName string, whereQuery string) (err error) {

	defer func() { log.ExitFn(0, "RemoveDataWithWhereQuery", err) }()
	log.EnterFn(0, "RemoveDataWithWhereQuery")

	log.FuncDebugTrace(0, "RemoveDataWithWhereQuery tableName %v whereQuery %s", tableName, whereQuery)

	con, err := getDBConnection(dbName)
	if err != nil {
		log.FuncErrorTrace(0, "RemoveDataWithWhereQuery Failed to get %v Connection with err = %v", dbName, err)
		return err
	}

	var query string
	if len(whereQuery) == 0 {
		query = fmt.Sprintf("DELETE FROM %v", tableName)
	} else {
		query = fmt.Sprintf("DELETE FROM %v WHERE %v", tableName, whereQuery)
	}

	res, err := con.CtxH.Exec(query)
	if err != nil {
		log.FuncErrorTrace(0, "RemoveDataWithWhereQuery Exec Failed with error = %v", err)
		return err
	}

	rows, err := res.RowsAffected()
	if err != nil {
		log.FuncErrorTrace(0, "RemoveDataWithWhereQuery Failed to get the RowsAffected error = %v", err)
	} else {
		log.FuncDebugTrace(0, "RemoveDataWithWhereQuery removed the rows = %v in table = %v", rows, tableName)
	}

	return nil
}

/*
*****************************************************************************
  - FUNCTION:       AlterTTLValueDbTable
  - DESCRIPTION:    This function will remove data from Database
  - INPUT:			dbName, tableName, ttlValue
  - RETURNS:		err

*****************************************************************************
*/
func AlterTTLValueDbTable(dbName string, tableName string, ttlValue int32) (err error) {
	var (
		query string
	)

	defer func() { log.ExitFn(0, "AlterTTLValueDbTable", err) }()
	log.EnterFn(0, "AlterTTLValueDbTable")

	log.FuncDebugTrace(0, "AlterTTLValueDbTable tableName %v ttlValue %v", tableName, ttlValue)

	con, err := getDBConnection(dbName)
	if err != nil {
		log.FuncErrorTrace(0, "AlterTTLValueDbTable Failed to get %v Connection with err = %v", dbName, err)
		return err
	}

	query = fmt.Sprintf("ALTER TABLE %v SET (ttl = INTERVAL '%v days')", tableName, ttlValue)
	log.FuncDebugTrace(0, "Alter Query is %v", query)

	_, err = con.CtxH.Exec(query)
	if err != nil {
		log.FuncErrorTrace(0, "AlterTTLValueDbTable Exec Failed with error = %v", err)
		return err
	}

	return err
}
