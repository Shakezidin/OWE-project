/**************************************************************************
* File			: 	apiCreateRepStatus.go
* DESCRIPTION	: This file contains functions to create RepStatus handler
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
 * FUNCTION:				HandleCreateRepStatusRequest
 * DESCRIPTION:     handler to create RepStatus request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateRepStatusRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createRepStatusReq models.CreateRepStatus
		queryParameters    []interface{}
		result             []interface{}
		// whereEleList    []interface{}
		// customer        string
		// dealer          string
	)

	log.EnterFn(0, "HandleCreateRepStatusRequest")
	defer func() { log.ExitFn(0, "HandleCreateRepStatusRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create RepStatus request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create RepStatus request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRepStatusReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create RepStatus request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createRepStatusReq.Name) <= 0) || (len(createRepStatusReq.Status) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createRepStatusReq.Name)
	queryParameters = append(queryParameters, createRepStatusReq.Status)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateRepStatusFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RepStatus in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create RepStatus", http.StatusInternalServerError, nil)
		return
	}

	rdata := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New RepStatus created with Id: %+v", rdata["result"])
	appserver.FormAndSendHttpResp(resp, "RepStatus Created Successfully", http.StatusOK, nil)
}
