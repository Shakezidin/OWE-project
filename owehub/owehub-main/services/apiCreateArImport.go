/**************************************************************************
* File			: apiCreateArImport.go
* DESCRIPTION	: This file contains functions for create ArImport handler
* DATE			: 30-Apr-2024
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
 * FUNCTION:		HandleCreateArImportDataRequests
 * DESCRIPTION:     handler for create ArImport request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateArImportDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		createArImportReq models.CreateArImportReq
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleCreateArImportDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateArImportDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create ar import request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create ar import request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createArImportReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create ar import request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar import request", http.StatusBadRequest, nil)
		return
	}

	if (len(createArImportReq.UniqueId) <= 0) || (len(createArImportReq.Customer) <= 0) ||
		(len(createArImportReq.Date) <= 0) || (len(createArImportReq.Amount) <= 0) ||
		(len(createArImportReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createArImportReq.UniqueId)
	queryParameters = append(queryParameters, createArImportReq.Customer)
	queryParameters = append(queryParameters, createArImportReq.Date)
	queryParameters = append(queryParameters, createArImportReq.Amount)
	queryParameters = append(queryParameters, createArImportReq.Notes)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateArImportFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ar import in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Ar import", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ar import created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Ar Import Created Successfully", http.StatusOK, nil)
}
