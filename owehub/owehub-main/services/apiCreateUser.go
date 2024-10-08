/**************************************************************************
 * File       	   : apiCreateUser.go
 * DESCRIPTION     : This file contains functions for create user handler
 * DATE            : 20-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
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
		podioError            error
		createUserReq         models.CreateUserReq
		queryParameters       []interface{}
		tablesPermissionsJSON []byte
		dbUserCheck           []map[string]interface{}
		username              string
	)

	log.EnterFn(0, "HandleCreateUserRequest")
	defer func() { log.ExitFn(0, "HandleCreateUserRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create user request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create user request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createUserReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create user request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create user request", http.StatusBadRequest, nil)
		return
	}

	// setup user info logging
	// logUserApi, closeUserLog := initUserApiLogging(req)
	// defer func() { closeUserLog(err) }()

	if (len(createUserReq.Name) <= 0) || (len(createUserReq.EmailId) <= 0) ||
		(len(createUserReq.MobileNumber) <= 0) || (len(createUserReq.Designation) <= 0) ||
		(len(createUserReq.RoleName) <= 0) {
		err = fmt.Errorf("empty input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	createUserReq.Password = "Welcome@123"
	createUserReq.PasswordChangeReq = true

	if createUserReq.TablesPermissions != nil {
		tablesPermissionsJSON, err = json.Marshal(createUserReq.TablesPermissions)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to marshall table permission while create user,  err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to marshall table permissions", http.StatusBadRequest, nil)
			return
		}
	}

	hashedPassBytes, err := GenerateHashPassword(createUserReq.Password)
	if err != nil || hashedPassBytes == nil {
		log.FuncErrorTrace(0, "Failed to hash the password err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
		return
	}

	userEmail, _ := req.Context().Value("emailid").(string)
	role, _ := req.Context().Value("rolename").(string)

	if role == "Dealer Owner" {
		query := fmt.Sprintf("SELECT vd.sales_partner_name FROM user_details ud JOIN sales_partner_dbhub_schema vd ON ud.dealer_id = vd.partner_id WHERE ud.email_id = '%v'", userEmail)
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get adjustments data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get adjustments data from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			DealerName, dealerNameOk := data[0]["dealer_name"].(string)
			if !dealerNameOk || DealerName == "" {
				log.FuncErrorTrace(0, "empty dealer name")
				appserver.FormAndSendHttpResp(resp, "Failed to get the dealer name, empty dealer name", http.StatusInternalServerError, nil)
				return
			}
			createUserReq.Dealer = DealerName
		}
	}

	if createUserReq.RoleName != string(types.RoleAccountExecutive) &&
		createUserReq.RoleName != string(types.RoleAccountManager) &&
		createUserReq.RoleName != string(types.RoleAdmin) &&
		createUserReq.RoleName != string(types.RoleFinAdmin) &&
		createUserReq.RoleName != string(types.RoleDbUser) &&
		createUserReq.Dealer == "" {

		log.FuncErrorTrace(0, "dealer name can't be null")
		appserver.FormAndSendHttpResp(resp, "Dealer name can't be null for dealer owner", http.StatusBadRequest, nil)
		return
	}

	/**
			If the user role is "DB User" or "Admin"
			this if condition statements helps in
			creating the database user
			and granting privileges
	 	**/
	if createUserReq.RoleName == "DB User" || createUserReq.RoleName == "Admin" {
		if len(createUserReq.TablesPermissions) > 0 {
			// retrieve db username from mobile number
			username = fmt.Sprintf("OWE_%s", createUserReq.MobileNumber)

			// make sure that user with username doesnt already exist
			dbUserCheckQuery := "SELECT count(*) FROM PG_USER WHERE USENAME = $1"
			dbUserCheckParams := []interface{}{username}
			dbUserCheck, err = db.ReteriveFromDB(db.RowDataDBIndex, dbUserCheckQuery, dbUserCheckParams)

			if err != nil {
				log.FuncErrorTrace(0, "Failed to get user name count from DB err: %v", err)
				appserver.FormAndSendHttpResp(resp, "Failed to validate db username", http.StatusInternalServerError, nil)
				return
			}

			dbUserCount, dbUserCountOk := dbUserCheck[0]["count"].(int64)
			if !dbUserCountOk {
				err = fmt.Errorf("Failed to assert db user count from type: %T", dbUserCheck[0]["count"])
				log.FuncErrorTrace(0, "%v", err)
				appserver.FormAndSendHttpResp(resp, "Failed to validate db username", http.StatusInternalServerError, nil)
				return
			}

			if dbUserCount != 0 {
				err = fmt.Errorf("duplicate mobile number provided")
				log.FuncErrorTrace(0, "%v", err)
				appserver.FormAndSendHttpResp(resp, "Mobile number already taken", http.StatusBadRequest, nil)
				return
			}

			sqlStatement := fmt.Sprintf("CREATE USER %s WITH LOGIN PASSWORD '%s';", username, createUserReq.Password)
			err = db.ExecQueryDB(db.RowDataDBIndex, sqlStatement)
			log.FuncErrorTrace(0, " sqlStatement err %+v", err)
			log.FuncErrorTrace(0, "sqlStatement %v", sqlStatement)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to create user already exists: %v", err)
				appserver.FormAndSendHttpResp(resp, "Failed, User already exist in db user", http.StatusInternalServerError, nil)
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
					dropQuery := fmt.Sprintf("REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s; DROP USER %s;", username, username)
					dropErr := db.ExecQueryDB(db.RowDataDBIndex, dropQuery)

					if dropErr != nil {
						log.FuncErrorTrace(0, "Failed to drop user after failed privilege grant: %v", dropErr)
						appserver.FormAndSendHttpResp(resp, "Failed to drop user after failed privilege", http.StatusInternalServerError, nil)
						return
					}
					log.FuncErrorTrace(0, "Failed to create user while adding privilges err: %v", err)
					appserver.FormAndSendHttpResp(resp, "Failed to create privilages for user", http.StatusInternalServerError, nil)
					return
				}
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
	queryParameters = append(queryParameters, createUserReq.AddToPodio)
	queryParameters = append(queryParameters, tablesPermissionsJSON)

	// Call the stored procedure or function to create the user
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateUserFunction, queryParameters)
	if err != nil {
		//  Drop roles from db.RowDataDBIndex if created (incase of DB User & Admin)
		if createUserReq.RoleName == "DB User" || createUserReq.RoleName == "Admin" {
			dropQuery := fmt.Sprintf("REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM %s; DROP USER %s;", username, username)
			dropErr := db.ExecQueryDB(db.RowDataDBIndex, dropQuery)

			if dropErr != nil {
				log.FuncErrorTrace(0, "Failed to revoke privileges and drop user %s: %v", username, dropErr)
			} else {
				log.FuncErrorTrace(0, "Successfully revoked privileges and dropped user %s", username)
			}
		}
		// Handle the error
		if strings.Contains(err.Error(), "User with email") {
			// Handle the case where provided user data violates unique constraint
			log.FuncErrorTrace(0, "Failed to Add User in DB with err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to Add User, provided user details email id or mobile number already exist.", http.StatusConflict, nil)
			return
		}
		// Handle other errors
		log.FuncErrorTrace(0, "Failed to Add User in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create User in Database due to internal error.", http.StatusInternalServerError, nil)
		return
	}

	// records inserted user in user logs
	if createUserReq.RoleName == "DB User" || createUserReq.RoleName == "Admin" {
		tablePermissionStringParts := make([]string, len(createUserReq.TablesPermissions))
		for i, perm := range createUserReq.TablesPermissions {
			tablePermissionStringParts[i] = fmt.Sprintf("%s(%s)", perm.TableName, strings.ToLower(perm.PrivilegeType))
		}

		// details := map[string]string{
		// 	"email_id":          createUserReq.EmailId,
		// 	"name":              createUserReq.Name,
		// 	"mobile_number":     createUserReq.MobileNumber,
		// 	"table_permissions": strings.Join(tablePermissionStringParts, ", "),
		// 	"db_username":       username,
		// }
		// logUserApi(fmt.Sprintf("Created user %s in owehubdb and owedb - %+v", createUserReq.EmailId, details))
	} else {
		// details := map[string]string{
		// 	"email_id":      createUserReq.EmailId,
		// 	"name":          createUserReq.Name,
		// 	"mobile_number": createUserReq.MobileNumber,
		// }
		// logUserApi(fmt.Sprintf("Created user %s in owehubdb - %+v", createUserReq.EmailId, details))
	}

	//* logic to create / update user to podio
	if createUserReq.AddToPodio {
		podioError = HandleCreatePodioDataRequest(createUserReq, createUserReq.RoleName)
		if podioError != nil {
			log.FuncErrorTrace(0, "%v", podioError)
		}
	}

	// Send email to client
	err = SendMailToClient(createUserReq.EmailId, createUserReq.Name)
	if err != nil {
		// Log the error, but continue processing
		log.FuncErrorTrace(0, "Failed to send email with err: %v", err)
	}

	// Send HTTP response
	if podioError != nil && createUserReq.AddToPodio {
		appserver.FormAndSendHttpResp(
			resp,
			fmt.Sprintf("User Created Successfully, Failed to create in podio; err: %v", podioError),
			http.StatusOK,
			nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "User Created Successfully", http.StatusOK, nil)
}
