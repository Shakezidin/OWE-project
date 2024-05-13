/**************************************************************************
* File			: apiUpdateUser.go
* DESCRIPTION	: This file contains functions for update User
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
)

/******************************************************************************
 * FUNCTION:		HandleUpdateUserRequest
 * DESCRIPTION:     handler for update User request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateUserRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		updateUserReq   models.UpdateUserReq
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleupdateUserRequest")
	defer func() { log.ExitFn(0, "HandleupdateUserRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update User request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update User request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateUserReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update User request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update User request", http.StatusBadRequest, nil)
		return
	}

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
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if len(updateUserReq.UserCode) <= 0 {
		err = fmt.Errorf("Invalid UserCode, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid UserCode, Update failed", http.StatusBadRequest, nil)
		return
	}

	tablesPermissionsJSON, err := json.Marshal(updateUserReq.TablesPermissions)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create user, marshall error: %v", err)
		FormAndSendHttpResp(resp, "Failed to create user", http.StatusInternalServerError, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateUserReq.Name)
	//queryParameters = append(queryParameters, updateUserReq.MobileNumber)
	//queryParameters = append(queryParameters, updateUserReq.EmailId)
	//queryParameters = append(queryParameters, updateUserReq.PasswordChangeReq)
	//queryParameters = append(queryParameters, updateUserReq.ReportingManager)
	//queryParameters = append(queryParameters, updateUserReq.DealerOwner)
	//queryParameters = append(queryParameters, updateUserReq.RoleName)
	//queryParameters = append(queryParameters, updateUserReq.UserStatus)
	//queryParameters = append(queryParameters, updateUserReq.Designation)
	//queryParameters = append(queryParameters, updateUserReq.Description)
	//queryParameters = append(queryParameters, updateUserReq.Region)
	//queryParameters = append(queryParameters, updateUserReq.StreetAddress)
	//queryParameters = append(queryParameters, updateUserReq.State)
	//queryParameters = append(queryParameters, updateUserReq.City)
	//queryParameters = append(queryParameters, updateUserReq.Zipcode)
	//queryParameters = append(queryParameters, updateUserReq.Country)
	queryParameters = append(queryParameters, tablesPermissionsJSON)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateUserFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update User in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update User", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "User updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "User Updated Successfully", http.StatusOK, nil)
}
