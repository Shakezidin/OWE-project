/**************************************************************************
* File			: apiGetUserTableList.go
* DESCRIPTION	: This file contains functions to get user table list
* DATE			: 13-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"

	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetUserTableListRequest
 * DESCRIPTION:     handler to get user table list
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

type TableList struct {
	GetAllTable bool `json:"get_all_table"`
}

func HandleGetUserTableListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      TableList
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "HandleGetUserTableListRequest")
	defer func() { log.ExitFn(0, "HandleGetUserTableListRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get timeline sla data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get timeline sla data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get timeline sla data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get timeline sla data Request body", http.StatusBadRequest, nil)
		return
	}

	tableList := models.TableList{}
	if dataReq.GetAllTable {
		allTableQuery := `SELECT table_name as db_tables
		FROM information_schema.tables
		WHERE table_schema = 'public'
		AND table_type = 'BASE TABLE' ORDER BY table_name;`

		data, err = db.ReteriveFromDB(db.RowDataDBIndex, allTableQuery, nil)
		if err != nil {
			//log.FuncErrorTrace(0, "Failed to get User table list data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get User table list data from DB", http.StatusBadRequest, nil)
			return
		}

		for i, row := range data {
			//log.FuncErrorTrace(0, "Processing row %d: %v", i, row)

			if dbTables, ok := row["db_tables"]; ok {
				var tableName string
				switch v := dbTables.(type) {
				case string:
					tableName = v
				case []byte:
					tableName = string(v)
				default:
					log.FuncErrorTrace(0, "Row %d: Unexpected type for db_tables: %T, value: %v", i, dbTables, dbTables)
					continue
				}

				// Append the table name directly
				tableList.DbTables = append(tableList.DbTables, models.Table{TableName: tableName})
			} else {
				log.FuncErrorTrace(0, "Row %d: db_tables field missing in row: %v", i, row)
			}
		}

		// Send the response
		log.FuncInfoTrace(0, "Number of User table List fetched : %v list %+v", len(tableList.DbTables), tableList.DbTables)
		appserver.FormAndSendHttpResp(resp, "User table list", http.StatusOK, tableList)
		return
	}
	emailId := req.Context().Value("emailid").(string)
	// roleName := req.Context().Value("rolename").(string)

	query = `SELECT jsonb_array_elements(tables_permissions)->>'table_name' AS table_name FROM user_details WHERE email_id = $1`

	whereEleList = append(whereEleList, emailId)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get User table list data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get User table list data from DB", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {
		// Attempt to type assert item["table_name"] to string
		tableName, ok := item["table_name"].(string)
		if !ok {
			continue
		}

		// Create a new Table object
		table := models.Table{TableName: string(tableName)}

		// Append the new table to the tableList
		tableList.DbTables = append(tableList.DbTables, table)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of User table List fetched : %v list %+v", len(tableList.DbTables), tableList)
	appserver.FormAndSendHttpResp(resp, "User table list", http.StatusOK, tableList)
}
