/**************************************************************************
* File			: apiUpdateSchedulingProject.go
* DESCRIPTION	: This file contains functions for updating scheduling projects
* DATE			: 05-Sep-2024
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
 * FUNCTION:		HandleUpdateSchedulingProjectRequest
 * DESCRIPTION:     handler for updating a scheduling project request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateSchedulingProjectRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                        error
		queryParameters            []interface{}
		updateSchedulingProjectReq models.UpdateSchedulingProjectReq
	)

	log.EnterFn(0, "HandleUpdateSchedulingProjectRequest")
	defer func() { log.ExitFn(0, "HandleUpdateSchedulingProjectRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update scheduling project request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update scheduling project request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateSchedulingProjectReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update scheduling project request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update scheduling project request", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters
	queryParameters = append(queryParameters, updateSchedulingProjectReq.Email)
	queryParameters = append(queryParameters, updateSchedulingProjectReq.IsAppointmentApproved)

	// Add SiteSurveyStartDt and SiteSurveyEndDt if provided
	if updateSchedulingProjectReq.SiteSurveyStartDt != nil {
		queryParameters = append(queryParameters, *updateSchedulingProjectReq.SiteSurveyStartDt)
	} else {
		queryParameters = append(queryParameters, nil)
	}
	if updateSchedulingProjectReq.SiteSurveyEndDt != nil {
		queryParameters = append(queryParameters, *updateSchedulingProjectReq.SiteSurveyEndDt)
	} else {
		queryParameters = append(queryParameters, nil)
	}

	_, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateSchedulingProjectFunction, queryParameters)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update scheduling err: %v", err)

		// 404 incase project doesnt exist
		if strings.Contains(err.Error(), "does not exist") {
			FormAndSendHttpResp(resp, "Project does not exist", http.StatusNotFound, nil)
			return
		}

		FormAndSendHttpResp(resp, "Failed to update scheduling project", http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "Successfully updated scheduling project: %+v", updateSchedulingProjectReq)
	FormAndSendHttpResp(resp, "Scheduling project updated successfully", http.StatusOK, nil)
}
