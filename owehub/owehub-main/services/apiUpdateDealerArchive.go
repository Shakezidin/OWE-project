/**************************************************************************
* File			: apiUpdateDealerArchive.go
* DESCRIPTION	: This file contains functions for update Dealer archive handler
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
 * FUNCTION:		HandleUpdateDealerArchiveRequest
 * DESCRIPTION:     handler for update Dealers Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateDealerArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateDealerArcReq models.UpdateDealerArchive
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateDealerArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDealerArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dealer archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dealer archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealerArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dealer archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update dealer archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateDealerArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateDealerArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateDealerArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateDealerOverrideArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dealer archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update dealer archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "Dealer Archive Updated Successfully", http.StatusOK, nil)
}
