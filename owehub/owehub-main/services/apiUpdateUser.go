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
* FUNCTION:					HandleUpdateUserRequest
* DESCRIPTION:      Handler for update user request
* INPUT:						resp, req
* RETURNS:    			void
******************************************************************************/
func HandleUpdateUserRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		updateUserReq         models.UpdateUserReq
		queryParameters       []interface{}
		tablesPermissionsJSON []byte
		prevUserData          map[string]interface{}
		username              string
	)

	log.EnterFn(0, "HandleUpdateUserRequest")
	defer func() { log.ExitFn(0, "HandleUpdateUserRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update user request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update user request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateUserReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update user request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update user request", http.StatusBadRequest, nil)
		return
	}

	emailId := updateUserReq.EmailId
	prevUserQuery := fmt.Sprintf(`
        SELECT ud.*, ur.role_name 
        FROM user_details ud 
        JOIN user_roles ur ON ud.role_id = ur.role_id 
        WHERE ud.email_id = $1
    `)
	prevData, err := db.ReteriveFromDB(db.OweHubDbIndex, prevUserQuery, []interface{}{emailId})
	if err != nil || len(prevData) == 0 {
		log.FuncErrorTrace(0, "Failed to get previous user data: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve user details", http.StatusInternalServerError, nil)
		return
	}
	prevUserData = prevData[0]
	/*****************************************************************************************************
																			| Transaction Starts Here |
	*****************************************************************************************************/
	tx, err := db.StartTransaction(db.OweHubDbIndex)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to start transaction: %v", err)
		appserver.FormAndSendHttpResp(resp, "Internal server error", http.StatusInternalServerError, nil)
		return
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		} else if err != nil {
			tx.Rollback()
		}
	}()

	if updateUserReq.TablesPermissions != nil {
		tablesPermissionsJSON, err = json.Marshal(updateUserReq.TablesPermissions)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to marshal table permissions: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to process table permissions", http.StatusBadRequest, nil)
			return
		}
	}

	username = fmt.Sprintf("OWE_%s", emailId)
	prevRole := prevUserData["role_name"].(string)
	isNewDBRole := updateUserReq.RoleName == "DB User" || updateUserReq.RoleName == "Admin"
	wasPrevDBRole := prevRole == "DB User" || prevRole == "Admin"
	prevPassword, ok := prevUserData["password"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get prev password: %v", err)
		appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
		return
	}
	prevUserCode, ok := prevUserData["user_code"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get prev usercode: %v", err)
		appserver.FormAndSendHttpResp(resp, "Something is not right!", http.StatusBadRequest, nil)
		return
	}

	var dbUsername string
	if updateUserReq.RoleName == "DB User" || updateUserReq.RoleName == "Admin" {
		dbUsername = username
	}

	queryParameters = append(queryParameters,
		updateUserReq.Name,
		dbUsername,
		updateUserReq.MobileNumber,
		emailId,
		prevPassword, // Use previous password
		false,
		updateUserReq.ReportingManager,
		updateUserReq.DealerOwner,
		updateUserReq.RoleName,
		updateUserReq.UserStatus,
		updateUserReq.Designation,
		updateUserReq.Description,
		updateUserReq.Region,
		updateUserReq.StreetAddress,
		updateUserReq.State,
		updateUserReq.City,
		updateUserReq.Zipcode,
		updateUserReq.Country,
		updateUserReq.TeamName,
		updateUserReq.Dealer,
		updateUserReq.DealerLogo,
		false,
		tablesPermissionsJSON,
		prevUserCode,
	)

	deleteQuery := "DELETE FROM user_details WHERE email_id = $1"
	_, err = tx.Exec(deleteQuery, emailId)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete existing user: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update user", http.StatusInternalServerError, nil)
		return
	}

	_, err = db.CallDBFunctionWithTx(tx, db.UpdateExistingUser, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create updated user: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update user", http.StatusInternalServerError, nil)
		return
	}

	switch {
	/*
		If the new role is DB User or Admin and previous role was not in that case we create a new db user
	*/
	case isNewDBRole && !wasPrevDBRole:
		if err := handleDBUserCreation(username, updateUserReq.TablesPermissions); err != nil {
			log.FuncErrorTrace(0, "Failed to create DB user: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to create database user", http.StatusInternalServerError, nil)
			return
		}

	case !isNewDBRole && wasPrevDBRole:
		/*
			If the new role is not DB User or Admin and previous role was in that case we delete db user
		*/
		if err := handleDBUserDeletion(username); err != nil {
			log.FuncErrorTrace(0, "Failed to delete DB user: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to remove database user", http.StatusInternalServerError, nil)
			return
		}

	case isNewDBRole && wasPrevDBRole:
		/*
			If the new role is  DB User or Admin and previous role also is, in that case we update db user permission
		*/
		if err := handleDBUserPermissionUpdate(username, updateUserReq.TablesPermissions, updateUserReq.RevokeTablePermission); err != nil {
			log.FuncErrorTrace(0, "Failed to update DB user permissions: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update database permissions", http.StatusInternalServerError, nil)
			return
		}
	}

	/*****************************************************************************************************
																			| Transaction Ends Here |
	*****************************************************************************************************/
	err = tx.Commit()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to commit transaction: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to complete user update", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, fmt.Sprintf("User %s updated successfully", emailId), http.StatusOK, nil)
}

func handleDBUserCreation(username string, permissions []models.TablePermission) error {
	if err := CreateDBUser(username, "Welcome@123"); err != nil {
		return fmt.Errorf("failed to create DB user: %v", err)
	}
	if err := grantPermissions(username, permissions); err != nil {
		if dropErr := DeleteDBUser(username); dropErr != nil {
			log.FuncErrorTrace(0, "Failed to cleanup after permission grant failure: %v", dropErr)
		}
		return fmt.Errorf("failed to grant permissions: %v", err)
	}
	return nil
}

func handleDBUserDeletion(username string) error {
	return DeleteDBUser(username)
}

func handleDBUserPermissionUpdate(username string, newPermissions []models.TablePermission, revokePermissions []models.TablePermission) error {
	if err := revokeAllTablePermissions(username, revokePermissions); err != nil {
		return fmt.Errorf("failed to revoke permissions: %v", err)
	}
	if err := grantPermissions(username, newPermissions); err != nil {
		return fmt.Errorf("failed to grant new permissions: %v", err)
	}
	return nil
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
