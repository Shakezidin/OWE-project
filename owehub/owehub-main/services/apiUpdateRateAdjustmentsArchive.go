/**************************************************************************
* File			: apiUpdateRateAdjustmentsArchive.go
* DESCRIPTION	: This file contains functions for update RateAdjustments archive
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
 * FUNCTION:		HandleUpdateRateAdjustmentsArchiveRequest
 * DESCRIPTION:     handler for update RateAdjustments Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateRateAdjustmentsArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                         error
		updateRateAdjustmentsArcReq models.UpdateRateAdjustmentsArchive
		queryParameters             []interface{}
		result                      []interface{}
	)

	log.EnterFn(0, "HandleUpdateRateAdjustmentsArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateRateAdjustmentsArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update RateAdjustments Archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update RateAdjustments Archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateRateAdjustmentsArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update RateAdjustments Archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update RateAdjustments Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateRateAdjustmentsArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateRateAdjustmentsArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateRateAdjustmentsArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRateAdjustmentsArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update RateAdjustments Archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update RateAdjustments Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "RateAdjustments Archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "RateAdjustments Archive Updated Succesfully", http.StatusOK, nil)
}
