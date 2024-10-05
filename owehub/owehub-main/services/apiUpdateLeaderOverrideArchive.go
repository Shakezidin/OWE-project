/**************************************************************************
* File			: apiUpdateLeaderOverrideArchive.go
* DESCRIPTION	: This file contains functions for update leader override archive handler
* DATE			: 239-Apr-2024
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
 * FUNCTION:		HandleUpdateLeaderOverrideArchiveRequest
 * DESCRIPTION:     handler for update LeaderOverrides Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateLeaderOverrideArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                        error
		updateLeaderOverrideArcReq models.UpdateLeaderOverrideArchive
		queryParameters            []interface{}
		result                     []interface{}
	)

	log.EnterFn(0, "HandleUpdateLeaderOverrideArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLeaderOverrideArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update leader override archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update leader override archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateLeaderOverrideArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update leader override archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update leader override archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateLeaderOverrideArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateLeaderOverrideArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateLeaderOverrideArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateLeaderOverrideArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update leader override archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update leader override archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "leader override archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Leader Overrides Archive Updated Successfully", http.StatusOK, nil)
}
