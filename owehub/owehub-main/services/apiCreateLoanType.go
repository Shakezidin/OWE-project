/**************************************************************************
* File			: apiCreateLoanType.go
* DESCRIPTION	: This file contains functions for create Loan type
						setter handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleCreateLoanTypeRequest
 * DESCRIPTION:     handler for create loan type request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateLoanTypeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		createLoanTypeReq models.CreateLoanType
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleCreateLoanTypeRequest")
	defer func() { log.ExitFn(0, "HandleCreateLoanTypeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create loan type request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create loan type request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createLoanTypeReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create loan type request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create loan type request", http.StatusBadRequest, nil)
		return
	}

	if (len(createLoanTypeReq.ProductCode) <= 0) || (len(createLoanTypeReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createLoanTypeReq.Adder <= 0 {
		err = fmt.Errorf("Invalid Pay Source Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Adder Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createLoanTypeReq.ProductCode)
	queryParameters = append(queryParameters, createLoanTypeReq.Active)
	queryParameters = append(queryParameters, createLoanTypeReq.Adder)
	queryParameters = append(queryParameters, createLoanTypeReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateLoanTypeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add loan type in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Loan Type", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New loan type created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Loan Type Created Successfully", http.StatusOK, nil)
}
