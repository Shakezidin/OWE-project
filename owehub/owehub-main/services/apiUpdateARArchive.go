/**************************************************************************
* File			: apiUpdateARArchive.go
* DESCRIPTION	: This file contains functions for update AR archive
* DATE			: 01-Apr-2024
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
 * FUNCTION:		HandleUpdateARArchiveRequest
 * DESCRIPTION:     handler for update AR Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateARArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		updateARArcReq  models.UpdateARArchive
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateARArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateARArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update AR Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update AR Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateARArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update AR Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update AR Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateARArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateARArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateARArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateArArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update AR Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update AR Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "AR Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "AR Archive Updated Successfully", http.StatusOK, nil)
}
