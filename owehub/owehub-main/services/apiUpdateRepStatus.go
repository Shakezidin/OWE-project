/**************************************************************************
* File			: 	apiUpdateRepStatus.go
* DESCRIPTION	: This file contains functions to Update RepStatus handler
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
 * FUNCTION:				HandleUpdateRepStatusRequest
 * DESCRIPTION:     handler to Update RepStatus request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateRepStatusRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		UpdateRepStatusReq models.UpdateRepStatus
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateRepStatusRequest")
	defer func() { log.ExitFn(0, "HandleUpdateRepStatusRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update RepStatus request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update RepStatus request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateRepStatusReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update RepStatus request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateRepStatusReq.Name) <= 0) || (len(UpdateRepStatusReq.Status) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateRepStatusReq.RecordId)
	queryParameters = append(queryParameters, UpdateRepStatusReq.Name)
	queryParameters = append(queryParameters, UpdateRepStatusReq.Status)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRepStatusFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RepStatus in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update RepStatus", http.StatusInternalServerError, nil)
		return
	}

	rdata := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New RepStatus Updated with Id: %+v", rdata["result"])
	appserver.FormAndSendHttpResp(resp, "RepStatus Updated Successfully", http.StatusOK, nil)
}
