/**************************************************************************
 * File       	   : apiGetNewFormData.go
 * DESCRIPTION     : This file contains functions for get new form data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
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
	role, _ := req.Context().Value("rolename").(string)
	email, _ := req.Context().Value("emailid").(string)

	// Iterate through table names
	for _, tableName := range newFormDataReq.TableNames {
		var items []string
		var dbIndex uint8 = db.OweHubDbIndex

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
		// case "owe_cost":
		// 	query = "SELECT CAST(owe_cost AS VARCHAR) AS data FROM " + db.TableName_tier_loan_fee
		case "tier":
			query = "SELECT tier_name as data FROM " + db.TableName_tier
		case "roles":
			query = "SELECT role_name as data FROM " + db.TableName_user_roles
		case "users":
			query = "SELECT name as data FROM " + db.TableName_users_details
		case "sale_type":
			query = "SELECT type_name as data FROM " + db.TableName_sale_type
		case "loan_type":
			query = "SELECT product_code as data FROM " + db.TableName_loan_type
		case "dealer":
			query = "SELECT dealer_name as data FROM " + db.TableName_v_dealer + " WHERE is_deleted = false"
		case "dealer_name":
			if role == string(types.RoleAccountManager) || role == string(types.RoleAccountExecutive) {
				accountName, err := fetchAmAeName(email)
				if err != nil {
					FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
					return
				}
				var roleBase string
				if role == "Account Manager" {
					roleBase = "account_manager"
				} else {
					roleBase = "account_executive"
				}
				log.FuncInfoTrace(0, "logged user %v is %v", accountName, roleBase)
				query = fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
				dbIndex = db.RowDataDBIndex
			} else {
				query = "SELECT dealer_name as data FROM " + db.TableName_v_dealer + " WHERE is_deleted = false"
			}
		case "rep_type":
			query = "SELECT rep_type as data FROM " + db.TableName_rep_type
		default:
			log.FuncErrorTrace(0, "Invalid table name provided: %v", tableName)
			responseData[tableName] = nil
			continue
		}

		data, err = db.ReteriveFromDB(dbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get new form data for table name %v from DB err: %v", tableName, err)
			FormAndSendHttpResp(resp, "Failed to get Data from DB", http.StatusBadRequest, nil)
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
		responseData[tableName] = items
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of new form data List fetched : %v list %+v", len(responseData), responseData)
	FormAndSendHttpResp(resp, "New Form Data", http.StatusOK, responseData)
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
