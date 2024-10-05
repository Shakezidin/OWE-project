/**************************************************************************
* File			: apiUpdateNonCommDlrPayArchive.go
* DESCRIPTION	: This file contains functions for update NonCommDlrPay archive
						setter handler
* DATE			: 25-Apr-2024
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
		err = fmt.Errorf("HTTP Request body is null in update non comm dlrpay archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update non comm dlrpay archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateNonCommDlrPayArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update non comm dlrpay archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update non comm dlrpay archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateNonCommDlrPayArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
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
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateNonCommDlrPayArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update non comm dlrpay archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update non comm dlrpay archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "non comm dlrpay archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Non Comm DlrPay Archive Updated Successfully", http.StatusOK, nil)
}
