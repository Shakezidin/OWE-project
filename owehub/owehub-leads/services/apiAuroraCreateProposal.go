/**************************************************************************
 *	File            : apiAuroraCreateProposal.go
 * 	DESCRIPTION     : This file contains api calls to create a project in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

/******************************************************************************
 * FUNCTION:        HandleAuroraCreateProposalRequest
 *
 * DESCRIPTION:     This function will handle the request to create a proposal
 *                  in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraCreateProposalRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		reqBody            []byte
		dataReq            models.AuroraCreateProposalRequest
		data               []map[string]interface{}
		createProjectResp  *leadsService.AuroraCreateProjectApiResponse
		createDesignResp   *leadsService.AuroraCreateDesignApiResponse
		createProposalResp *leadsService.AuroraCreateProposalApiResponse
		updateQuery        string
		updateEleList      []interface{}
	)
	log.EnterFn(0, "HandleAuroraCreateProjectRequest")
	defer func() { log.ExitFn(0, "HandleAuroraCreateProjectRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in CreateProjectRequest")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
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

	retrieveLeadQuery := `
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

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, retrieveLeadQuery, []interface{}{authenticatedEmailId, dataReq.LeadsId})

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

	_, ok := data[0]["aurora_proposal_id"].(string)
	if ok {
		err = fmt.Errorf("aurora_proposal_id already exists for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Aurora proposal already exists", http.StatusBadRequest, nil)
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

	createProjApi := leadsService.AuroraCreateProjectApi{
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
		Location: leadsService.AuroraCreateProjectApiLocation{
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
	projectId, ok := createProjectResp.Project["id"].(string)
	if !ok {
		err = fmt.Errorf("project_id not found in create project response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve project id from create project response", http.StatusInternalServerError, nil)
		return
	}

	// create design
	createDesignApi := leadsService.AuroraCreateDesignApi{
		ExternalProviderId: createProjApi.ExternalProviderId,
		Name:               createProjApi.Name,
		ProjectId:          projectId,
	}
	createDesignResp, err = createDesignApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora design err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	designId, ok := createDesignResp.Design["id"].(string)
	if !ok {
		err = fmt.Errorf("design_id not found in create design response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve design id from create design response", http.StatusInternalServerError, nil)
		return
	}

	// create proposal
	createProposalApi := leadsService.AuroraCreateProposalApi{
		DesignId: designId,
	}
	createProposalResp, err = createProposalApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora proposal err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	proposalId, ok := createProposalResp.Proposal["id"].(string)
	if !ok {
		err = fmt.Errorf("proposal_id not found in create design response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve proposal id from create proposal response", http.StatusInternalServerError, nil)
		return
	}

	// update the lead info record
	updateQuery = `
		UPDATE
			leads_info
		SET
			aurora_project_id = $1,
			aurora_design_id = $2,
			aurora_proposal_id = $3,
			updated_at = CURRENT_TIMESTAMP,
			proposal_created_date = CURRENT_TIMESTAMP
		WHERE
			leads_id = $4
	`
	updateEleList = append(updateEleList,
		projectId,
		designId,
		proposalId,
		dataReq.LeadsId,
	)

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, updateQuery, updateEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update leads info in DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update leads info in DB", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Proposal created successfully", http.StatusOK, createProposalResp.Proposal)
}
