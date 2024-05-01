/**************************************************************************
* File			: apiUpdateArScheduleArchive.go
* DESCRIPTION	: This file contains functions for update ArSchedule archive
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
 * FUNCTION:		HandleUpdateArScheduleArchiveRequest
 * DESCRIPTION:     handler for update ArSchedules Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateArScheduleArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                    error
		updateArScheduleArcReq models.UpdateArScheduleArchive
		queryParameters        []interface{}
		result                 []interface{}
	)

	log.EnterFn(0, "HandleUpdateArScheduleArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateArScheduleArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update ArSchedules Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update ArSchedules Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateArScheduleArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update ArSchedules Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update ArSchedules Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateArScheduleArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateArScheduleArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateArScheduleArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateArScheduleArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update ArSchedule Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update ArSchedule Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "ArSchedule Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "ArScheule Archive Updated Successfully", http.StatusOK, nil)
}
