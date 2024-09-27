/**************************************************************************
* File			: apiGetDbTables.go
* DESCRIPTION	: This file contains functions to get db tables
* DATE			: 5-May-2024
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
 * FUNCTION:		HandleGetTableRequest
 * DESCRIPTION:     handler to get db tables
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleGetTableRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "HandleGetUserMgmtOnboardingDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUserMgmtOnboardingDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get UserMgmt Onboarding data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get UserMgmt Onboarding data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get UserMgmt Onboarding data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get UserMgmt Onboarding data Request body", http.StatusBadRequest, nil)
		return
	}

	query = `SELECT table_name FROM information_schema.tables WHERE table_type = 'BASE TABLE';`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get UserMgmt Onboarding data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get UserMgmt Onboarding data from DB", http.StatusBadRequest, nil)
		return
	}

	tableList := models.TableList{}

	for _, item := range data {
		// Attempt to type assert item["table_name"] to string
		tableName, ok := item["table_name"].([]byte)
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
	appserver.FormAndSendHttpResp(resp, "Data base tables", http.StatusOK, tableList)
}

/******************************************************************************
 * FUNCTION:		HandleGetTableRequest
 * DESCRIPTION:     handler to get db tables
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
