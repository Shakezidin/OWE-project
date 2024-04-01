/**************************************************************************
 * File       	   : apiGetNewFormData.go
 * DESCRIPTION     : This file contains functions for get new form data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetNewFormDataRequest
 * DESCRIPTION:     handler for get users data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetNewFormDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		newFormDataReq models.CreateNewFormDataRequest
		whereEleList   []interface{}
		data           []map[string]interface{}
		query          string
	)

	log.EnterFn(0, "HandleGetNewFormDataRequest")
	defer func() { log.ExitFn(0, "HandleGetNewFormDataRequest", err) }()

	// Read and parse request body
	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get new form data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get new form data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &newFormDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get new form data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get new form data Request body", http.StatusBadRequest, nil)
		return
	}

	if len(newFormDataReq.TableNames) <= 0 {
		log.FuncErrorTrace(0, "Table name list is empty", nil)
		FormAndSendHttpResp(resp, "Table Name list is empty", http.StatusBadRequest, nil)
		return
	}

	// Prepare the response data
	responseData := make(map[string]interface{})

	// Iterate through table names
	for _, tableName := range newFormDataReq.TableNames {
		var items []string

		switch tableName {
		case "partners":
			query = "SELECT partner_name as data FROM " + db.TableName_partners
		case "installers":
			query = "SELECT partner_name as data FROM " + db.TableName_partners
			tableName = "installers"
		case "states":
			query = "SELECT name as data FROM " + db.TableName_states
		case "teams":
			query = "SELECT team_name as data FROM " + db.TableName_teams
		case "sub-dealer":
			query = "SELECT sub_dealer as data FROM " + db.TableName_dealer_override
			tableName = "sub-dealer"
		case "source":
			query = "SELECT name as data FROM " + db.TableName_source
		case "adder_type":
			query = "SELECT adder_type as data FROM " + db.TableName_adder_type
		case "owe_cost":
			query = "SELECT owe_cost as data FROM " + db.TableName_tier_loan_fee
			tableName = "owe_cost"
		default:
			log.FuncErrorTrace(0, "Invalid table name provided: %v", tableName)
			// Add table data with unsupported message
			responseData[tableName] = nil
			continue
		}

		data, err = db.ReteriveFromDB(query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get new form data for table name %v from DB err: %v", tableName, err)
			FormAndSendHttpResp(resp, "Failed to get Data from DB", http.StatusBadRequest, nil)
			return
		}

		for _, item := range data {
			name, ok := item["data"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get data item. Item: %+v\n", item)
				continue
			}
			items = append(items, name)
		}
		responseData[tableName] = items
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of new form data List fetched : %v userlist %+v", len(responseData), responseData)
	FormAndSendHttpResp(resp, "New Form Data", http.StatusOK, responseData)
}
