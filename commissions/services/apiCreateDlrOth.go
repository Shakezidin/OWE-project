/**************************************************************************
* File			: apiCreateDLR_OTH.go
* DESCRIPTION	: This file contains functions for create dlr_oth
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleCreateDLR_OTHRequest
 * DESCRIPTION:     handler for create dlr_oth request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateDLROTHDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		createDLR_OTHReq models.CreateDLR_OTH
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleCreateDLROTHDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateDLROTHDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create dlr_oth request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create dlr_oth request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDLR_OTHReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create dlr_oth request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create dlr_oth request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDLR_OTHReq.Unique_Id) <= 0) || (len(createDLR_OTHReq.Payee) <= 0) ||
		(len(createDLR_OTHReq.Amount) <= 0) || (len(createDLR_OTHReq.Description) <= 0) ||
		(len(createDLR_OTHReq.StartDate) <= 0) || (len(createDLR_OTHReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDLR_OTHReq.Balance <= float64(0) {
		err = fmt.Errorf("Invalid balance Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sale price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDLR_OTHReq.Paid_Amount <= float64(0) {
		err = fmt.Errorf("Invalid Paid_amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sale price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDLR_OTHReq.Unique_Id)
	queryParameters = append(queryParameters, createDLR_OTHReq.Payee)
	queryParameters = append(queryParameters, createDLR_OTHReq.Amount)
	queryParameters = append(queryParameters, createDLR_OTHReq.Description)
	queryParameters = append(queryParameters, createDLR_OTHReq.Balance)
	queryParameters = append(queryParameters, createDLR_OTHReq.Paid_Amount)
	queryParameters = append(queryParameters, createDLR_OTHReq.StartDate)
	queryParameters = append(queryParameters, createDLR_OTHReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateDLR_OTHFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add dlr_oth in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create dlr_oth", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dlr_oth created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "dlr_oth Created Successfully", http.StatusOK, nil)
}
