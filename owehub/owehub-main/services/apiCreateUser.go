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
		err             error
		createUserReq   models.CreateUserReq
		queryParameters []interface{}
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
		(len(createUserReq.MobileNumber) <= 0) ||
		//(len(createUserReq.Password) <= 0) ||
		(len(createUserReq.Designation) <= 0) || (len(createUserReq.RoleName) <= 0) {
		//(len(createUserReq.UserCode) <= 0) ||
		//(len(createUserReq.ReportingManager) <= 0) ||
		//(len(createUserReq.UserStatus) <= 0) ||
		//(len(createUserReq.Description) <= 0) ||
		//(len(createUserReq.DealerOwner) <= 0) {
		//(len(createUserReq.StreetAddress) <= 0) ||
		//(len(createUserReq.State) <= 0) || (len(createUserReq.City) <= 0) ||
		//(len(createUserReq.Zipcode) <= 0) || (len(createUserReq.Country) <= 0){
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	createUserReq.Password = "Welcome@123"
	createUserReq.PasswordChangeReq = true
	//createUserReq.StreetAddress = ""
	//createUserReq.State = ""
	//createUserReq.City = ""
	//createUserReq.Zipcode = ""
	//createUserReq.Country = ""

	hashedPassBytes, err := GenerateHashPassword(createUserReq.Password)
	if err != nil || hashedPassBytes == nil {
		log.FuncErrorTrace(0, "Failed to hash the password err: %v", err)
		FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
		return
	}

	// TODO RoleName JAY
	if createUserReq.RoleName == "SubDealer Owner" {
		// Join selected parts with underscores
		// TODO
		username := strings.Join(strings.Fields(createUserReq.Name)[0:2], "_")

		// query
		sqlStatement := fmt.Sprintf("CREATE USER %s WITH LOGIN PASSWORD '%s';", username, createUserReq.Password)
		err = db.ExecQueryDB(sqlStatement)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create user already exists: %v", err)
			FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
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

			err = db.ExecQueryDB(sqlStatement)
			log.FuncErrorTrace(0, " sqlStatement err %+v", err)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to create user already exists: %v", err)
				FormAndSendHttpResp(resp, "Failed to process the password", http.StatusInternalServerError, nil)
				return
			}
		}
	}

	queryParameters = append(queryParameters, createUserReq.Name)
	queryParameters = append(queryParameters, createUserReq.MobileNumber)
	queryParameters = append(queryParameters, createUserReq.EmailId)
	queryParameters = append(queryParameters, string(hashedPassBytes))
	queryParameters = append(queryParameters, createUserReq.PasswordChangeReq)
	queryParameters = append(queryParameters, createUserReq.ReportingManager)
	queryParameters = append(queryParameters, createUserReq.DealerOwner)
	queryParameters = append(queryParameters, createUserReq.RoleName)
	queryParameters = append(queryParameters, createUserReq.UserStatus)
	queryParameters = append(queryParameters, createUserReq.Designation)
	queryParameters = append(queryParameters, createUserReq.Description)
	queryParameters = append(queryParameters, createUserReq.StreetAddress)
	queryParameters = append(queryParameters, createUserReq.State)
	queryParameters = append(queryParameters, createUserReq.City)
	queryParameters = append(queryParameters, createUserReq.Zipcode)
	queryParameters = append(queryParameters, createUserReq.Country)

	_, err = db.CallDBFunction(db.CreateUserFunction, queryParameters)
	if err != nil {
		// Check if the error message contains "User with email"
		if strings.Contains(err.Error(), "User with email") {
			// Handle the case where provided user data violates unique constraint
			log.FuncErrorTrace(0, "Failed to Add User in DB with err: %v", err)
			FormAndSendHttpResp(resp, "Failed to Add User, provided user details email id or mobile number already exist.", http.StatusConflict, nil)
			return
		}
		// Handle other errors
		log.FuncErrorTrace(0, "Failed to Add User in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create User", http.StatusInternalServerError, nil)
		return
	}

	err = SendMailToClient(createUserReq.EmailId, createUserReq.Name)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to sent email with err: %v", err)
	}

	FormAndSendHttpResp(resp, "User Created Successfully", http.StatusOK, nil)
}
