/**************************************************************************
* File			: apiUpdateDealerTier.go
* DESCRIPTION	: This file contains functions for update dealer tier handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleUpdateDealerTierRequest
 * DESCRIPTION:     handler for update Dealer Tier request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateDealerTierRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		updateDealertierReq models.UpdateDealerTier
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleUpdateDealerTierRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDealerTierRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dealer tier request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dealer tier request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealertierReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dealer tier request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update dealer tier request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateDealertierReq.DealerName) <= 0) || (len(updateDealertierReq.Tier) <= 0) ||
		(len(updateDealertierReq.StartDate) <= 0) || (len(updateDealertierReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateDealertierReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", updateDealertierReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date, Update failed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", updateDealertierReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateDealertierReq.RecordId)
	queryParameters = append(queryParameters, updateDealertierReq.DealerName)
	queryParameters = append(queryParameters, updateDealertierReq.Tier)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDealerTierFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dealer tier in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update dealer tier", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer tier updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Dealer Tier Updated Successfully", http.StatusOK, nil)
}
