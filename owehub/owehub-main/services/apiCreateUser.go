/**************************************************************************
 * File       	   : apiCreateUser.go
 * DESCRIPTION     : This file contains functions for create user handler
 * DATE            : 20-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strconv"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleCreateUserRequest
* DESCRIPTION:     handler for create user request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleCreateUserRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		createUserReq         models.CreateUserReq
		queryParameters       []interface{}
		tablesPermissionsJSON []byte
		username              string
		usernamePrefix        string
		nameAssignedCheck     bool
	)

	log.EnterFn(0, "HandleCreateUserRequest")
	defer func() { log.ExitFn(0, "HandleCreateUserRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create user request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create user request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createUserReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create user request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create user request", http.StatusBadRequest, nil)
		return
	}

	if (len(createUserReq.Name) <= 0) || (len(createUserReq.EmailId) <= 0) ||
		(len(createUserReq.MobileNumber) <= 0) || (len(createUserReq.Designation) <= 0) ||
		(len(createUserReq.RoleName) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	createUserReq.Password = "Welcome@123"
	createUserReq.PasswordChangeReq = true

	if createUserReq.TablesPermissions != nil {
		tablesPermissionsJSON, err = json.Marshal(createUserReq.TablesPermissions)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to marshall table permission while create user,  err: %v", err)
			FormAndSendHttpResp(resp, "Failed to marshall table permissions", http.StatusBadRequest, nil)
			return
		}
	}

	hashedPassBytes, err := GenerateHashPassword(createUserReq.Password)
	if err != nil || hashedPassBytes == nil {
		log.FuncErrorTrace(0, "Failed to hash the password err: %v", err)
		FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
		return
	}

	/**
			If the user role is "DB User" or "Admin"
			this if condition statements helps in
			creating the database user
			and granting privileges
	 	**/
	if createUserReq.RoleName == "DB User" || createUserReq.RoleName == "Admin" {
		// this takes the name of the user entered
		nameParts := strings.Fields(createUserReq.Name)
		if len(nameParts) >= 2 {
			// this joins the different names using '_'
			usernamePrefix = strings.Join(nameParts[0:2], "_")
		} else {
			usernamePrefix = nameParts[0]
		}

		// this fetches the db username
		dbQuery := `select * from pg_user order by usename desc`
		data, err := db.ReteriveFromDB(db.RowDataDBIndex, dbQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get new form data for table name from DB err: %v", err)
			FormAndSendHttpResp(resp, "Failed to get Data", http.StatusBadRequest, nil)
			return
		}

		for _, item := range data {
			Nam, ok := item["usename"].([]byte)
			if !ok {
				continue
			}
			Name := string(Nam)
			dbName := getNameWithoutNumber(Name)

			usernamePrefix = strings.ToLower(usernamePrefix)
			if dbName == usernamePrefix {
				no, _ := getNumberAfterSecondUnderscore(Name)
				username = fmt.Sprintf("%s_%d", usernamePrefix, no+1)
				username = strings.ToLower(username)
				nameAssignedCheck = true
				break
			}
		}

		if !nameAssignedCheck {
			username = fmt.Sprintf("%s_%d", usernamePrefix, 1)
			username = strings.ToLower(username)
		}

		sqlStatement := fmt.Sprintf("CREATE USER %s WITH LOGIN PASSWORD '%s';", username, createUserReq.Password)
		err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
		log.FuncErrorTrace(0, " sqlStatement err %+v", err)
		log.FuncErrorTrace(0, "sqlStatement %v", sqlStatement)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create user already exists: %v", err)
			FormAndSendHttpResp(resp, "Failed, User already exist in db user", http.StatusInternalServerError, nil)
			return
		}

		log.FuncErrorTrace(0, "createUserReq.TablesPermissions %+v", createUserReq.TablesPermissions)
		for _, item := range createUserReq.TablesPermissions {
			switch item.PrivilegeType {
			case "View":
				sqlStatement = fmt.Sprintf("GRANT SELECT ON %s TO %s;", item.TableName, username)
			case "Edit":
				sqlStatement = fmt.Sprintf("GRANT SELECT, UPDATE ON %s TO %s;", item.TableName, username)
			case "Full":
				sqlStatement = fmt.Sprintf("GRANT ALL PRIVILEGES ON %s TO %s;", item.TableName, username)
			}

			log.FuncErrorTrace(0, "sqlStatement %v", sqlStatement)

			err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
			log.FuncErrorTrace(0, " sqlStatement err %+v", err)
			if err != nil {
				dropErr := db.ExecQueryDB(db.RowDataDBIndex, fmt.Sprintf("DROP USER %s;", username))
				if dropErr != nil {
					log.FuncErrorTrace(0, "Failed to drop user after failed privilege grant: %v", dropErr)
					FormAndSendHttpResp(resp, "Failed to drop user after failed privilege", http.StatusInternalServerError, nil)
					return
				}
				log.FuncErrorTrace(0, "Failed to create user while adding privilges err: %v", err)
				FormAndSendHttpResp(resp, "Failed to create privilages for user", http.StatusInternalServerError, nil)
				return
			}
		}
	}

	queryParameters = append(queryParameters, createUserReq.Name)
	queryParameters = append(queryParameters, username)
	queryParameters = append(queryParameters, createUserReq.MobileNumber)
	queryParameters = append(queryParameters, strings.ToLower(createUserReq.EmailId))
	queryParameters = append(queryParameters, string(hashedPassBytes))
	queryParameters = append(queryParameters, createUserReq.PasswordChangeReq)
	queryParameters = append(queryParameters, createUserReq.ReportingManager)
	queryParameters = append(queryParameters, createUserReq.DealerOwner)
	queryParameters = append(queryParameters, createUserReq.RoleName)
	queryParameters = append(queryParameters, createUserReq.UserStatus)
	queryParameters = append(queryParameters, createUserReq.Designation)
	queryParameters = append(queryParameters, createUserReq.Description)
	queryParameters = append(queryParameters, createUserReq.Region)
	queryParameters = append(queryParameters, createUserReq.StreetAddress)
	queryParameters = append(queryParameters, createUserReq.State)
	queryParameters = append(queryParameters, createUserReq.City)
	queryParameters = append(queryParameters, createUserReq.Zipcode)
	queryParameters = append(queryParameters, createUserReq.Country)
	queryParameters = append(queryParameters, createUserReq.TeamName)
	queryParameters = append(queryParameters, createUserReq.Dealer)
	queryParameters = append(queryParameters, createUserReq.DealerLogo)
	queryParameters = append(queryParameters, tablesPermissionsJSON)

	// Call the stored procedure or function to create the user
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateUserFunction, queryParameters)
	if err != nil {
		// dropErr := db.ExecQueryDB(db.RowDataDBIndex, fmt.Sprintf("REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM '%s';", username))
		dropErr := db.ExecQueryDB(db.RowDataDBIndex, fmt.Sprintf("DROP USER %s;", username))
		if dropErr != nil {
			log.FuncErrorTrace(0, "Failed to revoke privileges and drop user %s: %v", username, dropErr)
			// Handle the error as needed, such as logging or returning an HTTP response
		} else {
			log.FuncErrorTrace(0, "Successfully revoked privileges and dropped user %s", username)
			// Optionally, you can log a success message or perform additional actions
		}
		// Handle the error
		if strings.Contains(err.Error(), "User with email") {
			// Handle the case where provided user data violates unique constraint
			log.FuncErrorTrace(0, "Failed to Add User in DB with err: %v", err)
			FormAndSendHttpResp(resp, "Failed to Add User, provided user details email id or mobile number already exist.", http.StatusConflict, nil)
			return
		}
		// Handle other errors
		log.FuncErrorTrace(0, "Failed to Add User in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create User in Database due to internal error.", http.StatusInternalServerError, nil)
		return
	}
	// Send email to client
	err = SendMailToClient(createUserReq.EmailId, createUserReq.Name)
	if err != nil {
		// Log the error, but continue processing
		log.FuncErrorTrace(0, "Failed to send email with err: %v", err)
	}

	// Send HTTP response
	FormAndSendHttpResp(resp, "User Created Successfully", http.StatusOK, nil)
}

func getNumberAfterSecondUnderscore(s string) (int, error) {
	parts := strings.Split(s, "_")
	if len(parts) < 3 {
		return 0, fmt.Errorf("string doesn't contain at least two underscores")
	}
	numStr := parts[2]
	num, err := strconv.Atoi(numStr)
	if err != nil {
		return 0, err
	}
	return num, nil
}

func getNameWithoutNumber(s string) string {
	parts := strings.Split(s, "_")
	if len(parts) < 3 {
		return s // Return original string if it doesn't contain at least two underscores
	}
	return strings.Join(parts[:2], "_")
}
