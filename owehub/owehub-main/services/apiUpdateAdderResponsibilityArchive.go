/**************************************************************************
* File			: apiUpdateAdderResponsibilityArchive.go
* DESCRIPTION	: This file contains functions for update adder responsibility archive handler
* DATE			: 24-Jan-2024
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
 * FUNCTION:		HandleUpdateAdderResponsibilityArchiveRequest
 * DESCRIPTION:     handler for update adder responsibility archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateAdderResponsibilityArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                             error
		updateAdderResponsibilityArcReq models.UpdateAdderResponsibilityArchive
		queryParameters                 []interface{}
		result                          []interface{}
	)

	log.EnterFn(0, "HandleUpdateAdderResponsibilityArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdderResponsibilityArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update adder responsibility archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update adder responsibility archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAdderResponsibilityArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update adder responsibility archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update adder responsibility archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateAdderResponsibilityArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, update adder responsibility archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateAdderResponsibilityArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateAdderResponsibilityArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateAdderResponsibilityArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update adder responsibility archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update adder responsibility archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adder responsibility archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Adder Responsibility Archive Updated Successfully", http.StatusOK, nil)
}
