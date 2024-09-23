/**************************************************************************
* File			: apiUpdateRebatedata.go
* DESCRIPTION	: This file contains functions for update RebateData
						setter handler
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
 * FUNCTION:		HandleUpdateRebateDataRequest
 * DESCRIPTION:     handler for update Rebate Data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateRebateDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		updateRebateDataReq models.UpdateRebateData
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleUpdateRebateDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateRebateDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update rebate data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update rebate data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateRebateDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update rebate data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update rebate data request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateRebateDataReq.UniqueId) <= 0) || (len(updateRebateDataReq.CustomerVerf) <= 0) ||
		(len(updateRebateDataReq.Date) <= 0) || (len(updateRebateDataReq.Type) <= 0) ||
		(len(updateRebateDataReq.Item) <= 0) || (len(updateRebateDataReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateRebateDataReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid Repdolldivbyper Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateRebateDataReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid Amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	date, err := time.Parse("2006-01-02", updateRebateDataReq.Date)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateRebateDataReq.RecordId)
	queryParameters = append(queryParameters, updateRebateDataReq.CustomerVerf)
	queryParameters = append(queryParameters, updateRebateDataReq.UniqueId)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, updateRebateDataReq.Type)
	queryParameters = append(queryParameters, updateRebateDataReq.Item)
	queryParameters = append(queryParameters, updateRebateDataReq.Amount)
	queryParameters = append(queryParameters, updateRebateDataReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, updateRebateDataReq.Notes)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateRebateDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update rebate data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update rebate data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "rebate data updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "rebate data Updated Successfully", http.StatusOK, nil)
}
