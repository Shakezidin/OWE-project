/**************************************************************************
 *	File            : apiAuroraListModules.go
 * 	DESCRIPTION     : This file contains api calls to list modules in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package services

import (
	"OWEApp/owehub-leads/auroraclient"
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

/******************************************************************************
 * FUNCTION:        HandleAuroraListModulestRequest
 *
 * DESCRIPTION:     This function will handle the request to retreive project in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraListModulestRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err           error
		reqBody       []byte
		dataReq       models.AuroraListModulestRequest
		auroraApiResp *auroraclient.ListModuleApiResponse
	)
	log.EnterFn(0, "HandleAuroraListModulestRequest")
	defer func() { log.ExitFn(0, "HandleAuroraListModulestRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get aurora project")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get aurora project err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to get aurora project err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// retrieve aurora list module
	listAuroraModuleApi := auroraclient.ListModuleApi{
		PageNumber: dataReq.PageNumber,
		PageSize:   dataReq.PageSize,
	}

	auroraApiResp, err = listAuroraModuleApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve aurora project err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Aurora list modules", http.StatusOK, auroraApiResp.Modules)
}
