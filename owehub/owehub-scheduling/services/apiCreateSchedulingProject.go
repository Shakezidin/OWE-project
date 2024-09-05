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
	"strings"

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
/*
func HandleCreateSchedulingProjectRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                        error
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
	if len(createSchedulingProjectReq.FirstName) <= 0 || len(createSchedulingProjectReq.LastName) <= 0 {
		err = fmt.Errorf("First name or last name field is empty")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "First name Last name is required", http.StatusBadRequest, nil)
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

	log.FuncDebugTrace(0, "Inserted scheduling project into DB: %+v", createSchedulingProjectReq)
	FormAndSendHttpResp(resp, "Scheduling project created successfully", http.StatusOK, nil)
}
*/
func HandleCreateSchedulingProjectRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                        error
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

	// Check if first name and last name are provided
	if len(createSchedulingProjectReq.FirstName) <= 0 || len(createSchedulingProjectReq.LastName) <= 0 {
		err = fmt.Errorf("First name or last name field is empty")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "First name and last name are required", http.StatusBadRequest, nil)
		return
	}

	// Check if SalesRepEmailID is provided
	// if len(createSchedulingProjectReq.SalesRepEmailID) <= 0 {
	// 	err = fmt.Errorf("SalesRepEmailID field is empty")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "SalesRepEmailID field is required", http.StatusBadRequest, nil)
	// 	return
	// }

	authenticatedEmail := req.Context().Value("emailid").(string)

	// Populate query parameters
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
	queryParameters = append(queryParameters, createSchedulingProjectReq.IsBatteryIncluded)

	// Add SiteSurveyStartDt and SiteSurveyEndDt if provided
	if createSchedulingProjectReq.SiteSurveyStartDt != nil {
		queryParameters = append(queryParameters, *createSchedulingProjectReq.SiteSurveyStartDt)
	} else {
		queryParameters = append(queryParameters, nil)
	}
	if createSchedulingProjectReq.SiteSurveyEndDt != nil {
		queryParameters = append(queryParameters, *createSchedulingProjectReq.SiteSurveyEndDt)
	} else {
		queryParameters = append(queryParameters, nil)
	}

	// Add Backup3 and Backup4 if provided
	queryParameters = append(queryParameters, createSchedulingProjectReq.Backup3)
	queryParameters = append(queryParameters, createSchedulingProjectReq.Backup4)

	_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateSchedulingProjectFunction, queryParameters)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert scheduling project into DB with err: %v", err)

		// 404 incase project doesnt exist
		if strings.Contains(err.Error(), "already exists") {
			FormAndSendHttpResp(resp, "Email already in use", http.StatusNotFound, nil)
			return
		}

		FormAndSendHttpResp(resp, "Failed to create scheduling project", http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "Inserted scheduling project into DB: %+v", createSchedulingProjectReq)
	FormAndSendHttpResp(resp, "Scheduling project created successfully", http.StatusOK, nil)
}
