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
		columns            []string
	)

	tableName = "sales_partner_dbhub_schema"

	// columns to sync (excluding item_id)
	columns = []string{
		"partner_id",
		"sales_partner_name",
		"account_manager2",
		"account_executive",
	}

	for _, recordId := range recordIds {
		whereEleList = append(whereEleList, recordId)
		wherePlaceholders = append(wherePlaceholders, fmt.Sprintf("$%d", len(whereEleList)))
	}

	// don't use where clause if recordIds not provided
	if len(whereEleList) > 0 {
		whereClause = fmt.Sprintf("WHERE item_id IN (%s)", strings.Join(wherePlaceholders, ","))
	}

	// query owe db
	query = fmt.Sprintf("SELECT item_id, %s FROM %s %s", strings.Join(columns, ","), tableName, whereClause)

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
		tupleItems := []string{fmt.Sprintf("%v", item["item_id"])}

		for _, column := range columns {
			switch val := item[column].(type) {
			case string:
				// escape single quotes
				val = strings.ReplaceAll(val, "'", "''")
				tupleItems = append(tupleItems, fmt.Sprintf("'%s'", val))
			case float32, float64:
				tupleItems = append(tupleItems, fmt.Sprintf("%f", val))
			case time.Time:
				tupleItems = append(tupleItems, fmt.Sprintf("'%s'", val.Format("2006-01-02 15:04:05")))
			default:
				err = fmt.Errorf("unsupported type: %T for column: %s, value: %v", val, column, val)
				return err
			}

			// add update param if not added yet
			if !didGetUpdateParams {
				updateParams = append(updateParams, fmt.Sprintf("%s = EXCLUDED.%s", column, column))
			}
		}

		insertTuples = append(insertTuples, fmt.Sprintf("(%s)", strings.Join(tupleItems, ",")))
		didGetUpdateParams = true // set to true after first item
	}

	query = fmt.Sprintf(
		"INSERT INTO %s (item_id, %s) VALUES %s ON CONFLICT (item_id) DO UPDATE SET %s",
		tableName,
		strings.Join(columns, ","),
		strings.Join(insertTuples, ","),
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
