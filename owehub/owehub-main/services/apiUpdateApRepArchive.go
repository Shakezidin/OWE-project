/**************************************************************************
* File			: 	apiUpdateApptSettersArchive.go
* DESCRIPTION	: This file contains functions to archive ap rep
* DATE			: 	21-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"io"

	"encoding/json"
	"fmt"
	"net/http"

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:				HandleApRepArchiveRequest
 * DESCRIPTION:     Handler to archive ap-rep
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/

func HandleApRepArchiveRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		updateApRepReq  models.UpdateApRepArchive
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleApRepArchiveRequest")
	defer func() { log.ExitFn(0, "HandleApRepArchiveRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update ap-rep archive request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from ap-rep archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateApRepReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update ap-rep archive request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update ap-rep archive request", http.StatusBadRequest, nil)
		return
	}

	if len(updateApRepReq.RecordId) <= 0 {
		err = errors.New("record id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty, Update ap-rep archive failed", http.StatusBadRequest, nil)
		return
	}

	var recordIDsInterface []interface{}
	for _, id := range updateApRepReq.RecordId {
		recordIDsInterface = append(recordIDsInterface, id)
	}

	queryParameters = append(queryParameters, pq.Array(recordIDsInterface))
	queryParameters = append(queryParameters, updateApRepReq.IsArchived)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateApRepArchiveFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update ap-rep archive in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update ap-rep archive", http.StatusInternalServerError, nil)
		return
	}
	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "ap-rep archive updated with Id: %+v", data)
	appserver.FormAndSendHttpResp(resp, "ap-rep Archive Updated Successfully", http.StatusOK, nil)
}
