/**************************************************************************
* File			: apiUpdateVAddersArchive.go
* DESCRIPTION	: This file contains functions for update VAdders archive
						setter handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleUpdateVAddersArchiveRequest
 * DESCRIPTION:     handler for update VAdders Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateVAddersArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateVAdderArcReq models.UpdateVAdderArchive
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateVAddersArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateVAddersArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update vadder Archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update vadder Archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateVAdderArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update vadder Archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update vadder Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateVAdderArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update vadder Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateVAdderArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateVAdderArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateVAddersArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update vadder Archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update vadder Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "vadder Archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "vadder Archive Updated Successfully", http.StatusOK, nil)
}
