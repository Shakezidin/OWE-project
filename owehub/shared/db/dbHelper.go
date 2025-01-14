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
	"time"

	"fmt"
	"strings"

	"github.com/jackc/pgtype"
	_ "github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:        AddSingleRecordInDB
 * DESCRIPTION:     This function will insert single records in DB
 * INPUT:			dbName, tableName, parameters map
 * RETURNS:    		err
 ******************************************************************************/
func AddSingleRecordInDB(dbIdx uint8, tableName string, data map[string]interface{}) (err error) {
	defer func() { log.ExitFn(0, "AddSingleRecordInDB", err) }()
	log.EnterFn(0, "AddSingleRecordInDB")

	log.FuncDebugTrace(0, "Inserting in DB table: %v", tableName)

	con, err := getDBConnection(dbIdx, OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get %v Connection with err = %v", OWEDB, err)
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
		case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64:
			dataList = append(dataList, values)
		case float32:
			dataList = append(dataList, float64(values))
		case float64:
			dataList = append(dataList, values)
		case string:
			dataList = append(dataList, values)
		case bool:
			dataList = append(dataList, values)
		case time.Time:
			if values.IsZero() {
				dataList = append(dataList, nil) // Insert NULL for empty timestamp
			} else {
				dataList = append(dataList, values)
			}
		default:
			dataList = append(dataList, fmt.Sprintf("%v", values))
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
		log.FuncErrorTrace(0, "Insert in DB Failed error = %v", err)
		return err
	}
	return err
}

/******************************************************************************
 * FUNCTION:        AddMultipleRecordInDB
 * DESCRIPTION:     This function will insert multiple records in DB
 * INPUT:			tableName, data
 * RETURNS:    		err
 ******************************************************************************/
func AddMultipleRecordInDB(dbIdx uint8, tableName string, data []map[string]interface{}) (err error) {
	defer func() { log.ExitFn(0, "AddMultipleRecordInDB", err) }()
	log.EnterFn(0, "AddMultipleRecordInDB")

	if len(data) == 0 {
		err = fmt.Errorf("Empty data received")
		log.FuncErrorTrace(0, "%+v", err)
		return err
	}

	log.FuncDebugTrace(0, "Inserting in DB table: %v", tableName)

	con, err := getDBConnection(dbIdx, OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get %v Connection with err = %v", OWEDB, err)
		return err
	}

	keys := make([]string, 0, len(data[0]))
	for key := range data[0] {
		keys = append(keys, key)
	}
	col := strings.Join(keys, ", ")

	var dataList []interface{}
	var placeholders []string

	for _, record := range data {
		var recordPlaceholders []string
		for _, key := range keys {
			recordPlaceholders = append(recordPlaceholders, fmt.Sprintf("$%d", len(dataList)+1))
			value := record[key]

			switch v := value.(type) {
			case []uint8:
				dataList = append(dataList, string(v))
			case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64, float32, float64, string, bool:
				dataList = append(dataList, v)
			case time.Time:
				if v.IsZero() {
					dataList = append(dataList, nil)
				} else {
					dataList = append(dataList, v)
				}
			case nil:
				dataList = append(dataList, nil)
			default:
				dataList = append(dataList, fmt.Sprintf("%v", v))
			}
		}
		placeholders = append(placeholders, fmt.Sprintf("(%s)", strings.Join(recordPlaceholders, ", ")))
	}

	query := fmt.Sprintf("INSERT INTO %v (%v) VALUES %v", tableName, col, strings.Join(placeholders, ", "))

	//log.FuncDebugTrace(0, "query = %v dataList = %v", query, dataList)

	stmtIns, err := con.CtxH.Prepare(query)
	if err != nil {
		log.FuncErrorTrace(0, "Prepare statement failed: %v", err)
		return err
	}
	defer stmtIns.Close()

	_, err = stmtIns.Exec(dataList...)
	if err != nil {
		log.FuncErrorTrace(0, "Insert in DB Failed error = %v", err)
		return err
	}

	return nil
}

/******************************************************************************
 * FUNCTION:        ReteriveFromDB
 * DESCRIPTION:     This function will reterive data from DB
 * INPUT:			query, whereEleList
 * RETURNS:    		outData, err
 ******************************************************************************/
