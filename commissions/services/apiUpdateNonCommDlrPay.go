/**************************************************************************
* File			: apiUpdateNonCommDlrPayArchive.go
* DESCRIPTION	: This file contains functions for update NonCommDlrPay archive
						setter handler
* DATE			: 25-Apr-2024
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
 * FUNCTION:		HandleUpdateNonCommDlrPayArchiveRequest
 * DESCRIPTION:     handler for update NonCommDlrPay Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateNonCommDlrPayArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                       error
		updateNonCommDlrPayArcReq models.UpdateNonCommDlrPayArchive
		queryParameters           []interface{}
		result                    []interface{}
	)

	log.EnterFn(0, "HandleUpdateNonCommDlrPayArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateNonCommDlrPayArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update NonCommDlrPay Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update NonCommDlrPay Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateNonCommDlrPayArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update NonCommDlrPay Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update NonCommDlrPay Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateNonCommDlrPayArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateNonCommDlrPayArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateNonCommDlrPayArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateNonCommDlrPayArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update NonCommDlrPay Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update NonCommDlrPay Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "NonCommDlrPay Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "NonCommDlrPay Archive Updated Successfully", http.StatusOK, nil)
}
