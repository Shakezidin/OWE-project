/**************************************************************************
* File			: apiUpdateDealerCredit.go
* DESCRIPTION	: This file contains functions for Update dealer credit handler
* DATE			: 25-Apr-2024
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
 * FUNCTION:		HandleUpdateDealerCreditRequest
 * DESCRIPTION:     handler for dealer credit data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateDealerCreditRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateDealerCredit models.UpdateDealerCredit
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateDealerCreditRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDealerCreditRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dealer credit request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dealer credit request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealerCredit)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dealer credit request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Update Dealer Credit request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateDealerCredit.UniqueID) <= 0) || (len(updateDealerCredit.Customer) <= 0) ||
		(len(updateDealerCredit.DealerName) <= 0) || (len(updateDealerCredit.DealerDBA) <= 0) ||
		(len(updateDealerCredit.ExactAmount) <= 0) || (len(updateDealerCredit.ApprovedBy) <= 0) ||
		(len(updateDealerCredit.Notes) <= 0) || (len(updateDealerCredit.StartDate) <= 0) ||
		(updateDealerCredit.EndDate != nil && len(*updateDealerCredit.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerCredit.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerCredit.PerKWAmount <= float64(0) {
		err = fmt.Errorf("Invalid PerKWAmount price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerKWAmount price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerCredit.TotalAmount <= float64(0) {
		err = fmt.Errorf("Invalid TotalAmount value: %f, Not Allowed", updateDealerCredit.TotalAmount)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Total Amount value Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerCredit.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid SysSize value: %f, Not Allowed", updateDealerCredit.SysSize)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sys Size value Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateDealerCredit.UniqueID)
	queryParameters = append(queryParameters, updateDealerCredit.Customer)
	queryParameters = append(queryParameters, updateDealerCredit.DealerName)
	queryParameters = append(queryParameters, updateDealerCredit.DealerDBA)
	queryParameters = append(queryParameters, updateDealerCredit.ExactAmount)
	queryParameters = append(queryParameters, updateDealerCredit.PerKWAmount)
	queryParameters = append(queryParameters, updateDealerCredit.ApprovedBy)
	queryParameters = append(queryParameters, updateDealerCredit.Notes)
	queryParameters = append(queryParameters, updateDealerCredit.TotalAmount)
	queryParameters = append(queryParameters, updateDealerCredit.SysSize)
	queryParameters = append(queryParameters, updateDealerCredit.StartDate)
	queryParameters = append(queryParameters, updateDealerCredit.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDealerCreditFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dealer credit in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update dealer credit", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer credit updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Dealer Credit Updated Successfully", http.StatusOK, nil)
}
