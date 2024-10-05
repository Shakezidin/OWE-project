/**************************************************************************
* File			: apiDBAArchive.go
* DESCRIPTION	: This file contains functions for  appt setters archive handler
* DATE			: 01-Apr-2024
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
 * FUNCTION:		HandleDBAArchiveRequest
 * DESCRIPTION:     handler for  DBA Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleDBAArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		DBAArcReq       models.ArchiveDBA
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleDBAArchiveRequest")
	defer func() { log.ExitFn(0, "HandleDBAArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in  appt setters archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from  appt setters archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &DBAArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal  appt setters archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal  appt setters archive request", http.StatusBadRequest, nil)
		return
	}

	if len(DBAArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty,  archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range DBAArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, DBAArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDBAArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to  appt setters archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to  appt setters archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "appt setters archive d with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Appt Setters Archive d Successfully", http.StatusOK, nil)
}
