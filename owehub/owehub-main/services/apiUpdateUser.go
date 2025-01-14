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
		tablesPermissionsJSON []byte
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

	if len(updateUserReq.EmailId) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
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

	prevDataQuery := fmt.Sprintf(`SELECT * FROM user_details WHERE email_id = '%v'`, updateUserReq.EmailId)
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, prevDataQuery, nil)
	if err != nil || len(data) == 0 {
		log.FuncErrorTrace(0, "failed to get the mobile number from db, email: %v, err: %v", updateUserReq.EmailId, err)
		appserver.FormAndSendHttpResp(resp, "Something is not right", http.StatusInternalServerError, nil)
		return
	}

	username := fmt.Sprintf("OWE_%s", updateUserReq.EmailId)
	prevRole, err := getUserRole(updateUserReq.EmailId)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get previous role for user %s: %v", updateUserReq.EmailId, err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve user details", http.StatusInternalServerError, nil)
		return
	}

	isDBRole := updateUserReq.RoleName == "DB User" || updateUserReq.RoleName == "Admin"
	wasPrevDBRole := prevRole == "DB User" || prevRole == "Admin"

	if updateUserReq.TablesPermissions != nil {
		tablesPermissionsJSON, err = json.Marshal(updateUserReq.TablesPermissions)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to marshall table permission while create user,  err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
			return
		}
	}

	/*
		Transaction starts here
	*/
	tx, err := db.StartTransaction(db.OweHubDbIndex)
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else if err != nil {
			tx.Rollback()
		}
	}()
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateUserReq.Name)
	queryParameters = append(queryParameters, updateUserReq.MobileNumber)
	queryParameters = append(queryParameters, updateUserReq.EmailId)
	queryParameters = append(queryParameters, updateUserReq.PasswordChangeReq)
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

	result, err := db.CallDBFunction(db.OweHubDbIndex, db.UpdateUserFunction, queryParameters)
	if err != nil || len(result) == 0 {
		log.FuncErrorTrace(0, "Failed to Update User in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update User in Database due to internal error.", http.StatusInternalServerError, nil)
		return
	}

	switch {
	case isDBRole && !wasPrevDBRole:
		if err := CreateDBUser(username, "Welcome@123"); err != nil {
			tx.Rollback()
			log.FuncErrorTrace(0, "Failed to create DB user %s: %v", username, err)
			appserver.FormAndSendHttpResp(resp, "Error creating database user", http.StatusInternalServerError, nil)
			return
		}

		if err := grantPermissions(username, updateUserReq.TablesPermissions); err != nil {
			log.FuncErrorTrace(0, "Failed to grant initial permissions for new user %s: %v", username, err)
			if dropErr := DeleteDBUser(username); dropErr != nil {
				tx.Rollback()
				log.FuncErrorTrace(0, "Failed to cleanup user after permission grant failure %s: %v", username, dropErr)
			}
			appserver.FormAndSendHttpResp(resp, "Error setting user permissions", http.StatusInternalServerError, nil)
			return
		}
		updateUserReq.PasswordChangeReq = true

	case !isDBRole && wasPrevDBRole:
		if err := DeleteDBUser(username); err != nil {
			tx.Rollback()
			log.FuncErrorTrace(0, "Failed to delete DB user %s: %v", username, err)
			appserver.FormAndSendHttpResp(resp, "Error removing database user", http.StatusInternalServerError, nil)
			return
		}
		return

	case isDBRole && wasPrevDBRole:
		if err := revokeAllTablePermissions(username, updateUserReq.RevokeTablePermission); err != nil {
			tx.Rollback()
			log.FuncErrorTrace(0, "Failed to revoke permissions for user %s: %v", username, err)
			appserver.FormAndSendHttpResp(resp, "Error updating user permissions", http.StatusInternalServerError, nil)
			return
		}

		if err := grantPermissions(username, updateUserReq.TablesPermissions); err != nil {
			tx.Rollback()
			log.FuncErrorTrace(0, "Failed to grant permissions for user %s: %v", username, err)
			appserver.FormAndSendHttpResp(resp, "Error updating user permissions", http.StatusInternalServerError, nil)
			return
		}
	}
	/*
		Transaction commits here
		if any of the grant or revoke db user
		fails we have assed rollback for those
		conditions, if none is hit its committed
	*/
	tx.Commit()

	appserver.FormAndSendHttpResp(resp, fmt.Sprintf("User %v Updated Successfully", updateUserReq.EmailId), http.StatusOK, nil)
}

/* Function to get the users previous data */
func getUserRole(emailID string) (string, error) {
	query := `SELECT role FROM user_details WHERE email_id = $1`
	params := []interface{}{emailID}
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, params)
	if err != nil || len(data) == 0 {
		return "", fmt.Errorf("failed to get user role: %v", err)
	}
	role, ok := data[0]["role"].(string)
	if !ok {
		return "", fmt.Errorf("invalid role type in result")
	}
	return role, nil
}

/* Function to creaye user if user does not exists in db */
func CreateDBUser(username, password string) error {
	sqlStatement := fmt.Sprintf("CREATE USER %s WITH LOGIN PASSWORD '%s';", username, password)
	err := db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create DB user %s: %v", username, err)
		return err
	}
	log.FuncInfoTrace(0, "Successfully created DB user: %s", username)
	return nil
}

