/**************************************************************************
 * File       	   : apiCreateSupersetReport.go
 * DESCRIPTION     : This file contains functions to create superset report
 * DATE            : 22-Dec-2024
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
 * FUNCTION:		HandleCreateSupersetReportRequest
 * DESCRIPTION:     handler for create superset report request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateSupersetReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err        error
		dataReq    models.CreateSupersetReportRequest
		dbFuncArgs []interface{}
	)

	log.EnterFn(0, "HandleCreateSupersetReportRequest")
	defer func() { log.ExitFn(0, "HandleCreateSupersetReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create superset report")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create superset report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create superset report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create superset report", http.StatusBadRequest, nil)
		return
	}

	if dataReq.Category == "" || dataReq.Title == "" || dataReq.DashboardId == "" {
		log.FuncErrorTrace(0, "invalid data provided")
		appserver.FormAndSendHttpResp(resp, "Empty fields are not allowed in Api", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmail, ok := req.Context().Value("emailid").(string)
	if !ok {
		log.FuncErrorTrace(0, "failed to retrieve user email from context %v", err)
		appserver.FormAndSendHttpResp(resp, "User email not found", http.StatusInternalServerError, nil)
		return
	}

	dbFuncArgs = []interface{}{
		dataReq.Category,
		dataReq.Title,
		dataReq.Subtitle,
		dataReq.DashboardId,
		authenticatedEmail,
	}

	_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateSupersetReportFunction, dbFuncArgs)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to Add Superset Report in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Superset Report ", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Superset report created successfully", http.StatusOK, nil)
}
