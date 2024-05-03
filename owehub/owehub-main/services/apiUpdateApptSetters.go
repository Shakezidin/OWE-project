/**************************************************************************
* File			: apiUpdateApptSetters.go
* DESCRIPTION	: This file contains functions for Update appointment
						setter handler
* DATE			: 01-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateApptSettersRequest
 * DESCRIPTION:     handler for Update appt setters request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateApptSettersDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		UpdateApptSettersReq models.UpdateApptSettersReq
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleUpdateApptSettersRequest")
	defer func() { log.ExitFn(0, "HandleUpdateApptSettersRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update appt setters request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update appt setters request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateApptSettersReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update appt setters request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update appt setters request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateApptSettersReq.UniqueId) <= 0) || (len(UpdateApptSettersReq.Name) <= 0) ||
		(len(UpdateApptSettersReq.TeamName) <= 0) || (len(UpdateApptSettersReq.PayRate) <= 0) ||
		(len(UpdateApptSettersReq.StartDate) <= 0) || (len(UpdateApptSettersReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateApptSettersReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, UpdateApptSettersReq.RecordId)
	queryParameters = append(queryParameters, UpdateApptSettersReq.UniqueId)
	queryParameters = append(queryParameters, UpdateApptSettersReq.Name)
	queryParameters = append(queryParameters, UpdateApptSettersReq.TeamName)
	queryParameters = append(queryParameters, UpdateApptSettersReq.PayRate)
	queryParameters = append(queryParameters, UpdateApptSettersReq.StartDate)
	queryParameters = append(queryParameters, UpdateApptSettersReq.EndDate)

	result, err = db.CallDBFunction(db.UpdateApptSettersFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update appt setters in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Uudate appt setters", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "appt setters updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Appt Setters Updated Successfully", http.StatusOK, nil)
}
