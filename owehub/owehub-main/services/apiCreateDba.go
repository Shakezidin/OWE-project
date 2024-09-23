/**************************************************************************
* File			: 	apiCreateDBA.go
* DESCRIPTION	: This file contains functions to create DBA handler
* DATE			: 	21-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"io"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:				HandleCreateDBARequest
 * DESCRIPTION:     handler to create DBA request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateDBARequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createDBAReq    models.CreateDBA
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateDBARequest")
	defer func() { log.ExitFn(0, "HandleCreateDBARequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create DBA request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create DBA request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDBAReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create DBA request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDBAReq.PreferredName) <= 0) || (len(createDBAReq.Dba) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createDBAReq.PreferredName)
	queryParameters = append(queryParameters, createDBAReq.Dba)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateDBAFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add DBA in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create DBA", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New DBA created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "DBA Created Successfully", http.StatusOK, nil)
}
