/**************************************************************************
* File			: apiUpdateLoanType.go
* DESCRIPTION	: This file contains functions for update Loan type
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
 * FUNCTION:		HandleUpdateLoanTypeRequest
 * DESCRIPTION:     handler for update loan type request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateLoanTypeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		updateLoanTypeReq models.UpdateLoanType
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleUpdateLoanTypeRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLoanTypeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update loan type request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update loan type request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateLoanTypeReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update loan type request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update loan type request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateLoanTypeReq.ProductCode) <= 0) || (len(updateLoanTypeReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateLoanTypeReq.Active <= 0 {
		err = fmt.Errorf("Invalid Chg Dlr Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Active Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateLoanTypeReq.Adder <= 0 {
		err = fmt.Errorf("Invalid Pay Source Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Adder Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateLoanTypeReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}
	queryParameters = append(queryParameters, updateLoanTypeReq.RecordId)
	queryParameters = append(queryParameters, updateLoanTypeReq.ProductCode)
	queryParameters = append(queryParameters, updateLoanTypeReq.Active)
	queryParameters = append(queryParameters, updateLoanTypeReq.Adder)
	queryParameters = append(queryParameters, updateLoanTypeReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateLoanTypeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add loan type in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update loan type", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Loan type updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Loan type Updated Successfully", http.StatusOK, nil)
}
