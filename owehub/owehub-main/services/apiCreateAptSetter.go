/**************************************************************************
* File			: apiCreateAptSetter.go
* DESCRIPTION	: This file contains functions for create appointment
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
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
 * FUNCTION:		HandleCreateAptSetterRequest
 * DESCRIPTION:     handler for create appointment setter request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateAptSetterRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createAptSetterReq models.CreateAptSetterReq
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleCreateAptSetterRequest")
	defer func() { log.ExitFn(0, "HandleCreateAptSetterRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create appointment setter request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create appointment setter request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAptSetterReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create appointment setter request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create appointment setter request", http.StatusBadRequest, nil)
		return
	}

	if (len(createAptSetterReq.TeamName) <= 0) || (len(createAptSetterReq.FirstName) <= 0) ||
		(len(createAptSetterReq.LastName) <= 0) || (len(createAptSetterReq.StartDate) <= 0) ||
		(len(createAptSetterReq.EndDate) <= 0) || (len(createAptSetterReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAptSetterReq.PayRate <= float32(0) {
		err = fmt.Errorf("Invalid Pay Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Pay Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createAptSetterReq.TeamName)
	queryParameters = append(queryParameters, createAptSetterReq.FirstName)
	queryParameters = append(queryParameters, createAptSetterReq.LastName)
	queryParameters = append(queryParameters, createAptSetterReq.PayRate)
	queryParameters = append(queryParameters, createAptSetterReq.StartDate)
	queryParameters = append(queryParameters, createAptSetterReq.EndDate)
	queryParameters = append(queryParameters, createAptSetterReq.Description)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateApiSetterFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add appointment setter in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create appointment setter", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New Appointment setter created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Appointment Setter Created Successfully", http.StatusOK, nil)
}
