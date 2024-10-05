/**************************************************************************
* File			: 	apiDeleteLeads.go
* DESCRIPTION	:   This file contains function to delete leads id's
* DATE			: 	26-Sep-2024
**************************************************************************/

package services

import (
	//"OWEApp/shared/appserver"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	// "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"net/http"
)

/******************************************************************************
 * FUNCTION       :		HandleDeleteRequest
 * DESCRIPTION    :     handler to delete request
 * INPUT          :		resp, req
 * RETURNS        :    	void
 ******************************************************************************/
func HandleDeleteRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err        error
		deleteData models.DeleteLeadsRequest
		query      string
		//whereEleList []interface{}
	)

	log.EnterFn(0, "HandleDeleteRequest")
	defer func() { log.ExitFn(0, "HandleDeleteRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in DeleteLeadsRequest ")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from DeleteLeadsRequest err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &deleteData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal delete data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal delete data request err:", http.StatusBadRequest, nil)
		return
	}

	if len(deleteData.IDs) <= 0 {
		err = fmt.Errorf("record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "list of Id is empty,  delete failed %v", err)
		appserver.FormAndSendHttpResp(resp, "list of Id is empty,  delete failed", http.StatusBadRequest, nil)
		return
	}

	//*************************************************************************************************

	// Create the placeholders for the IN clause: $1, $2, $3, ...
	length := len(deleteData.IDs)
	placeholders := make([]string, length)
	for i := 0; i < length; i++ {
		placeholders[i] = fmt.Sprintf("$%d", i+1) // Create $1, $2, $3, ...
	}

	// Create the WHERE clause with placeholders
	query = fmt.Sprintf("DELETE FROM leads_info WHERE leads_id IN (%s)", strings.Join(placeholders, ", "))

	//Prepare the list of arguments for the query
	queryParameters := make([]interface{}, length)
	for i, id := range deleteData.IDs {
		queryParameters[i] = id
	}

	///////****************************************************************************************

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete the lead id's")
		appserver.FormAndSendHttpResp(resp, "Failed to delete the lead id's", http.StatusInternalServerError, nil)
		return
	}

	log.DBTransDebugTrace(0, "Data Deleted Successfully")
	appserver.FormAndSendHttpResp(resp, "Data Deleted Successfully", http.StatusOK, nil)
}
