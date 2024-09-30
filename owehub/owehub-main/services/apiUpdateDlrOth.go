/**************************************************************************
* File			: apiupdateDLR_OTH.go
* DESCRIPTION	: This file contains functions for update dlr_oth handler
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
 * FUNCTION:		HandleUpdateDLROTHDataRequest
 * DESCRIPTION:     handler for update dlr_oth request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateDLROTHDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		updateDLR_OTHReq models.UpdateDLR_OTHData
		queryParameters  []interface{}
		result           []interface{}
		query            string
		data             []map[string]interface{}
		paid_Amount      float64
		balance          float64
	)

	log.EnterFn(0, "HandleUpdateDLROTHDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDLROTHDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dlr_oth request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dlr_oth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDLR_OTHReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dlr_oth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update dlr_oth request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateDLR_OTHReq.Unique_Id) <= 0) || (len(updateDLR_OTHReq.Payee) <= 0) ||
		(len(updateDLR_OTHReq.Description) <= 0) ||
		(len(updateDLR_OTHReq.Date) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDLR_OTHReq.Record_Id <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if len(updateDLR_OTHReq.Payee) > 0 {
		query = fmt.Sprintf("SELECT amount as amount from ap_dealer where unique_id = '%v' AND dealer = '%v' AND type = 'DLR-OTH'", updateDLR_OTHReq.Unique_Id, updateDLR_OTHReq.Payee)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get customer, dealer_name,dealerDba from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get customer, dealer_name,dealerDba from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			paid_Amount, ok := data[0]["amount"].(float64)
			if !ok || paid_Amount == 0.0 {
				paid_Amount = 0.0
			}
		}

	}

	if len(updateDLR_OTHReq.Payee) > 0 {
		balance = updateDLR_OTHReq.Amount - paid_Amount
	}

	date, err := time.Parse("2006-01-02", updateDLR_OTHReq.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateDLR_OTHReq.Record_Id)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Unique_Id)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Payee)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Amount)
	queryParameters = append(queryParameters, updateDLR_OTHReq.Description)
	queryParameters = append(queryParameters, balance)
	queryParameters = append(queryParameters, paid_Amount)
	queryParameters = append(queryParameters, date)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDLR_OTHFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dlr_oth in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update dlr_oth", http.StatusInternalServerError, nil)
		return
	}

	responce := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dlr_oth updated with Id: %+v", responce["result"])
	appserver.FormAndSendHttpResp(resp, "Dlr Oth Updated Successfully", http.StatusOK, nil)
}
