/**************************************************************************
* File			: apiUpdateAdjustments.go
* DESCRIPTION	: This file contains functions for Update adjustments handler
* DATE			: 24-Apr-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update adjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateAdjustmentsReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update adjustments request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update adjustments request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateAdjustmentsReq.UniqueId) <= 0) || (len(UpdateAdjustmentsReq.Date) <= 0) ||
		(len(UpdateAdjustmentsReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateAdjustmentsReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	date, err := time.Parse("2006-01-02", UpdateAdjustmentsReq.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	queryParameters = append(queryParameters, UpdateAdjustmentsReq.RecordId)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.UniqueId)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Notes)
	queryParameters = append(queryParameters, UpdateAdjustmentsReq.Amount)
	// Call the database function

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateAdjustmentsFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update adjustments in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update adjustments", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adjustments updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Adjustments Updated Successfully", http.StatusOK, nil)
}
