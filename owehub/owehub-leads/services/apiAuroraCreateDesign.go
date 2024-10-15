/**************************************************************************
* File                  : apiAuroraCreateDesign.go
* DESCRIPTION           : This file contains functions to create a design in aurora

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
)

/******************************************************************************
 * FUNCTION:		HandleCreateDesignRequest
 * DESCRIPTION:     handler for creating design in aurora
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateDesignRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		reqBody          []byte
		dataReq          models.AuroraCreateDesignRequest
		data             []map[string]interface{}
		query            string
		createDesignResp *auroraclient.CreateDesignApiResponse
	)

	log.EnterFn(0, "HandleCreateDesignRequest")
	defer func() { log.ExitFn(0, "HandleCreateDesignRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in CreateDesignRequest")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from CreateDesignRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to CreateDesignRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// validate required fields
	query = `
		SELECT
			li.aurora_project_id,
			li.aurora_project_name
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

	projectId, ok := data[0]["aurora_project_id"].(string)
	if !ok {
		err = fmt.Errorf("aurora_project_id not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	projectName, ok := data[0]["aurora_project_name"].(string)
	if !ok {
		err = fmt.Errorf("aurora_project_name not found for lead id %d", dataReq.LeadsId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from DB", http.StatusInternalServerError, nil)
		return
	}

	// create design
	createDesignApi := auroraclient.CreateDesignApi{
		ExternalProviderId: fmt.Sprintf("%d", dataReq.LeadsId),
		Name:               projectName,
		ProjectId:          projectId,
	}

	// create design
	createDesignResp, err = createDesignApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora design err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "Created aurora design %+v", createDesignResp.Design)

	designId, ok := createDesignResp.Design["id"].(string)
	if !ok {
		err = fmt.Errorf("design_id not found in create design response")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve design id from create design response", http.StatusInternalServerError, nil)
		return
	}

	// update the lead info record
	query = "UPDATE leads_info SET aurora_design_id = $1 WHERE leads_id = $2"

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{designId, dataReq.LeadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update leads info in DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update leads info in DB", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Design created successfully", http.StatusOK, createDesignResp.Design)
}
