/**************************************************************************
* File			: apiUpdateMarketingFeesArchive.go
* DESCRIPTION	: This file contains functions for update MarketingFees archive
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateMarketingFeesArchiveRequest
 * DESCRIPTION:     handler for update MarketingFeess Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateMarketingFeesArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                       error
		updateMarketingFeesArcReq models.UpdateMarketingFeeArchive
		queryParameters           []interface{}
		result                    []interface{}
	)

	log.EnterFn(0, "HandleUpdateMarketingFeesArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateMarketingFeesArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update marketing fees Archive request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update marketing fees Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateMarketingFeesArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update marketing fees Archive request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update marketing fees Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateMarketingFeesArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Record Id is empty, Update marketing fees Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateMarketingFeesArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateMarketingFeesArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateMarketingFeesArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update marketing fees Archive in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update marketing fees Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "marketing fees Archive updated with Id: %+v", data)
	FormAndSendHttpResp(resp, "marketing fees Archive Updated Successfully", http.StatusOK, nil)
}
