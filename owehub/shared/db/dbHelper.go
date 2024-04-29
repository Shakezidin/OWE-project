/**************************************************************************
 * File            : dbFunctions.go
 * DESCRIPTION     : This file contains DB wrapper functions like
						  insert, Delete, Update etc
 * DATE            : 02-July-2023
 **************************************************************************/

package db

import (
	log "OWEApp/shared/logger"
	"database/sql"
	"reflect"

	"fmt"
	"strings"

	_ "github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:        ReteriveFromDB
 * DESCRIPTION:     This function will reterive data from DB
 * INPUT:			query, whereEleList
 * RETURNS:    		outData, err
 ******************************************************************************/
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

/******************************************************************************
 * FUNCTION:        UpdateDataInDB
 * DESCRIPTION:     This function will update data in DB
 * INPUT:			query, whereEleList
 * RETURNS:    		err
 ******************************************************************************/
func UpdateDataInDB(query string, whereEleList []interface{}) (err error, rows int64) {

	log.EnterFn(0, "UpdateDataInDB")
	defer func() { log.ExitFn(0, "UpdateDataInDB", err) }()

	log.FuncDebugTrace(0, "UpdateDataInDB Query %v whereParams %+v", query, whereEleList)
	rows = 0
	con, err := getDBConnection(OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Failed to get %v Connection with err = %v", OWEDB, err)
		return err, rows
	}

	stmtIns, err := con.CtxH.Prepare(query)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Prepare Failed with error = %v", err)
		return err, rows
	}

	res, err := stmtIns.Exec(whereEleList...)
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Exec Failed with error = %v", err)
		return err, rows
	}

	if stmtIns != nil {
		defer stmtIns.Close()
	}

	rows, err = res.RowsAffected()
	if err != nil {
		log.FuncErrorTrace(0, "UpdateDataInDB Failed to get the RowsAffected error = %v", err)
	} else {
		log.FuncDebugTrace(0, "UpdateDataInDB Update the rows = %v", rows)
	}

	return err, rows
}

/******************************************************************************
 * FUNCTION:        CallDBFunction
 * DESCRIPTION:     This function will Call the function in DB
 * INPUT:			query, parameters
 * RETURNS:    		err
 ******************************************************************************/
func CallDBFunction(functionName string, parameters []interface{}) (outData []interface{}, err error) {

	log.EnterFn(0, "CallDBFunction")
	defer func() { log.ExitFn(0, "CallDBFunction", err) }()

	log.FuncDebugTrace(0, "CallDBFunction functionName: %v parameters: %+v", functionName, parameters)

	con, err := getDBConnection(OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "CallDBFunction Failed to get %v Connection with err = %v", OWEDB, err)
		return nil, err
	}

	var args []string
	for i := range parameters {
		args = append(args, fmt.Sprintf("$%d", i+1))
	}

	query := fmt.Sprintf("SELECT %s(%s) AS result", functionName, strings.Join(args, ", "))
	log.FuncDebugTrace(0, "CallDBFunction query: %v parameters: %+v", query, parameters)

	rows, err := con.CtxH.Query(query, parameters...)
	if err != nil {
		log.FuncErrorTrace(0, "CallDBFunction Query Failed with error = %v", err)
		return nil, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		log.FuncErrorTrace(0, "CallDBFunction No columns found error = %v", err)
		return nil, err
	}

	types, err := rows.ColumnTypes()
	if err != nil {
		log.FuncErrorTrace(0, "CallDBFunction failed to get Column Type error = %v", err)
		return nil, err
	}

	resultSlice := make([]interface{}, len(columns))
	for i := range resultSlice {
		resultSlice[i] = new(interface{})
	}

	for rows.Next() {
		err := rows.Scan(resultSlice...)
		if err != nil {
			log.FuncErrorTrace(0, "CallDBFunction failed to get row data error = %v", err)
			return nil, err
		}

		rowData := make(map[string]interface{})

		for i, value := range resultSlice {
			columnName := columns[i]
			columnType := types[i]

			convertedValue, err := convertToType(*value.(*interface{}), columnType)
			if err != nil {
				log.FuncErrorTrace(0, "CallDBFunction failed convert data columnType: %v error: %v", columnType, err)
				return nil, err
			}

			rowData[columnName] = convertedValue
		}

		outData = append(outData, rowData)
	}
	return outData, nil
}

/******************************************************************************
 * FUNCTION:        convertToType
 * DESCRIPTION:     This function will convert value data type
 * INPUT:			value, columnType
 * RETURNS:    		outData, err
 ******************************************************************************/
func convertToType(value interface{}, columnType *sql.ColumnType) (interface{}, error) {
	switch columnType.ScanType().Kind() {
	case reflect.Int, reflect.Int64, reflect.Int32, reflect.Int8:
		return value.(int64), nil
	case reflect.Float64:
		return value.(float64), nil
	case reflect.String:
		return value.(string), nil
	// Add more cases for other types as needed
	default:
		return nil, fmt.Errorf("unsupported column type: %v", columnType.ScanType().Kind())
	}
}
