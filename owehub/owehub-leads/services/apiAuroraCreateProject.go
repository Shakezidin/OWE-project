/**************************************************************************
* File                  : apiAuroraCreateProject.go
* DESCRIPTION           : This file contains functions to create a project in aurora

* DATE                  : 11-September-2024
**************************************************************************/

package services

import (
	"OWEApp/owehub-leads/auroraclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

/******************************************************************************
 * FUNCTION:		HandleCreateProjectRequest
 * DESCRIPTION:     handler for creating project in aurora
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateProjectRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		reqBody           []byte
		query             string
		dataReq           models.AuroraCreateProjectRequest
		data              []map[string]interface{}
		createProjectResp *auroraclient.CreateProjectApiResponse
	)

	log.EnterFn(0, "HandleCreateProjectRequest")
	defer func() { log.ExitFn(0, "HandleCreateProjectRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in CreateProjectRequest")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from CreateProjectRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to CreateProjectRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// validate required fields
	query = `
		SELECT
			li.first_name,
			li.last_name,
			li.email_id,
			li.phone_number,
			li.street_address,
			li.aurora_proposal_id
		FROM
			get_leads_info_hierarchy($1) li
		WHERE
			li.leads_id = $2
	`

	authenticatedEmailId := req.Context().Value("emailid").(string)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmailId, dataReq.LeadsId})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve leads info from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	if len(data) <= 0 {
		err = fmt.Errorf("leads info not found")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Lead not found", http.StatusBadRequest, nil)
		return
	}

	firstName, ok := data[0]["first_name"].(string)
	if !ok {
		err = fmt.Errorf("first_name not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	lastName, ok := data[0]["last_name"].(string)
	if !ok {
		err = fmt.Errorf("last_name not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	emailId, ok := data[0]["email_id"].(string)
	if !ok {
		err = fmt.Errorf("email_id not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	phoneNumber, ok := data[0]["phone_number"].(string)
	if !ok {
		err = fmt.Errorf("phone_number not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	streetAddress, ok := data[0]["street_address"].(string)
	if !ok {
		err = fmt.Errorf("street_address not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	projectName := dataReq.ProjectName
	if projectName == "" {
		projectName = fmt.Sprintf("Project for %s %s - %d", firstName, lastName, time.Now().UnixMilli())
	}

	createProjApi := auroraclient.CreateProjectApi{
		ExternalProviderId:    fmt.Sprintf("%d", dataReq.LeadsId),
		Name:                  projectName,
		CustomerSalutation:    dataReq.CustomerSalutation,
		CustomerFirstName:     firstName,
		CustomerLastName:      lastName,
		CustomerEmail:         emailId,
		CustomerPhone:         phoneNumber,
		MailingAddress:        streetAddress,
		Status:                dataReq.Status,
		PreferredSolarModules: dataReq.PreferredSolarModules,
		Tags:                  dataReq.Tags,
		Location: auroraclient.CreateProjectApiLocation{
			PropertyAddress: streetAddress,
		},
	}

	// create project
	createProjectResp, err = createProjApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora project err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "Created aurora project %+v", createProjectResp.Project)

	projectId, ok := createProjectResp.Project["id"].(string)
	if !ok {
		err = fmt.Errorf("project_id not found in create project response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve project id from create project response", http.StatusInternalServerError, nil)
		return
	}

	// update the lead info record
	query = "UPDATE leads_info SET aurora_project_id = $1, aurora_project_name = $2 WHERE leads_id = $3"

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{projectId, projectName, dataReq.LeadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update leads info in DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update leads info in DB", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Project created successfully", http.StatusOK, createProjectResp.Project)
}
