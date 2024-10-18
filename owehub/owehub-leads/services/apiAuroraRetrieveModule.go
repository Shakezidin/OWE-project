/**************************************************************************
 *	File            : apiAuroraRetrieveModules.go
 * 	DESCRIPTION     : This file contains api calls to retrieve modules in aurora
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
 * FUNCTION:        HandleAuroraRetrieveModulestRequest
 *
 * DESCRIPTION:     This function will handle the request to retreive module in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraRetrieveModulestRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err           error
		reqBody       []byte
		dataReq       models.AuroraRetrieveModulestRequest
		auroraApiResp interface{}
	)
	log.EnterFn(0, "HandleAuroraRetrieveModulestRequest")
	defer func() { log.ExitFn(0, "HandleAuroraRetrieveModulestRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in retrieve aurora project")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from retrieve aurora project err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to retrieve aurora project err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	// get aurora retrieve module
	retrieveAuroraModuleApi := auroraclient.RetrieveModuleApi{
		ModuleId: dataReq.ModuleId,
	}

	auroraApiResp, err = retrieveAuroraModuleApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve aurora module err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Aurora retrieve modules", http.StatusOK, auroraApiResp)
}
