/**************************************************************************
* File			: apiUpdateUsersArchive.go
* DESCRIPTION	: This file contains functions for delete users
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

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
		err            error
		deleteUsersReq models.DeleteUsers
		whereEleList   []interface{}
		query          string
		rowsAffected   int64
	)

	log.EnterFn(0, "HandleDeleteUsersRequest")
	defer func() { log.ExitFn(0, "HandleDeleteUsersRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in delete users request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from delete users request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &deleteUsersReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal delete users request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal delete users request", http.StatusBadRequest, nil)
		return
	}

	//
	// NEW LOGIC: Delete By Email
	//
	if len(deleteUsersReq.EmailIds) > 0 {

		// 1. Revoke provileges & Drop users from RowDataDB

		// fetch Admins & DB Users' db_usernames
		usersWithDbUsername, err := db.ReteriveFromDB(
			db.OweHubDbIndex,
			`SELECT
				user_details.db_username,
				user_details.email_id
			FROM 
				user_details
			INNER JOIN user_roles ON user_roles.role_id = user_details.role_id
			WHERE 
				user_roles.role_name IN ('Admin', 'DB User') 
				AND user_details.email_id = ANY($1)`,
			[]interface{}{pq.Array(deleteUsersReq.EmailIds)},
		)

		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch Admin & DB user data for deleting: %v", err)
			FormAndSendHttpResp(resp, "Failed to delete users Data from DB", http.StatusInternalServerError, nil)
			return
		}

		// store emails for users which couldnt be deleted from db.RowDataDB
		failedDeleteEmailIds := make([]string, 0)

		for _, user := range usersWithDbUsername {
			emailId := user["email_id"].(string)
			dbUsername := user["db_username"].(string)

			// Construct SQL statements to revoke privileges and drop the role (user)
			sqlStatement := fmt.Sprintf("REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s; DROP ROLE %s;", dbUsername, dbUsername)

			// Execute the SQL statement
			err := db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to revoke privileges and drop user with email: %s : %v", dbUsername, err)
				failedDeleteEmailIds = append(failedDeleteEmailIds, emailId)
			}
		}

		// 2. Delete users from OweHubDb

		emailIdsToBeDeleted := make([]string, 0) // = deleteUsersReq.EmailIds minus failedDeleteEmailIds
		authenticatedEmail := req.Context().Value("emailid").(string)

		for _, emailId := range deleteUsersReq.EmailIds {
			if !Contains(failedDeleteEmailIds, emailId) {
				emailIdsToBeDeleted = append(emailIdsToBeDeleted, emailId)
				log.FuncInfoTrace(0, "User %s is attempting to delete user %s", authenticatedEmail, emailId)
			}
		}

		// incase all users failed to be dropped
		if len(emailIdsToBeDeleted) == 0 {
			log.DBTransDebugTrace(0, "No users deleted with emails: %v", deleteUsersReq.EmailIds)
			FormAndSendHttpResp(resp, "Failed to delete users Data from DB", http.StatusInternalServerError, nil)
			return
		}

		// Construct the query to delete rows
		query = `DELETE FROM user_details WHERE email_id = ANY($1)`

		// Execute the delete query
		err, rowsAffected = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{pq.Array(emailIdsToBeDeleted)})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to delete Users data from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to delete users Data from DB", http.StatusInternalServerError, nil)
			return
		}

		if rowsAffected == 0 {
			log.DBTransDebugTrace(0, "No User(s) deleted with emails: %v", emailIdsToBeDeleted)
			FormAndSendHttpResp(resp, "No User(s) deleted, user(s) not present with provided emails", http.StatusNotFound, nil)
			return
		}

		log.DBTransDebugTrace(0, "Total %d User(s) deleted with Emails: %v", rowsAffected, emailIdsToBeDeleted)
		FormAndSendHttpResp(resp, fmt.Sprintf("Total %d User(s) deleted Successfully", rowsAffected), http.StatusOK, rowsAffected)

		return
	}

	//
	// END NEW LOGIC
	//

	if len(deleteUsersReq.UserCodes) == 0 {
		err = fmt.Errorf("User codes list is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "User codes list is empty, delete users failed", http.StatusBadRequest, nil)
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

	// Copy user codes to whereEleList
	whereEleList = append(whereEleList, pq.Array(deleteUsersReq.UserCodes))

	// Construct the query to delete rows
	query = `DELETE FROM user_details WHERE user_code = ANY($1)`

	// Execute the delete query
	err, rowsAffected = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete Users data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to delete users Data from DB", http.StatusBadRequest, nil)
		return
	}

	if rowsAffected == 0 {
		log.DBTransDebugTrace(0, "No User(s) deleted with User codes: %v", deleteUsersReq.UserCodes)
		FormAndSendHttpResp(resp, "No User(s) deleted, user(s) not present with provided user codes", http.StatusNotFound, nil)
		return
	}

	log.DBTransDebugTrace(0, "Total %d User(s) deleted with User codes: %v", rowsAffected, deleteUsersReq.UserCodes)
	FormAndSendHttpResp(resp, fmt.Sprintf("Total %d User(s) deleted Successfully", rowsAffected), http.StatusOK, rowsAffected)
}
