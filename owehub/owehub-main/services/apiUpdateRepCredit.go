/**************************************************************************
* File			: 	apiUpdateRepCredit.go
* DESCRIPTION	: This file contains functions to Update RepCredit handler
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
	"time"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:				HandleUpdateRepCreditRequest
 * DESCRIPTION:     handler to Update RepCredit request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateRepCreditRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		UpdateRepCreditReq models.UpdateRepCredit
		queryParameters    []interface{}
		result             []interface{}
		// whereEleList    []interface{}
		// customer        string
		// dealer          string
	)

	log.EnterFn(0, "HandleUpdateRepCreditRequest")
	defer func() { log.ExitFn(0, "HandleUpdateRepCreditRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Update RepCredit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Update RepCredit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateRepCreditReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update RepCredit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateRepCreditReq.UniqueId) <= 0) ||
		(len(UpdateRepCreditReq.Date) <= 0) || (len(UpdateRepCreditReq.ApprovedBy) <= 0) ||
		(len(UpdateRepCreditReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateRepCreditReq.PerKwAmt <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateRepCreditReq.ExactAmt <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", UpdateRepCreditReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateRepCreditReq.RecordId)
	queryParameters = append(queryParameters, UpdateRepCreditReq.UniqueId)
	queryParameters = append(queryParameters, UpdateRepCreditReq.PerKwAmt)
	queryParameters = append(queryParameters, UpdateRepCreditReq.ExactAmt)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, UpdateRepCreditReq.ApprovedBy)
	queryParameters = append(queryParameters, UpdateRepCreditReq.Notes)
	// queryParameters = append(queryParameters, dealer)
	// queryParameters = append(queryParameters, customer)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRepCreditFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RepCredit in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update RepCredit", http.StatusInternalServerError, nil)
		return
	}

	rdata := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New RepCredit Updated with Id: %+v", rdata["result"])
	appserver.FormAndSendHttpResp(resp, "RepCredit Updated Successfully", http.StatusOK, nil)
}
