/**************************************************************************
* File			: apiUpdateVAdders.go
* DESCRIPTION	: This file contains functions for update v_adders
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
 * FUNCTION:		HandleUpdateVAddersRequest
 * DESCRIPTION:     handler for update v_adders request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateVAddersRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		updateVAddersReq models.UpdateVAdder
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleUpdateVAddersRequest")
	defer func() { log.ExitFn(0, "HandleUpdateVAddersRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update v adders request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update v adders request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateVAddersReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update v adders request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update Adders request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateVAddersReq.AdderName) <= 0) || (len(updateVAddersReq.AdderType) <= 0) ||
		(len(updateVAddersReq.PriceType) <= 0) || (len(updateVAddersReq.PriceAmount) <= 0) ||
		(len(updateVAddersReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateVAddersReq.Active <= 0 {
		err = fmt.Errorf("Invalid Active Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Active Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateVAddersReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateVAddersReq.RecordId)
	queryParameters = append(queryParameters, updateVAddersReq.AdderName)
	queryParameters = append(queryParameters, updateVAddersReq.AdderType)
	queryParameters = append(queryParameters, updateVAddersReq.PriceType)
	queryParameters = append(queryParameters, updateVAddersReq.PriceAmount)
	queryParameters = append(queryParameters, updateVAddersReq.Active)
	queryParameters = append(queryParameters, updateVAddersReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateVAddersFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update v adders in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update Adders", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "v adders updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Adders Updated Successfully", http.StatusOK, nil)
}
