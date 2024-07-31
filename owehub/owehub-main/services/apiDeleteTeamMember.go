/**************************************************************************
 * File       	   : apiDeleteTeamMember.go
 * DESCRIPTION     : This file contains functions for delete team member handler
 * DATE            : 22-Jan-2024
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
 * FUNCTION:		HandleDeleteTeamMemberRequest
 * DESCRIPTION:     handler for delete team member request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
 func HandleDeleteTeamMemberRequest(resp http.ResponseWriter, req *http.Request) {
	 var (
		 err        error
		 deleteData models.DeleteTeamMemberRequest
	 )
 
	 log.EnterFn(0, "HandleDeleteTeamMemberRequest")
	 defer func() { log.ExitFn(0, "HandleDeleteTeamMemberRequest", err) }()
 
	 if req.Body == nil {
		 err = fmt.Errorf("HTTP Request body is null in delete team member request")
		 log.FuncErrorTrace(0, "%v", err)
		 FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		 return
	 }
 
	 reqBody, err := ioutil.ReadAll(req.Body)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to read HTTP Request body from delete team member request err: %v", err)
		 FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		 return
	 }
 
	 err = json.Unmarshal(reqBody, &deleteData)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to unmarshal delete team member request err: %v", err)
		 FormAndSendHttpResp(resp, "Failed to unmarshal delete team member request", http.StatusBadRequest, nil)
		 return
	 }
 
	 if deleteData.TeamMemberID <= 0 {
		 err = fmt.Errorf("Invalid team member ID in API request")
		 log.FuncErrorTrace(0, "%v", err)
		 FormAndSendHttpResp(resp, "Invalid team member ID in API request", http.StatusBadRequest, nil)
		 return
	 }
 
	 queryParameters := []interface{}{
		 deleteData.TeamMemberID,
	 }
 
	 _, err = db.CallDBFunction(db.OweHubDbIndex, db.DeleteTeamMember, queryParameters)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to delete team member from DB with err: %v", err)
		 FormAndSendHttpResp(resp, "Failed to delete team member", http.StatusInternalServerError, nil)
		 return
	 }
 
	 FormAndSendHttpResp(resp, "Team member deleted successfully", http.StatusOK, nil)
 }
 