func ReteriveFromDB(dbIdx uint8, query string,
	whereEleList []interface{}) (outData []map[string]interface{}, err error) {

	log.EnterFn(0, "ReteriveFromDB")
	defer func() { log.ExitFn(0, "ReteriveFromDB", err) }()

	log.FuncDebugTrace(0, "ReteriveData Query %v whereParams %+v", query, whereEleList)

	con, err := getDBConnection(dbIdx, OWEDB)
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
 * FUNCTION:        ExecQueryDB
 * DESCRIPTION:     This function will exec data from DB
 * INPUT:			query, whereEleList
 * RETURNS:    		outData, err
 ******************************************************************************/
func ExecQueryDB(dbIdx uint8, query string) (err error) {

	log.EnterFn(0, "ReteriveFromDB")
	defer func() { log.ExitFn(0, "ReteriveFromDB", err) }()

	log.FuncDebugTrace(0, "ReteriveData Query %v whereParams", query)

	con, err := getDBConnection(dbIdx, OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "ReteriveFromDB Failed to get %v Connection with err = %v", OWEDB, err)
		return err
	}

	_, err = con.CtxH.Exec(query)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to ReteriveData from query %v error = %v", query, err)
		return err
	}
	return err
}

/******************************************************************************
 * FUNCTION:        UpdateDataInDB
 * DESCRIPTION:     This function will update data in DB
 * INPUT:			query, whereEleList
 * RETURNS:    		err
 ******************************************************************************/
func UpdateDataInDB(dbIdx uint8, query string, whereEleList []interface{}) (err error, rows int64) {

	log.EnterFn(0, "UpdateDataInDB")
	defer func() { log.ExitFn(0, "UpdateDataInDB", err) }()

	log.FuncDebugTrace(0, "UpdateDataInDB Query %v whereParams %+v", query, whereEleList)
	rows = 0
	con, err := getDBConnection(dbIdx, OWEDB)
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
func CallDBFunction(dbIdx uint8, functionName string, parameters []interface{}) (outData []interface{}, err error) {

	log.EnterFn(0, "CallDBFunction")
	defer func() { log.ExitFn(0, "CallDBFunction", err) }()

	log.FuncDebugTrace(0, "CallDBFunction functionName: %v parameters: %+v", functionName, parameters)

	con, err := getDBConnection(dbIdx, OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "CallDBFunction Failed to get %v Connection with err = %v", OWEDB, err)
		return nil, err
	}

	var args []string
	for i, param := range parameters {
		switch v := param.(type) {
		case []string:
			args = append(args, fmt.Sprintf("$%d::TEXT[]", i+1))
			var textArray pgtype.TextArray
			err := textArray.Set(v)
			if err != nil {
				log.FuncErrorTrace(0, "Error setting TextArray: %v\n", err)
				continue
			}
			parameters[i] = textArray
		case pgtype.JSONB:
			args = append(args, fmt.Sprintf("$%d::jsonb", i+1))
		default:
			args = append(args, fmt.Sprintf("$%d", i+1))
		}
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
	case reflect.Bool:
		return value.(bool), nil
	// Add more cases for other types as needed
	default:
		return nil, fmt.Errorf("unsupported column type: %v", columnType.ScanType().Kind())
	}
}

/******************************************************************************
 * FUNCTION:        startTransaction
 * DESCRIPTION:     Initiates a database transaction
 * INPUT:           dbIdx uint8
 * RETURNS:         *sql.Tx, error
 ******************************************************************************/
func StartTransaction(dbIdx uint8) (*sql.Tx, error) {
	var err error
	log.EnterFn(0, "startTransaction")
	defer func() { log.ExitFn(0, "startTransaction", err) }()

	con, err := getDBConnection(dbIdx, OWEDB)
	if err != nil {
		log.FuncErrorTrace(0, "startTransaction Failed to get %v Connection with err = %v", OWEDB, err)
		return nil, err
	}

	tx, err := con.CtxH.Begin()
	if err != nil {
		log.FuncErrorTrace(0, "startTransaction Failed to begin transaction with err = %v", err)
		return nil, err
	}

	return tx, nil
}

/******************************************************************************
* FUNCTION:        commitTransaction
* DESCRIPTION:     Commits a database transaction
* INPUT:           tx *sql.Tx
* RETURNS:         error
******************************************************************************/
func CommitTransaction(tx *sql.Tx) error {
	var err error
	log.EnterFn(0, "commitTransaction")
	defer func() { log.ExitFn(0, "commitTransaction", err) }()

	err = tx.Commit()
	if err != nil {
		log.FuncErrorTrace(0, "commitTransaction Failed to commit transaction with err = %v", err)
		return err
	}

	return nil
}
