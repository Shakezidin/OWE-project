/**************************************************************************
* File			: 	apiCreateRepIncent.go
* DESCRIPTION	: This file contains functions to create RepIncent handler
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
 * FUNCTION:				HandleCreateRepIncentRequest
 * DESCRIPTION:     handler to create RepIncent request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateRepIncentRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createRepIncentReq models.CreateRepIncent
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleCreateRepIncentRequest")
	defer func() { log.ExitFn(0, "HandleCreateRepIncentRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create RepIncent request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create RepIncent request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRepIncentReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create RepIncent request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createRepIncentReq.Name) <= 0) || (len(createRepIncentReq.Month) <= 0) ||
		(len(createRepIncentReq.Comment) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRepIncentReq.DollDivKw <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createRepIncentReq.Name)
	queryParameters = append(queryParameters, createRepIncentReq.DollDivKw)
	queryParameters = append(queryParameters, createRepIncentReq.Month)
	queryParameters = append(queryParameters, createRepIncentReq.Comment)
	// queryParameters = append(queryParameters, dealer)
	// queryParameters = append(queryParameters, customer)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateRepIncentFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RepIncent in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create RepIncent", http.StatusInternalServerError, nil)
		return
	}

	rdata := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New RepIncent created with Id: %+v", rdata["result"])
	appserver.FormAndSendHttpResp(resp, "RepIncent Created Successfully", http.StatusOK, nil)
}
