/**************************************************************************
* File			: apiUpdateLoanFeeArchive.go
* DESCRIPTION	: This file contains functions for update LoanFee archive
						setter handler
* DATE			: 29-Apr-2024
**************************************************************************/

package services

import (
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
 * FUNCTION:		HandleUpdateLoanFeeArchiveRequest
 * DESCRIPTION:     handler for update LoanFee Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateLoanFeeArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		updateLoanFeeArcReq models.UpdateLoanFeeArchive
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleUpdateLoanFeeArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLoanFeeArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update LoanFee Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update LoanFee Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateLoanFeeArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update LoanFee Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update LoanFee Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateLoanFeeArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateLoanFeeArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateLoanFeeArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateLoanFeeArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update LoanFee Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update LoanFee Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "LoanFee Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "LoanFee Archive Updated Successfully", http.StatusOK, nil)
}
