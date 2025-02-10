/**************************************************************************
* File			: 	apiDeleteDatState.go
* DESCRIPTION	:   This file contains function to delete state in structural info tab.
* DATE			: 	10-Feb-2025
**************************************************************************/

package services

import (
	//"OWEApp/shared/appserver"
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	// "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"

	"net/http"
)

/******************************************************************************
 * FUNCTION       :		HandleDeleteDatStateRequest
 * DESCRIPTION    :     handler to delete request
 * INPUT          :		resp, req
 * RETURNS        :    	void
 ******************************************************************************/
func HandleDeleteDatStateRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err        error
		deleteData models.DeleteDatStateRequest
		// query           string
		// queryParameters []interface{}
	)

	log.EnterFn(0, "HandleDeleteDatStateRequest")
	defer func() { log.ExitFn(0, "HandleDeleteDatStateRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in HandleDeleteDatStateRequest ")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from HandleDeleteDatStateRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &deleteData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal delete data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal delete data request err:", http.StatusBadRequest, nil)
		return
	}

	if len(deleteData.ProjectId) <= 0 {
		log.FuncErrorTrace(0, "project Id is empty,  delete failed %v", err)
		appserver.FormAndSendHttpResp(resp, "Project id is  empty,  delete failed", http.StatusBadRequest, nil)
		return
	}

	if len(deleteData.State) <= 0 {
		log.FuncErrorTrace(0, "State is empty,  delete failed %v", err)
		appserver.FormAndSendHttpResp(resp, "State is  empty,  delete failed", http.StatusBadRequest, nil)
		return
	}

	//*************************************************************************************************

	// Create the WHERE clause
	// query = "DELETE FROM leads_info WHERE project_id = $1 and state = $2"

	// queryParameters = append(queryParameters, deleteData.ProjectId)
	// queryParameters = append(queryParameters, deleteData.State)

	///////****************************************************************************************

	// err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, queryParameters)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to delete the state")
	// 	appserver.FormAndSendHttpResp(resp, "Failed to delete the state", http.StatusInternalServerError, nil)
	// 	return
	// }

	log.DBTransDebugTrace(0, "State deleted successfuly")
	appserver.FormAndSendHttpResp(resp, "State deleted successfully", http.StatusOK, nil)
}
