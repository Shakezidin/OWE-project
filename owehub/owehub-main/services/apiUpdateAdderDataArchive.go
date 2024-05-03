/**************************************************************************
* File			: apiUpdateAdderDataArchive.go
* DESCRIPTION	: This file contains functions for update AdderData archive
						setter handler
* DATE			: 24-Jan-2024
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
 * FUNCTION:		HandleUpdateAdderDataArchiveRequest
 * DESCRIPTION:     handler for update AdderData Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateAdderDataArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		updateAdderDataArcReq models.UpdateAdderDataArchive
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleUpdateAdderDataArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdderDataArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update AdderData Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update AdderData Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAdderDataArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update AdderData Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update AdderData Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateAdderDataArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateAdderDataArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateAdderDataArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateAdderDataArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update AdderData Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update AdderData Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "AdderData Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "AdderData Archive Updated Successfully", http.StatusOK, nil)
}
