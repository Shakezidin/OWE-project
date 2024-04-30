/**************************************************************************
* File			: apiUpdateAdderCreditArchive.go
* DESCRIPTION	: This file contains functions for update AdderCredit archive
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
 * FUNCTION:		HandleUpdateAdderCreditArchiveRequest
 * DESCRIPTION:     handler for update AdderCredit Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateAdderCreditArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		updateAdderCreditArcReq models.UpdateAdderCreditArchive
		queryParameters         []interface{}
		result                  []interface{}
	)

	log.EnterFn(0, "HandleUpdateAdderCreditArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdderCreditArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update AdderCredit Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update AdderCredit Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAdderCreditArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update AdderCredit Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update AdderCredit Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateAdderCreditArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateAdderCreditArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateAdderCreditArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateAdderCreditArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update AdderCredit Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update AdderCredit Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "AdderCredit Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "AdderCredit Archive Updated Successfully", http.StatusOK, nil)
}
