/**************************************************************************
* File                  : apiAuroraUpdateProject.go
* DESCRIPTION           : This file contains functions to update a project in aurora

* DATE                  : 03-December-2024
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
)

/******************************************************************************
 * FUNCTION:		HandleAuroraUpdateProjectRequest
 * DESCRIPTION:     handler for updating project in aurora
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleAuroraUpdateProjectRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		reqBody           []byte
		query             string
		dataReq           models.AuroraUpdateProjectRequest
		data              []map[string]interface{}
		updateProjectResp *auroraclient.UpdateProjectApiResponse
	)

	log.EnterFn(0, "HandleAuroraUpdateProjectRequest")
	defer func() { log.ExitFn(0, "HandleAuroraUpdateProjectRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in UpdateProjectRequest")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from UpdateProjectRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to UpdateProjectRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	query = `
		SELECT
			li.aurora_project_id
		FROM
			get_leads_info_hierarchy($1) li
		WHERE
			li.leads_id = $2
	`

	authenticatedEmailId := req.Context().Value("emailid").(string)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmailId, dataReq.LeadId})

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

	projectId, ok := data[0]["aurora_project_id"].(string)
	if !ok {
		err = fmt.Errorf("aurora_project_id not found for lead id %d", dataReq.LeadId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve aurora project id from leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	updateProjApi := auroraclient.UpdateProjectApi{
		ProjectId:         projectId,
		CustomerFirstName: dataReq.FirstName,
		CustomerLastName:  dataReq.LastName,
		CustomerPhone:     dataReq.PhoneNumber,
		CustomerEmail:     dataReq.EmailId,
		MailingAddress:    dataReq.StreetAddress,
	}

	// Update project
	updateProjectResp, err = updateProjApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update aurora project err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "Updated aurora project %+v", updateProjectResp.Project)

	appserver.FormAndSendHttpResp(resp, "Project updated successfully", http.StatusOK, updateProjectResp.Project)
}
