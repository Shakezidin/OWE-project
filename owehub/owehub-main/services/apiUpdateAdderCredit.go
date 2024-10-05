/**************************************************************************
* File			: apiUpdateAdderCredit.go
* DESCRIPTION	: This file contains functions for Update AdderCredit handler
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
 * FUNCTION:		HandleUpdateAdderCreditDataRequest
 * DESCRIPTION:     handler for Update AdderCredits request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateAdderCreditDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		UpdateAdderCreditReq models.UpdateAdderCredit
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleUpdateAdderCreditDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdderCreditDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update adder credit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update adder credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateAdderCreditReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update adder credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update adder credit request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateAdderCreditReq.Pay_Scale) <= 0) ||
		(len(UpdateAdderCreditReq.Type) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdderCreditReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record id Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdderCreditReq.Min_Rate <= float64(0) {
		err = fmt.Errorf("Invalid min rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Min Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateAdderCreditReq.Max_Rate <= float64(0) {
		err = fmt.Errorf("Invalid max rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Max Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateAdderCreditReq.RecordId)
	queryParameters = append(queryParameters, UpdateAdderCreditReq.Pay_Scale)
	queryParameters = append(queryParameters, UpdateAdderCreditReq.Type)
	queryParameters = append(queryParameters, UpdateAdderCreditReq.Min_Rate)
	queryParameters = append(queryParameters, UpdateAdderCreditReq.Max_Rate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateAdderCreditFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update adder credit in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update adder credit", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adder credit updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Adder Credits Updated Successfully", http.StatusOK, nil)
}
