/**************************************************************************
* File			: apiUpdateUser.go
* DESCRIPTION	: This file contains functions for update User
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateUserRequest
 * DESCRIPTION:     handler for update User request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

type TablePermission struct {
	TableName     string `json:"table_name"`
	PrivilegeType string `json:"privilege_type"`
}

func HandleUpdateUserRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		updateUserReq         models.UpdateUserReq
		queryParameters       []interface{}
		result                []interface{}
		userInfoResult        []map[string]interface{}
		tablepermissionsModel []TablePermission
		tablesPermissionsJSON []byte
		userName              string
	)

	log.EnterFn(0, "HandleupdateUserRequest")
	defer func() { log.ExitFn(0, "HandleupdateUserRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update User request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update User request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateUserReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update User request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update User request", http.StatusBadRequest, nil)
		return
	}

	emailId := req.Context().Value("emailid").(string)
	updateUserReq.EmailId = emailId

	if len(updateUserReq.Name) <= 0 {
		//(len(updateUserReq.EmailId) <= 0) || can not update this
		//(len(updateUserReq.MobileNumber) <= 0) || can not update this
		//(len(updateUserReq.Country) <= 0) ||
		//(len(updateUserReq.Designation) <= 0) ||
		//(len(updateUserReq.RoleName) <= 0) ||
		//(len(updateUserReq.ReportingManager) <= 0) ||
		//(len(updateUserReq.DealerOwner) <= 0) ||
		//(len(updateUserReq.StreetAddress) <= 0) ||
		//(len(updateUserReq.State) <= 0) ||
		//(len(updateUserReq.City) <= 0) ||
		//(len(updateUserReq.Zipcode) <= 0) {\
		//(len(updateUserReq.UserStatus) <= 0) ||
		//(len(updateUserReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if len(updateUserReq.UserCode) <= 0 {
		err = fmt.Errorf("Invalid UserCode, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid UserCode, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateUserReq.TablesPermissions != nil {
		tablesPermissionsJSON, err = json.Marshal(updateUserReq.TablesPermissions)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create user, marshall error: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to create user", http.StatusInternalServerError, nil)
			return
		}
	}

	// setup user info logging
	logUserApi, closeUserLog := initUserApiLogging(req)
	defer func() { closeUserLog(err) }()

	if updateUserReq.RoleName == "DB User" || updateUserReq.RoleName == "Admin" {
		// Join selected parts with underscores

		query := fmt.Sprintf(
			"SELECT name, tables_permissions FROM user_details WHERE email_id = '%s';",
			updateUserReq.EmailId,
		)
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil || len(data) <= 0 {
			log.FuncErrorTrace(0, "Failed to get old username from db with err %s", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get old username from db", http.StatusInternalServerError, nil)
			return
		}

		tablepermissions, ok := data[0]["tables_permissions"].([]byte)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get tables_permissions for email ID %v. Item: %+v\n", updateUserReq.EmailId, data)
			return
		}

		userName, ok = data[0]["name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get username for email ID %v. Item: %+v\n", updateUserReq.EmailId, data)
			return
		}

		err = json.Unmarshal(tablepermissions, &tablepermissionsModel)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to unmarshal tables_permissions JSON data: %s\n", err)
			return
		}

		newusername := strings.Join(strings.Fields(updateUserReq.Name)[0:2], "_")
		oldusername := strings.Join(strings.Fields(userName)[0:2], "_")

		// Construct SQL statements to revoke privileges and drop the role (user)
		sqlStatement := fmt.Sprintf(
			"REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s; ALTER ROLE %s RENAME TO %s;",
			oldusername,
			oldusername,
			newusername,
		)

		// Execute the SQL statement
		err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to revoke privileges and drop user %s: %v", oldusername, err)
			appserver.FormAndSendHttpResp(resp, "Failed to revoke user privilages", http.StatusInternalServerError, nil)
			return
			// Handle the error as needed, such as logging or returning an HTTP response
		} else {
			log.FuncErrorTrace(0, "Successfully revoked privileges and dropped user %s", oldusername)
			// Optionally, you can log a success message or perform additional actions
		}

		log.FuncErrorTrace(0, "updateUserReq.TablesPermissions %+v", updateUserReq.TablesPermissions)
		for _, item := range updateUserReq.TablesPermissions {
			switch item.PrivilegeType {
			case "View":
				sqlStatement = fmt.Sprintf("GRANT SELECT ON %s TO %s;", item.TableName, newusername)
			case "Edit":
				sqlStatement = fmt.Sprintf("GRANT SELECT, UPDATE ON %s TO %s;", item.TableName, newusername)
			case "Full":
				sqlStatement = fmt.Sprintf("GRANT ALL PRIVILEGES ON %s TO %s;", item.TableName, newusername)
			}

			log.FuncErrorTrace(0, "sqlStatement %v", sqlStatement)

			err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
			log.FuncErrorTrace(0, " sqlStatement err %+v", err)
			if err != nil {
				sqlStatement := fmt.Sprintf("ALTER ROLE %s RENAME TO %s;", newusername, oldusername)
				// Execute the SQL statement
				err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to update new user to old user %s: %v", oldusername, err)
					// Handle the error as needed, such as logging or returning an HTTP response
				}

				for _, item := range tablepermissionsModel {
					switch item.PrivilegeType {
					case "View":
						sqlStatement = fmt.Sprintf("GRANT SELECT ON %s TO %s;", item.TableName, oldusername)
					case "Edit":
						sqlStatement = fmt.Sprintf("GRANT SELECT, UPDATE ON %s TO %s;", item.TableName, oldusername)
					case "Full":
						sqlStatement = fmt.Sprintf("GRANT ALL PRIVILEGES ON %s TO %s;", item.TableName, oldusername)
					}

					log.FuncErrorTrace(0, "sqlStatement %v", sqlStatement)

					err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
					if err != nil {
						log.FuncErrorTrace(0, "Failed to revoke privileges and drop user %s: %v", oldusername, err)
						// Handle the error as needed, such as logging or returning an HTTP response
					}

				}
				log.FuncErrorTrace(0, "Failed to update user with err: %v", err)
				appserver.FormAndSendHttpResp(resp, "Failed to update the user db privilages", http.StatusInternalServerError, nil)
				return
			}

		}
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateUserReq.Name)
	// queryParameters = append(queryParameters, updateUserReq.MobileNumber)
	// queryParameters = append(queryParameters, updateUserReq.EmailId)
	// queryParameters = append(queryParameters, updateUserReq.PasswordChangeReq)
	queryParameters = append(queryParameters, updateUserReq.ReportingManager)
	queryParameters = append(queryParameters, updateUserReq.DealerOwner)
	queryParameters = append(queryParameters, updateUserReq.RoleName)
	queryParameters = append(queryParameters, updateUserReq.UserStatus)
	queryParameters = append(queryParameters, updateUserReq.Designation)
	queryParameters = append(queryParameters, updateUserReq.Description)
	queryParameters = append(queryParameters, updateUserReq.Region)
	queryParameters = append(queryParameters, updateUserReq.StreetAddress)
	queryParameters = append(queryParameters, updateUserReq.State)
	queryParameters = append(queryParameters, updateUserReq.City)
	queryParameters = append(queryParameters, updateUserReq.Zipcode)
	queryParameters = append(queryParameters, updateUserReq.Country)
	queryParameters = append(queryParameters, updateUserReq.UserCode)
	queryParameters = append(queryParameters, updateUserReq.Dealer)
	queryParameters = append(queryParameters, tablesPermissionsJSON)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateUserFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		newusername := strings.Join(strings.Fields(updateUserReq.Name)[0:2], "_")
		oldusername := strings.Join(strings.Fields(userName)[0:2], "_")
		sqlStatement := fmt.Sprintf("ALTER ROLE %s RENAME TO %s;", newusername, oldusername)
		// Execute the SQL statement
		err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update new user to old user %s: %v", oldusername, err)
			// Handle the error as needed, such as logging or returning an HTTP response
		}

		for _, item := range tablepermissionsModel {
			switch item.PrivilegeType {
			case "View":
				sqlStatement = fmt.Sprintf("GRANT SELECT ON %s TO %s;", item.TableName, oldusername)
			case "Edit":
				sqlStatement = fmt.Sprintf("GRANT SELECT, UPDATE ON %s TO %s;", item.TableName, oldusername)
			case "Full":
				sqlStatement = fmt.Sprintf("GRANT ALL PRIVILEGES ON %s TO %s;", item.TableName, oldusername)
			}

			log.FuncErrorTrace(0, "sqlStatement %v", sqlStatement)

			err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to revoke privileges and drop user %s: %v", oldusername, err)
				// Handle the error as needed, such as logging or returning an HTTP response
			}

		}
		log.FuncErrorTrace(0, "Failed to Update User in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update User", http.StatusInternalServerError, nil)
		return
	}

	// records updated user in user logs
	userInfoResult, err = db.ReteriveFromDB(
		db.OweHubDbIndex,
		"SELECT mobile_number, db_username FROM user_details WHERE email_id = $1",
		[]interface{}{updateUserReq.EmailId},
	)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to Retrieve User Details from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update User", http.StatusInternalServerError, nil)
		return
	}

	if len(userInfoResult) == 0 {
		err = fmt.Errorf("Failed to Retrieve User Details from DB")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update User", http.StatusInternalServerError, nil)
		return
	}

	if updateUserReq.RoleName == "DB User" || updateUserReq.RoleName == "Admin" {
		tablePermissionStringParts := make([]string, len(tablepermissionsModel))
		for i, perm := range tablepermissionsModel {
			tablePermissionStringParts[i] = fmt.Sprintf("%s(%s)", perm.TableName, strings.ToLower(perm.PrivilegeType))
		}

		details := map[string]string{
			"name":              updateUserReq.Name,
			"table_permissions": strings.Join(tablePermissionStringParts, ", "),
			"mobile_number":     userInfoResult[0]["mobile_number"].(string),
			"db_username":       userInfoResult[0]["db_username"].(string),
		}
		logUserApi(fmt.Sprintf("Updated user %s in owehubdb and owedb with data - %+v", updateUserReq.EmailId, details))
	} else {
		details := map[string]string{
			"name":          updateUserReq.Name,
			"mobile_number": userInfoResult[0]["mobile_number"].(string),
		}
		logUserApi(fmt.Sprintf("Updated user %s in owehubdb with data - %+v", updateUserReq.EmailId, details))
	}

	data := result[0].(map[string]interface{})
	log.DBTransDebugTrace(0, "User updated with Id: %+v", data["result"])

	appserver.FormAndSendHttpResp(resp, "User Updated Successfully", http.StatusOK, nil)
}
