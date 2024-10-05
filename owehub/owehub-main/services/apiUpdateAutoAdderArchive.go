/**************************************************************************
* File			: apiUpdateAutoAdderArchive.go
* DESCRIPTION	: This file contains functions for update auto adder archive
						setter handler
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
 * FUNCTION:		HandleUpdateAutoAdderArchiveRequest
 * DESCRIPTION:     handler for update Auto Adder Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleUpdateAutoAdderArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		updateAutoAdderArcReq models.UpdateAutoAdderArchive
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleUpdateAutoAdderArchiveRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAutoAdderArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update auto adder archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update auto adder archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAutoAdderArcReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update auto adder archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update auto adder archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateAutoAdderArcReq.RecordId) <= 0 {
		err = fmt.Errorf("Record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update Archive failed", http.StatusBadRequest, nil)
		return
	}

	// Convert slice of int64 to slice of interface{}
	var recordIDsInterface []interface{}
	for _, id := range updateAutoAdderArcReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	// Use pq.Array to properly format the array for PostgreSQL
	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateAutoAdderArcReq.IsArchived)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateAutoAdderArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update auto adder archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update auto adder archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "auto adder archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "Auto Adder Archive Updated Successfully", http.StatusOK, nil)
}
