/**************************************************************************
* File			: 	apiUpdateRepIncent.go
* DESCRIPTION	: This file contains functions to Update RepIncent handler
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
 * FUNCTION:				HandleUpdateRepIncentRequest
 * DESCRIPTION:     handler to Update RepIncent request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateRepIncentRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		UpdateRepIncentReq models.UpdateRepIncent
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateRepIncentRequest")
	defer func() { log.ExitFn(0, "HandleUpdateRepIncentRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update RepIncent request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update RepIncent request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateRepIncentReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update RepIncent request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateRepIncentReq.Name) <= 0) || (len(UpdateRepIncentReq.Month) <= 0) ||
		(len(UpdateRepIncentReq.Comment) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateRepIncentReq.DollDivKw <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateRepIncentReq.RecordId)
	queryParameters = append(queryParameters, UpdateRepIncentReq.Name)
	queryParameters = append(queryParameters, UpdateRepIncentReq.DollDivKw)
	queryParameters = append(queryParameters, UpdateRepIncentReq.Month)
	queryParameters = append(queryParameters, UpdateRepIncentReq.Comment)
	// queryParameters = append(queryParameters, dealer)
	// queryParameters = append(queryParameters, customer)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRepIncentFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RepIncent in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update RepIncent", http.StatusInternalServerError, nil)
		return
	}

	rdata := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New RepIncent Updated with Id: %+v", rdata["result"])
	appserver.FormAndSendHttpResp(resp, "RepIncent Updated Successfully", http.StatusOK, nil)
}
