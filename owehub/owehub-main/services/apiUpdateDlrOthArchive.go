/**************************************************************************
* File			: apiUpdateDLROTHArchive.go
* DESCRIPTION	: This file contains functions for update DLROTH archive
* DATE			: 26-Apr-2024
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
 * FUNCTION:		HandleUpdateDLROTHArchiveRequest
 * DESCRIPTION:     handler for update DLROTH Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateDLROTHArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateDLROTHArcReq models.UpdateDLR_OTHArchive
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateDLROTHArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDLROTHArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update DLROTH archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update DLROTH archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDLROTHArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update DLROTH archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update DLROTH archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateDLROTHArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, update DLROTH archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateDLROTHArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateDLROTHArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDLR_OTHArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update DLROTH archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update DLROTH archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "DLROTH archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "DLROTH Archive Updated Successfully", http.StatusOK, nil)
}
