/**************************************************************************
* File			: apiUpdateDealer.go
* DESCRIPTION	: This file contains functions for update dealer
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
 * FUNCTION:		HandleUpdateDealerRequest
 * DESCRIPTION:     handler for update dealer request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateDealerRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		updateDealerReq models.UpdateDealer
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateDealerRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDealerRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dealer request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dealer request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealerReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dealer request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update dealer request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateDealerReq.SubDealer) <= 0) || (len(updateDealerReq.Dealer) <= 0) ||
		(len(updateDealerReq.PayRate) <= 0) || (len(updateDealerReq.StartDate) <= 0) ||
		(len(updateDealerReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateDealerReq.RecordId)
	queryParameters = append(queryParameters, updateDealerReq.SubDealer)
	queryParameters = append(queryParameters, updateDealerReq.Dealer)
	queryParameters = append(queryParameters, updateDealerReq.PayRate)
	queryParameters = append(queryParameters, updateDealerReq.StartDate)
	queryParameters = append(queryParameters, updateDealerReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateDealerOverrideFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update dealer in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update dealer", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Dealer Updated Successfully", http.StatusOK, nil)
}
