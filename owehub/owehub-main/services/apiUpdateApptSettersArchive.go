/**************************************************************************
* File			: apiUpdateApptSettersArchive.go
* DESCRIPTION	: This file contains functions for update appt setters archive handler
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
 * FUNCTION:		HandleUpdateApptSettersArchiveRequest
 * DESCRIPTION:     handler for update ApptSetters Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateApptSettersArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                     error
		updateApptSettersArcReq models.UpdateApptSettersArchive
		queryParameters         []interface{}
		result                  []interface{}
	)

	log.EnterFn(0, "HandleUpdateApptSettersArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateApptSettersArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update appt setters archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update appt setters archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateApptSettersArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update appt setters archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update appt setters archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateApptSettersArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateApptSettersArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateApptSettersArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateApptSettersArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update appt setters archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update appt setters archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "appt setters archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "Appt Setters Archive Updated Successfully", http.StatusOK, nil)
}
