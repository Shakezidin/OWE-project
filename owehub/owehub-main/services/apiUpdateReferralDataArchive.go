/**************************************************************************
* File			: apiUpdateReferralDataArchive.go
* DESCRIPTION	: This file contains functions for update Referral Data archive
						setter handler
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
 * FUNCTION:		HandleUpdateReferralDataArchiveRequest
 * DESCRIPTION:     handler for update ReferralData Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateReferralDataArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                      error
		updateReferralDataArcReq models.UpdateReferralDataArchive
		queryParameters          []interface{}
		result                   []interface{}
	)

	log.EnterFn(0, "HandleUpdateReferralDataArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateReferralDataArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update ReferralData Archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update ReferralData Archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateReferralDataArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update ReferralData Archive request err: %v", err)
		return
	}

	if len(updateReferralDataArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateReferralDataArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateReferralDataArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateReferralDataArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update ReferralData Archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update ReferralData Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "ReferralData Archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "ReferralData Archive Updated Successfully", http.StatusOK, nil)
}
