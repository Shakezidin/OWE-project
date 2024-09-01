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
		emailCheckQuery            string
		emailCheckRecords          []map[string]interface{}
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

	// Check for required fields
	if len(createSchedulingProjectReq.Email) <= 0 || len(createSchedulingProjectReq.FirstName) <= 0 || len(createSchedulingProjectReq.LastName) <= 0 {
		err = fmt.Errorf("Empty input fields in API are not allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty input fields in API are not allowed", http.StatusBadRequest, nil)
		return
	}

	// make sure that user with email doesnt already exist
	emailCheckQuery = fmt.Sprintf("SELECT count(*) FROM %s WHERE EMAIL = $1", db.TableName_SchedulingProjects)
	emailCheckRecords, err = db.ReteriveFromDB(db.OweHubDbIndex, emailCheckQuery, []interface{}{createSchedulingProjectReq.Email})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get email count from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to validate email", http.StatusInternalServerError, nil)
		return
	}

	emailCheckCount, emailCheckOk := emailCheckRecords[0]["count"].(int64)
	if !emailCheckOk {
		err = fmt.Errorf("Failed to assert email count from type: %T", emailCheckRecords[0]["count"])
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Failed to validate email", http.StatusInternalServerError, nil)
		return
	}

	if emailCheckCount != 0 {
		err = fmt.Errorf("duplicate email provided")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Email already taken", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmail := req.Context().Value("emailid").(string)

	err = db.AddSingleRecordInDB(
		db.OweHubDbIndex,
		db.TableName_SchedulingProjects,
		map[string]interface{}{
			"first_name":         createSchedulingProjectReq.FirstName,
			"last_name":          createSchedulingProjectReq.LastName,
			"email":              createSchedulingProjectReq.Email,
			"phone":              createSchedulingProjectReq.Phone,
			"address":            createSchedulingProjectReq.Address,
			"roof_type":          createSchedulingProjectReq.RoofType,
			"house_stories":      createSchedulingProjectReq.HouseStories,
			"house_area_sqft":    createSchedulingProjectReq.HouseAreaSqft,
			"system_size":        createSchedulingProjectReq.SystemSize,
			"sales_rep_email_id": authenticatedEmail,
		},
	)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert scheduling project into DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to create scheduling project", http.StatusInternalServerError, nil)
		return
	}

	log.FuncBriefTrace(0, "Inserted scheduling project into DB: %+v", createSchedulingProjectReq)
	FormAndSendHttpResp(resp, "Scheduling project created successfully", http.StatusOK, nil)
}
