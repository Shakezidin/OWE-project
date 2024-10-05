/**************************************************************************
* File			: apiUpdateDealerTierArchive.go
* DESCRIPTION	: This file contains functions for update dealer tier archive
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
 * FUNCTION:		HandleUpdateDealerTierArchiveRequest
 * DESCRIPTION:     handler for update DealerTier Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateDealerTierArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                    error
		updateDealerTierArcReq models.UpdateDealerTierArchive
		queryParameters        []interface{}
		result                 []interface{}
	)

	log.EnterFn(0, "HandleUpdateDealerTierArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDealerTierArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dealer tier archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dealer tier archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealerTierArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dealer tier archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update dealer tier archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateDealerTierArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, update archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateDealerTierArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateDealerTierArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDealerTierArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dealer tier archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update dealer tier archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer tier archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Dealer Tier Archive Updated Successfully", http.StatusOK, nil)
}
