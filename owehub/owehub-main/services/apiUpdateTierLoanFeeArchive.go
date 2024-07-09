/**************************************************************************
* File			: apiUpdateTierLoanFeeArchive.go
* DESCRIPTION	: This file contains functions for update TierLoanFee archive
						setter handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleUpdateTierLoanFeeArchiveRequest
 * DESCRIPTION:     handler for update TierLoanFee Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateTierLoanFeeArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		updateTierLoanFeeArcReq models.UpdateTierLoanFeeArchive
		queryParameters         []interface{}
		result                  []interface{}
	)

	log.EnterFn(0, "HandleUpdateTierLoanFeeArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateTierLoanFeeArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update tier loan fee Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update tier loan fee Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateTierLoanFeeArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update tier loan fee Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update tier loan fee Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateTierLoanFeeArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update tier loan fee Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateTierLoanFeeArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateTierLoanFeeArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateTierLoanFeeArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update tier loan fee Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update tier loan fee Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "tier loan fee Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "tier loan fee Archive Updated Successfully", http.StatusOK, nil)
}
