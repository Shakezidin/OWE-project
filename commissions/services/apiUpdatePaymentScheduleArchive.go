/**************************************************************************
* File			: apiUpdatePaymentScheduleArchive.go
* DESCRIPTION	: This file contains functions for update PaymentSchedule archive
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

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:		HandleUpdatePaymentScheduleArchiveRequest
 * DESCRIPTION:     handler for update PaymentSchedules Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdatePaymentScheduleArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                         error
		updatePaymentScheduleArcReq models.UpdatePaymentScheduleArchive
		queryParameters             []interface{}
		result                      []interface{}
	)

	log.EnterFn(0, "HandleUpdatePaymentScheduleArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdatePaymentScheduleArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update PaymentSchedules Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update PaymentSchedules Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updatePaymentScheduleArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update PaymentSchedules Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update PaymentSchedules Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updatePaymentScheduleArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updatePaymentScheduleArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updatePaymentScheduleArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdatePaymentScheduleArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update PaymentSchedules Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update PaymentSchedules Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "PaymentSchedules Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "PaymentSchedules Archive Updated Successfully", http.StatusOK, nil)
}
