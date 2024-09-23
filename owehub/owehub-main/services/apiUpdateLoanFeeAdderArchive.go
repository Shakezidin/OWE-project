/**************************************************************************
* File			: apiUpdateLoanFeeAdderArchive.go
* DESCRIPTION	: This file contains functions for update LoanFeeAdder archive
* DATE			: 24-Apr-2024
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

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateLoanFeeAdderArchiveRequest
 * DESCRIPTION:     handler for update LoanFeeAdder Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateLoanFeeAdderArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                      error
		updateLoanFeeAdderArcReq models.UpdateLoanFeeAdderArchive
		queryParameters          []interface{}
		result                   []interface{}
	)

	log.EnterFn(0, "HandleUpdateLoanFeeAdderArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLoanFeeAdderArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update loan fee adder archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update loan fee adder archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateLoanFeeAdderArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update loan fee adder archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update loan fee adder archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateLoanFeeAdderArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateLoanFeeAdderArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateLoanFeeAdderArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateLoanFeeAdderArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update loan fee adder archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update loan fee adder archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "loan fee adder archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Loan Fee Adder Archive Updated Successfully", http.StatusOK, nil)
}
