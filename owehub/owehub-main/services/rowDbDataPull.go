/**************************************************************************
 * File			: rowDbDataPull.go
 * DESCRIPTION  : This file contains functions for data sync from owe db
 * DATE         : 20-Jan-2024
 **************************************************************************/
package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"fmt"
	"strings"
	"time"
)

/******************************************************************************
 * FUNCTION:        UpsertSalesPartnersFromOweDb
 * DESCRIPTION:     This function will upsert sales partners from owe db
 * INPUT:			recordIds
 * RETURNS:    		err
 ******************************************************************************/
func UpsertSalesPartnersFromOweDb(recordIds ...string) error {
	var (
		query              string
		whereClause        string
		whereEleList       []interface{}
		wherePlaceholders  []string
		err                error
		oweDbData          []map[string]interface{}
		insertTuples       []string
		updateParams       []string
		didGetUpdateParams bool
		tableName          string
		columns            [][]string
	)

	tableName = "sales_partner_dbhub_schema"

	// listed mapping of columns to sync (owe_db colname, owe_hub colname)
	columns = [][]string{
		{"record_id", "item_id"}, // primary key !! MUST BE FIRST IN THE LIST !!
		{"partner_id", "partner_id"},
		{"sales_partner_name", "sales_partner_name"},
		{"account_manager", "account_manager2"},
		{"account_executive", "account_executive"},
	}
	for _, recordId := range recordIds {
		whereEleList = append(whereEleList, recordId)
		wherePlaceholders = append(wherePlaceholders, fmt.Sprintf("$%d", len(whereEleList)))
	}

	// don't use where clause if recordIds not provided
	if len(whereEleList) > 0 {
		whereClause = fmt.Sprintf("WHERE %s IN (%s)", columns[0][0], strings.Join(wherePlaceholders, ", "))
	}

	// query owe db
	query = "SELECT "
	for i, column := range columns {
		if i != 0 {
			query += ", "
		}
		query += column[0]
	}
	query += fmt.Sprintf(" FROM %s %s", tableName, whereClause)

	oweDbData, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB with error = %v", err)
		return err
	}

	if len(oweDbData) == 0 {
		log.FuncDebugTrace(0, "No data found in owe db for upsert")
		return nil
	}

	// prepare upsert query like this:
	//
	// INSERT INTO <tableName> (item_id, column1, column2) VALUES
	// (1, 'value1', 'value2'),
	// (2, 'value1', 'value2'),
	// (3, 'value1', 'value2')
	// ON CONFLICT (item_id)
	// DO UPDATE SET
	// column1 = EXCLUDED.column1,
	// column2 = EXCLUDED.column2
	//

	for _, item := range oweDbData {
		tupleItems := []string{}
		for _, column := range columns {
			switch val := item[column[0]].(type) {
			case string:
				// escape single quotes
				val = strings.ReplaceAll(val, "'", "''")
				tupleItems = append(tupleItems, fmt.Sprintf("'%s'", val))
			case float32, float64, int64:
				tupleItems = append(tupleItems, fmt.Sprintf("%v", val))
			case time.Time:
				tupleItems = append(tupleItems, fmt.Sprintf("'%s'", val.Format("2006-01-02 15:04:05")))
			default:
				err = fmt.Errorf("unsupported type: %T for column: %s, value: %v", val, column, val)
				return err
			}

			// add update param if not added yet
			if !didGetUpdateParams {
				updateParams = append(updateParams, fmt.Sprintf("%s = EXCLUDED.%s", column[1], column[1]))
			}
		}

		insertTuples = append(insertTuples, fmt.Sprintf("(%s)", strings.Join(tupleItems, ",")))
		didGetUpdateParams = true // set to true after first item
	}

	query = fmt.Sprintf("INSERT INTO %s (", tableName)
	for i, column := range columns {
		if i != 0 {
			query += ", "
		}
		query += column[1]
	}
	query += fmt.Sprintf(") VALUES %s ON CONFLICT (%s) DO UPDATE SET %s",
		strings.Join(insertTuples, ","),
		columns[0][1],
		strings.Join(updateParams, ","),
	)

	// execute upsert query
	err = db.ExecQueryDB(db.OweHubDbIndex, query)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert data in DB with error = %v", err)
		return err
	}

	return nil
}