/* Function to delete user if user exists in db */
func DeleteDBUser(username string) error {
	exists, err := checkDBUserExists(username)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to check DB user existence %s: %v", username, err)
		return fmt.Errorf("failed to check user existence: %v", err)
	}
	if !exists {
		log.FuncInfoTrace(0, "DB user %s does not exist, skipping deletion", username)
		return nil
	}

	err = dropDBUser(username)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to drop DB user %s: %v", username, err)
	}
	return err
}

/* Function to check if user exists in db */
func checkDBUserExists(username string) (bool, error) {
	query := "SELECT count(*) FROM pg_user WHERE usename = $1"
	params := []interface{}{username}
	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, params)
	if err != nil {
		return false, err
	}
	count, ok := data[0]["count"].(int64)
	if !ok {
		return false, fmt.Errorf("invalid count type in result")
	}
	return count > 0, nil
}

/* Function to drop user from db */
func dropDBUser(username string) error {
	dropQuery := fmt.Sprintf("REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s; DROP USER IF EXISTS %s",
		username, username)
	return db.ExecQueryDB(db.RowDataDBIndex, dropQuery)
}

/* Function to revoke permission to the user */
func revokeAllTablePermissions(username string, tables []models.TablePermission) error {
	for _, table := range tables {
		sqlStatement := fmt.Sprintf("REVOKE ALL PRIVILEGES ON %s FROM %s", table.TableName, username)
		if err := db.ExecQueryDB(db.RowDataDBIndex, sqlStatement); err != nil {
			log.FuncErrorTrace(0, "Failed to revoke permissions for table %s from user %s: %v",
				table.TableName, username, err)
			return fmt.Errorf("failed to revoke permissions on table %s: %v", table.TableName, err)
		}
	}
	log.FuncInfoTrace(0, "Successfully revoked permissions for user %s", username)
	return nil
}

/* Function to grant permission to the user */
func grantPermissions(username string, permissions []models.TablePermission) error {
	for _, perm := range permissions {
		var sqlStatement string
		switch perm.PrivilegeType {
		case "View":
			sqlStatement = fmt.Sprintf("GRANT SELECT ON %s TO %s", perm.TableName, username)
		case "Edit":
			sqlStatement = fmt.Sprintf("GRANT SELECT, UPDATE ON %s TO %s", perm.TableName, username)
		case "Full":
			sqlStatement = fmt.Sprintf("GRANT ALL PRIVILEGES ON %s TO %s", perm.TableName, username)
		default:
			return fmt.Errorf("invalid privilege type: %s", perm.PrivilegeType)
		}

		if err := db.ExecQueryDB(db.RowDataDBIndex, sqlStatement); err != nil {
			log.FuncErrorTrace(0, "Failed to grant %s permission on table %s to user %s: %v",
				perm.PrivilegeType, perm.TableName, username, err)
			return err
		}
	}
	log.FuncInfoTrace(0, "Successfully granted permissions for user %s", username)
	return nil
}

// // prevPhon := data[0]["mobile_number"].(string)
// prevRole := data[0]["role"].(string)
// username := fmt.Sprintf("OWE_%s", updateUserReq.EmailId)

// // if role is changed to admin / DB User
// // if role is changed from admin / DB User
// if updateUserReq.RoleName == "DB User" || updateUserReq.RoleName == "Admin" {
// 	if prevRole != "DB User" || prevRole != "Admin" {
// 		//* for new users let it be default pswrd with an option to change after
// 		err = CreateDBUser(username, "Welcome@123")
// 		if err != nil {
// 			log.FuncInfoTrace(0, "error updating user, err: %v, email: %v", err, updateUserReq.EmailId)
// 			appserver.FormAndSendHttpResp(resp, "Error Updating User in Database due to internal error.", http.StatusInternalServerError, nil)
// 			return
// 		}
// 	}
// 	/*
// 		This will remove permissions and grant permissions
// 	*/
// 	revokeAllTablePermissions(username, updateUserReq.RevokeTablePermission)
// 	grantPermissions(userName, updateUserReq.TablesPermissions)
// } else if prevRole == "DB User" || prevRole == "Admin" {
// 	if updateUserReq.RoleName != "DB User" || updateUserReq.RoleName != "Admin" {
// 		err = DeleteDBUser(username)
// 		if err != nil {
// 			log.FuncInfoTrace(0, "error updating user, err: %v, email: %v", err, updateUserReq.EmailId)
// 			appserver.FormAndSendHttpResp(resp, "Error Updating User in Database due to internal error.", http.StatusInternalServerError, nil)
// 			return
// 		}
// 	} else {
// 		revokeAllTablePermissions(username, updateUserReq.RevokeTablePermission)
// 		err = grantPermissions(userName, updateUserReq.TablesPermissions)
// 		if err != nil {
// 			log.FuncInfoTrace(0, "error updating user, err: %v, email: %v", err, updateUserReq.EmailId)
// 			appserver.FormAndSendHttpResp(resp, "Error Updating User in Database due to internal error.", http.StatusInternalServerError, nil)
// 			return
// 		}
// 	}
// }