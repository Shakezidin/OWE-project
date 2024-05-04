/**************************************************************************
* File			: apiUpdateAdjustments.go
* DESCRIPTION	: This file contains functions for Update adjustments handler
* DATE			: 24-Apr-2024
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
 * FUNCTION:		HandleUpdateAdjustmentsRequest
 * DESCRIPTION:     handler for Update adjustments request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateAdjustmentsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		UpdateAdjustmentsReq models.UpdateAdjustments
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleUpdateAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update adjustments request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update adjustments request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateAdjustmentsReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update adjustments request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update adjustments request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateAdjustmentsReq.UniqueId) <= 0) || (len(UpdateAdjustmentsReq.Customer) <= 0) ||
		(len(UpdateAdjustmentsReq.PartnerName) <= 0) || (len(UpdateAdjustmentsReq.InstallerName) <= 0) ||
		(len(UpdateAdjustmentsReq.StateName) <= 0) || (len(UpdateAdjustmentsReq.Bl) <= 0) ||
		(len(UpdateAdjustmentsReq.Notes) <= 0) || (len(UpdateAdjustmentsReq.StartDate) <= 0) ||
		(len(UpdateAdjustmentsReq.EndDate) <= 0) || (len(UpdateAdjustmentsReq.Date) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdjustmentsReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid Sys Size Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sys Size, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdjustmentsReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdjustmentsReq.Epc <= float64(0) {
		err = fmt.Errorf("Invalid epc Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Epc, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateAdjustmentsReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid amount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.RecordId)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.UniqueId)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Customer)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.PartnerName)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.InstallerName)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.StateName)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.SysSize)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Bl)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Epc)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Date)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Notes)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Amount)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.StartDate)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.EndDate)

	// Call the database function

	result, err = db.CallDBFunction(db.UpdateAdjustmentsFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update adjustments in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update adjustments", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adjustments updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Adjustments Updated Successfully", http.StatusOK, nil)
}
