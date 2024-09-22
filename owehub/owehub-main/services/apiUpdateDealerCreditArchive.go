/**************************************************************************
* File			: apiUpdateDealerCreditArchive.go
* DESCRIPTION	: This file contains functions for update dealer credit archive handler
* DATE			: 25-Apr-2024
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
 * FUNCTION:		HandleUpdateCreditDealerArchiveRequest
 * DESCRIPTION:     handler for update DealerCredit Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateCreditDealerArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                      error
		updateDealerCreditArcReq models.UpdateDealerCreditArchive
		queryParameters          []interface{}
		result                   []interface{}
	)

	log.EnterFn(0, "HandleUpdateCreditDealerArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateCreditDealerArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dealer credit archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dealer credit archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealerCreditArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dealer credit archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update dealer credit archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateDealerCreditArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateDealerCreditArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateDealerCreditArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDealerCreditArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dealer credit archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update dealer credit archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer credit archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Dealer Credit Archive Updated Successfully", http.StatusOK, nil)
}
