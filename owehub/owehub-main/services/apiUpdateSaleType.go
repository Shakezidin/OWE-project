/**************************************************************************
* File			: apiUpdateSaleType.go
* DESCRIPTION	: This file contains functions for update sale type
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
)

/******************************************************************************
 * FUNCTION:		HandleUpdateSaleTypeRequest
 * DESCRIPTION:     handler for update sale type request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateSaleTypeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		updateSaleTypeReq models.UpdateSaleType
		queryParameters   []interface{}
		result            []interface{}
	)

	log.EnterFn(0, "HandleUpdateSaleTypeRequest")
	defer func() { log.ExitFn(0, "HandleUpdateSaleTypeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update sale type request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update sale type request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateSaleTypeReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update sale type request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update sale type request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateSaleTypeReq.TypeName) <= 0) || (len(updateSaleTypeReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateSaleTypeReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, updateSaleTypeReq.RecordId)
	queryParameters = append(queryParameters, updateSaleTypeReq.TypeName)
	queryParameters = append(queryParameters, updateSaleTypeReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateSaleTypeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update sale type in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update sale type", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "sale type updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "sale type Updated Successfully", http.StatusOK, nil)
}
