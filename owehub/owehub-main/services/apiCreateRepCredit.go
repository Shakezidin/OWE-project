/**************************************************************************
* File			: 	apiCreateRepCredit.go
* DESCRIPTION	: This file contains functions to create RepCredit handler
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
 * FUNCTION:				HandleCreateRepCreditRequest
 * DESCRIPTION:     handler to create RepCredit request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateRepCreditRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createRepCreditReq models.CreateRepCredit
		queryParameters    []interface{}
		result             []interface{}
		// whereEleList    []interface{}
		// customer        string
		// dealer          string
	)

	log.EnterFn(0, "HandleCreateRepCreditRequest")
	defer func() { log.ExitFn(0, "HandleCreateRepCreditRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create RepCredit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create RepCredit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRepCreditReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create RepCredit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createRepCreditReq.UniqueId) <= 0) ||
		(len(createRepCreditReq.Date) <= 0) || (len(createRepCreditReq.ApprovedBy) <= 0) ||
		(len(createRepCreditReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRepCreditReq.PerKwAmt <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRepCreditReq.ExactAmt <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", createRepCreditReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createRepCreditReq.UniqueId)
	queryParameters = append(queryParameters, createRepCreditReq.PerKwAmt)
	queryParameters = append(queryParameters, createRepCreditReq.ExactAmt)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createRepCreditReq.ApprovedBy)
	queryParameters = append(queryParameters, createRepCreditReq.Notes)
	// queryParameters = append(queryParameters, dealer)
	// queryParameters = append(queryParameters, customer)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateRepCreditFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add RepCredit in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create RepCredit", http.StatusInternalServerError, nil)
		return
	}

	rdata := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New RepCredit created with Id: %+v", rdata["result"])
	appserver.FormAndSendHttpResp(resp, "RepCredit Created Successfully", http.StatusOK, nil)
}
