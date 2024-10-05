/**************************************************************************
* File			: 	apiUpdateDBA.go
* DESCRIPTION	: This file contains functions to Update DBA handler
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
 * FUNCTION:				HandleUpdateDBARequest
 * DESCRIPTION:     handler to Update DBA request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateDBARequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		UpdateDBAReq    models.UpdateDBA
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateDBARequest")
	defer func() { log.ExitFn(0, "HandleUpdateDBARequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update DBA request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update DBA request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateDBAReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update DBA request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateDBAReq.PreferredName) <= 0) || (len(UpdateDBAReq.Dba) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateDBAReq.RecordId)
	queryParameters = append(queryParameters, UpdateDBAReq.PreferredName)
	queryParameters = append(queryParameters, UpdateDBAReq.Dba)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDBAFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add DBA in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update DBA", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New DBA Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "DBA Updated Successfully", http.StatusOK, nil)
}
