/**************************************************************************
* File			: apiCreateSchedulingProject.go
* DESCRIPTION	: This file contains functions for creating scheduling projects
* DATE			: 01-Sep-2024
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
 * FUNCTION:		HandleCreateSchedulingProjectRequest
 * DESCRIPTION:     handler for creating a scheduling project request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateSchedulingProjectRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                        error
		emailCheckRecords          []interface{}
		queryParameters            []interface{}
		createSchedulingProjectReq models.CreateSchedulingProjectReq
	)

	log.EnterFn(0, "HandleCreateSchedulingProjectRequest")
	defer func() { log.ExitFn(0, "HandleCreateSchedulingProjectRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create scheduling project request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create scheduling project request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createSchedulingProjectReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create scheduling project request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create scheduling project request", http.StatusBadRequest, nil)
		return
	}

	// Check if email is provided
	if len(createSchedulingProjectReq.Email) <= 0 {
		err = fmt.Errorf("Email field is empty")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Email field is required", http.StatusBadRequest, nil)
		return
	}

	// Check if first name is provided
	if len(createSchedulingProjectReq.FirstName) <= 0 {
		err = fmt.Errorf("First name field is empty")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "First name field is required", http.StatusBadRequest, nil)
		return
	}

	// Check if last name is provided
	if len(createSchedulingProjectReq.LastName) <= 0 {
		err = fmt.Errorf("Last name field is empty")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Last name field is required", http.StatusBadRequest, nil)
		return
	}

	// make sure that user with email doesnt already exist
	emailCheckRecords, err = db.CallDBFunction(db.OweHubDbIndex, db.CheckSchedulingProjectsEmailExistsFunction, []interface{}{createSchedulingProjectReq.Email})
	if err != nil || len(emailCheckRecords) <= 0 {
		log.FuncErrorTrace(0, "Failed to call procedure db.CheckSchedulingProjectsEmailExists err: %v", err)
		FormAndSendHttpResp(resp, "Failed to validate email", http.StatusInternalServerError, nil)
		return
	}
	isEmailValid, ok := emailCheckRecords[0].(map[string]interface{})["result"].(bool)
	if !ok {
		err = fmt.Errorf("Failed to assert email check type: %T", emailCheckRecords[0])
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Failed to validate email", http.StatusInternalServerError, nil)
		return
	}

	if isEmailValid {
		err = fmt.Errorf("duplicate email provided")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Email already taken", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmail := req.Context().Value("emailid").(string)

	queryParameters = append(queryParameters, createSchedulingProjectReq.FirstName)
	queryParameters = append(queryParameters, createSchedulingProjectReq.LastName)
	queryParameters = append(queryParameters, createSchedulingProjectReq.Email)
	queryParameters = append(queryParameters, createSchedulingProjectReq.Phone)
	queryParameters = append(queryParameters, createSchedulingProjectReq.Address)
	queryParameters = append(queryParameters, createSchedulingProjectReq.RoofType)
	queryParameters = append(queryParameters, createSchedulingProjectReq.HouseStories)
	queryParameters = append(queryParameters, createSchedulingProjectReq.HouseAreaSqft)
	queryParameters = append(queryParameters, createSchedulingProjectReq.SystemSize)
	queryParameters = append(queryParameters, authenticatedEmail)

	_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateSchedulingProjectFunction, queryParameters)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert scheduling project into DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to create scheduling project", http.StatusInternalServerError, nil)
		return
	}

	log.FuncBriefTrace(0, "Inserted scheduling project into DB: %+v", createSchedulingProjectReq)
	FormAndSendHttpResp(resp, "Scheduling project created successfully", http.StatusOK, nil)
}
