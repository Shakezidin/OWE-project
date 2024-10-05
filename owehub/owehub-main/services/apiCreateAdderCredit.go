/**************************************************************************
* File			: apiCreateAdderCredit.go
* DESCRIPTION	: This file contains functions for create AdderCredit handler
* DATE			: 29-Apr-2024
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
 * FUNCTION:		HandleCreateAdderCreditRequest
 * DESCRIPTION:     handler for create adder credit request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateAdderCreditDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		createAdderCreditReq models.CreateAdderCredit
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleCreateAdderCreditRequest")
	defer func() { log.ExitFn(0, "HandleCreateAdderCreditRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create adder credit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create adder credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAdderCreditReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create adder credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create adder credit request", http.StatusBadRequest, nil)
		return
	}

	if (len(createAdderCreditReq.Pay_Scale) <= 0) ||
		(len(createAdderCreditReq.Type) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAdderCreditReq.Min_Rate <= float64(0) {
		err = fmt.Errorf("Invalid min_rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid min_rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAdderCreditReq.Max_Rate <= float64(0) {
		err = fmt.Errorf("Invalid max_rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid max_rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createAdderCreditReq.Pay_Scale)
	queryParameters = append(queryParameters, createAdderCreditReq.Type)
	queryParameters = append(queryParameters, createAdderCreditReq.Min_Rate)
	queryParameters = append(queryParameters, createAdderCreditReq.Max_Rate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateAdderCreditFunction, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Add adder credit in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create adder credit", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adder credit created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "adder cedit created Successfully", http.StatusOK, nil)
}
