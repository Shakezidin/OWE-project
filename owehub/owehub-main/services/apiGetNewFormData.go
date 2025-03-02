/**************************************************************************
 * File       	   : apiGetNewFormData.go
 * DESCRIPTION     : This file contains functions for get new form data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"errors"

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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get new form data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &newFormDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get new form data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get new form data Request body", http.StatusBadRequest, nil)
		return
	}

	if len(newFormDataReq.TableNames) <= 0 {
		log.FuncErrorTrace(0, "Table name list is empty", nil)
		appserver.FormAndSendHttpResp(resp, "Table Name list is empty", http.StatusBadRequest, nil)
		return
	}

	// Prepare the response data
	responseData := make(map[string]interface{})
	role, _ := req.Context().Value("rolename").(string)
	email, _ := req.Context().Value("emailid").(string)

	// Iterate through table names
	for _, tableName := range newFormDataReq.TableNames {
		var items []string
		var dbIndex uint8 = db.OweHubDbIndex

		switch tableName {
		case "account_manager":
			query = `
				SELECT
					U.name AS data
				FROM
					user_roles AS R
				INNER JOIN
					user_details AS U
				ON
					R.role_id = U.role_id
				WHERE
					R.role_name = 'Account Manager'
			`
		case "project_manager":
			query = `
				SELECT
					U.name AS data
				FROM
					user_roles AS R
				INNER JOIN
					user_details AS U
				ON
					R.role_id = U.role_id
				WHERE
					R.role_name = 'Project Manager'
			`

		case "partners":
			query = "SELECT partner_name as data FROM " + db.TableName_partners
		case "installers":
			query = "SELECT partner_name as data FROM " + db.TableName_partners
			tableName = "installers"
		case "states":
			query = "SELECT name as data FROM " + db.TableName_states
		case "teams":
			query = "SELECT team_name as data FROM " + db.TableName_teams
		case "roles":
			query = "SELECT role_name as data FROM " + db.TableName_user_roles
		case "users":
			query = "SELECT name as data FROM " + db.TableName_users_details
		case "dealer_name":
			if role == string(types.RoleAccountManager) || role == string(types.RoleAccountExecutive) || role == string(types.RoleProjectManager) {
				accountName, err := fetchAmAeName(email)
				if err != nil {
					appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
					return
				}
				var roleBase string

				if role == "Account Manager" {
					roleBase = "account_manager"
				}
				if role == "Account Executive" {
					roleBase = "account_executive"
				}
				//Project Manager
				if role == "Project Manager" {
					roleBase = "project_manager"
				}

				log.FuncInfoTrace(0, "logged user %v is %v", accountName, roleBase)
				query = fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
				dbIndex = db.RowDataDBIndex
			} else {
				query = "SELECT sales_partner_name as data FROM sales_partner_dbhub_schema"
			}
		case "available_states":
			query = `select DISTINCT(CASE
							WHEN LENGTH(cs.state) > 6 THEN SUBSTRING(cs.state FROM 7)
							ELSE cs.state
						END
						) AS data from customers_customers_schema cs
	LEFT JOIN pv_install_install_subcontracting_schema pis ON cs.unique_id = pis.customer_unique_id
	where pis.pv_completion_date IS NOT NULL`
			dbIndex = db.RowDataDBIndex
		case "recruiter":
			query = `SELECT DISTINCT recruiter as data FROM sales_partner_dbhub_schema
						WHERE recruiter IS NOT NULL AND recruiter <> '';`
		default:
			log.FuncErrorTrace(0, "Invalid table name provided: %v", tableName)
			responseData[tableName] = nil
			continue
		}

		data, err = db.ReteriveFromDB(dbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get new form data for table name %v from DB err: %v", tableName, err)
			appserver.FormAndSendHttpResp(resp, "Failed to get Data from DB", http.StatusBadRequest, nil)
			return
		}

		for _, item := range data {
			name, ok := item["data"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get data item for Item: %+v\n", item)
				continue
			}
			items = append(items, name)
		}
		if tableName == "dealer_name" && (role != string(types.RoleAccountManager) && role != string(types.RoleAccountExecutive) && role != string(types.RoleProjectManager)) {
			items = append(items, "")
		}
		responseData[tableName] = items
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of new form data List fetched : %v list %+v", len(responseData), responseData)
	appserver.FormAndSendHttpResp(resp, "New Form Data", http.StatusOK, responseData)
}

/******************************************************************************
 * FUNCTION:				fetchAmAeName
 * DESCRIPTION:     handler to get of the logged in ae / am
 * INPUT:						resp, req
 * RETURNS:    			string, error
 ******************************************************************************/
func fetchAmAeName(email string) (string, error) {
	var err error
	log.EnterFn(0, "fetchAmAeName")
	defer func() { log.ExitFn(0, "fetchAmAeName", err) }()

	query := fmt.Sprintf("SELECT name FROM user_details WHERE email_id = '%s'", email)
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil || len(data) == 0 {
		log.FuncErrorTrace(0, "unable to fetch name for account manager / account executive")
		return "", errors.New("unable to fetch name for account manager / account executive")
	}
	userName := data[0]["name"].(string)
	return userName, nil
}
