/**************************************************************************
* File			: apiUpdateCommissionArchive.go
* DESCRIPTION	: This file contains functions for update commission archive
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
 * FUNCTION:		HandleUpdateCommissionArchiveRequest
 * DESCRIPTION:     handler for update commissions Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateCommissionArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                    error
		updateCommissionArcReq models.UpdateCommissionArchive
		queryParameters        []interface{}
		result                 []interface{}
	)

	log.EnterFn(0, "HandleUpdateCommissionArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateCommissionArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update commissions Archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update commissions Archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateCommissionArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update commissions Archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update commissions Archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateCommissionArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateCommissionArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateCommissionArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateCommissionArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update commissions Archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update commissions Archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "commissions Archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Commissions Archive Updated Successfully", http.StatusOK, nil)
}
