/**************************************************************************
* File			: apiGetDbTables.go
* DESCRIPTION	: This file contains functions to get db tables
* DATE			: 5-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetTableRequest
 * DESCRIPTION:     handler to get db tables
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetUserTableListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err error
		// dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "HandleGetUserMgmtOnboardingDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUserMgmtOnboardingDataRequest", err) }()

	emailId := req.Context().Value("emailid").(string)

	query = `SELECT jsonb_array_elements(tables_permissions)->>'table_name' AS table_name FROM user_details WHERE email_id = $1`

	whereEleList = append(whereEleList, emailId)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get UserMgmt Onboarding data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get UserMgmt Onboarding data from DB", http.StatusBadRequest, nil)
		return
	}

	tableList := models.TableList{}

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
	log.FuncInfoTrace(0, "Number of UserMgmt Onboarding List fetched : %v list %+v", len(tableList.DbTables), tableList)
	FormAndSendHttpResp(resp, "Data base tables", http.StatusOK, tableList)
}
