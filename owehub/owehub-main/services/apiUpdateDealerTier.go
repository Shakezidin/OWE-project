/**************************************************************************
* File			: apiUpdateDealerTier.go
* DESCRIPTION	: This file contains functions for update dealer tier
						setter handler
* DATE			: 23-Jan-2024
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
		err = fmt.Errorf("HTTP Request body is null in update Dealer Tier request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Dealer Tier request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealertierReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Dealer Tier request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update Dealer Tier request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateDealertierReq.DealerName) <= 0) || (len(updateDealertierReq.Tier) <= 0) ||
		(len(updateDealertierReq.StartDate) <= 0) || (len(updateDealertierReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateDealertierReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateDealertierReq.RecordId)
	queryParameters = append(queryParameters, updateDealertierReq.DealerName)
	queryParameters = append(queryParameters, updateDealertierReq.Tier)
	queryParameters = append(queryParameters, updateDealertierReq.StartDate)
	queryParameters = append(queryParameters, updateDealertierReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateDealerTierFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Dealer Tier in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update Dealer Tier", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Dealer Tier updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Dealer Tier Updated Successfully", http.StatusOK, nil)
}
