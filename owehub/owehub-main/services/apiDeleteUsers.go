/**************************************************************************
* File			: apiUpdateUsersArchive.go
* DESCRIPTION	: This file contains functions for delete users
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

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:		HandleDeleteUsersRequest
 * DESCRIPTION:     handler for delete Users request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDeleteUsersRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		reqBody           []byte
		userDetailsResult []map[string]interface{}
		whereClause       string
		deleteUsersReq    models.DeleteUsers
		whereEleList      []interface{}
		query             string
		userQuery         string
		userDetails       []map[string]interface{}
		tablePermissions  []models.TablePermission
		rowsAffected      int64
		userIds           []int64
	)

	log.EnterFn(0, "HandleDeleteUsersRequest")
	defer func() { log.ExitFn(0, "HandleDeleteUsersRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in delete users request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from delete users request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &deleteUsersReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal delete users request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal delete users request", http.StatusBadRequest, nil)
		return
	}

	// setup user info logging
	logUserApi, closeUserLog := initUserApiLogging(req)
	defer func() { closeUserLog(err) }()

	whereClause = fmt.Sprintf("WHERE user_code IN ('%s')", strings.Join(deleteUsersReq.UserCodes, ","))

	userQuery = fmt.Sprintf(`SELECT user_id, name, email_id, user_code, role_id
							 FROM user_details %s;`, whereClause)

	userDetailsResult, err = db.ReteriveFromDB(db.OweHubDbIndex, userQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get user details from DB for podio err: %v", err)
	}

	if len(userDetailsResult) != 0 {
		for _, data := range userDetailsResult {
			userId, ok := data["user_id"].(int64)
			if !ok {
				userId = 0
			}
			userIds = append(userIds, userId)
		}
	}

	//
	// NEW LOGIC: Delete By Email
	//
	if len(deleteUsersReq.EmailIds) > 0 {
		userDetailsQuery := "SELECT * FROM user_details WHERE email_id = ANY($1)"
		userDetails, err = db.ReteriveFromDB(db.OweHubDbIndex, userDetailsQuery, []interface{}{pq.Array(deleteUsersReq.EmailIds)})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to get user details err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to delete users", http.StatusInternalServerError, nil)
			return
		}

		for _, user := range userDetails {
			dbUsername, dbUsernameOk := user["db_username"].(string)
			emailId := user["email_id"].(string)

			// extract details for logging user info
			userInfo := map[string]interface{}{
				"name":          user["name"],
				"user_code":     user["user_code"],
				"mobile_number": user["mobile_number"],
			}

			// delete from RowDataDB
			if dbUsernameOk && dbUsername != "" {
				// append db_username & table_permissions to userInfo for logging
				userInfo["db_username"] = dbUsername

				tablePermissionsBytes := user["tables_permissions"].([]byte)
				unmarshallErr := json.Unmarshal(tablePermissionsBytes, &tablePermissions)
				if unmarshallErr != nil {
					log.FuncErrorTrace(0, "Failed unmarshall table permissions %s err: %v", string(tablePermissionsBytes), unmarshallErr)
					continue
				}

				tablePermissionStringParts := make([]string, len(tablePermissions))
				for i, perm := range tablePermissions {
					tablePermissionStringParts[i] = fmt.Sprintf("%s(%s)", perm.TableName, strings.ToLower(perm.PrivilegeType))
				}
				userInfo["table_permissions"] = strings.Join(tablePermissionStringParts, ", ")
				sqlStatement := fmt.Sprintf("REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s; DROP ROLE %s;", dbUsername, dbUsername)
				dropRoleErr := db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)

				// ignore error incase it is "user does not exist"; i.e. user was already deleted due to some reason
				if dropRoleErr != nil && !strings.Contains(strings.ToLower(dropRoleErr.Error()), "does not exist") {
					log.FuncErrorTrace(0, "Failed to delete user %s from owedb err: %v", dbUsername, dropRoleErr)
					continue
				}
			}

			// delete from OweHubDb & log
			deleteQuery := "DELETE FROM user_details WHERE email_id = $1"
			deleteErr, rowsDeleted := db.UpdateDataInDB(db.OweHubDbIndex, deleteQuery, []interface{}{emailId})

			if deleteErr != nil {
				log.FuncErrorTrace(0, "Failed to delete user %s from owehubdb err: %v", dbUsername, deleteErr)
				continue
			}

			rowsAffected += rowsDeleted
			logUserApi(fmt.Sprintf("Deleted %s from owedb and owehubdb - %+v", emailId, userInfo))
		}

		if rowsAffected == 0 {
			log.DBTransDebugTrace(0, "No User(s) deleted with emails: %v", deleteUsersReq.EmailIds)
			appserver.FormAndSendHttpResp(resp, "No User(s) deleted, user(s) not present with provided emails", http.StatusNotFound, nil)
			logUserApi("No users deleted")
			return
		}

		log.DBTransDebugTrace(0, "Total %d User(s) deleted with Emails: %v", rowsAffected, deleteUsersReq.EmailIds)
		appserver.FormAndSendHttpResp(resp, fmt.Sprintf("Total %d User(s) deleted Successfully", rowsAffected), http.StatusOK, rowsAffected)

		return
	}

	//
	// END NEW LOGIC
	//

	if len(deleteUsersReq.UserCodes) == 0 {
		err = fmt.Errorf("User codes list is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "User codes list is empty, delete users failed", http.StatusBadRequest, nil)
		return
	}

	// Delete Usernames
	for _, username := range deleteUsersReq.Usernames {
		// Construct SQL statements to revoke privileges and drop the role (user)
		sqlStatement := fmt.Sprintf("REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s; DROP ROLE %s;", username, username)

		// Execute the SQL statement
		err := db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to revoke privileges and drop user %s: %v", username, err)
			// Handle the error as needed, such as logging or returning an HTTP response
		} else {
			log.FuncErrorTrace(0, "Successfully revoked privileges and dropped user %s", username)
			// Optionally, you can log a success message or perform additional actions
		}
	}

	whereEleList = nil
	whereEleList = append(whereEleList, pq.Array(userIds))

	query = `DELETE FROM team_members WHERE user_id = ANY($1)`

	// Execute the delete query
	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete Users data from team_members err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to delete users Data from team_members", http.StatusBadRequest, nil)
		return
	}

	// Copy user codes to whereEleList
	whereEleList = nil
	whereEleList = append(whereEleList, pq.Array(deleteUsersReq.UserCodes))

	// Construct the query to delete rows
	query = `DELETE FROM user_details WHERE user_code = ANY($1)`

	// Execute the delete query
	err, rowsAffected = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete Users data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to delete users Data from DB", http.StatusBadRequest, nil)
		return
	}

	if rowsAffected == 0 {
		log.DBTransDebugTrace(0, "No User(s) deleted with User codes: %v", deleteUsersReq.UserCodes)
		appserver.FormAndSendHttpResp(resp, "No User(s) deleted, user(s) not present with provided user codes", http.StatusNotFound, nil)
		return
	}

	//* logic to delte users from podio

	err, _ = DeletePodioUsers(userDetailsResult)
	if err != nil {
		log.FuncInfoTrace(0, "error deleting users from podio; err: %v", err)
	}

	log.DBTransDebugTrace(0, "Total %d User(s) deleted with User codes: %v ", rowsAffected, deleteUsersReq.UserCodes)
	appserver.FormAndSendHttpResp(resp, fmt.Sprintf("Total %d User(s) from OweHub app deleted Successfully", rowsAffected), http.StatusOK, rowsAffected)
}
