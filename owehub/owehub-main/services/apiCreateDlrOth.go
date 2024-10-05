/**************************************************************************
* File			: apiCreateDLR_OTH.go
* DESCRIPTION	: This file contains functions for create dlr_oth handler
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
 * FUNCTION:		HandleCreateDlrOthRequest
 * DESCRIPTION:     handler for create dlr_oth request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateDLROTHDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		createDLR_OTHReq models.CreateDLR_OTH
		queryParameters  []interface{}
		result           []interface{}
		paid_Amount      float64
		balance          float64
		query            string
		data             []map[string]interface{}
	)

	log.EnterFn(0, "HandleCreateDLROTHDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateDLROTHDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create dlr_oth request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create dlr_oth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDLR_OTHReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create dlr_oth request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create dlr_oth request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDLR_OTHReq.Unique_Id) <= 0) || (len(createDLR_OTHReq.Payee) <= 0) ||
		(len(createDLR_OTHReq.Description) <= 0) ||
		(len(createDLR_OTHReq.Date) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDLR_OTHReq.Amount < 0 {
		appserver.FormAndSendHttpResp(resp, "Negative value not allowed", http.StatusBadRequest, nil)
		return
	}

	if len(createDLR_OTHReq.Payee) > 0 {
		query = fmt.Sprintf("SELECT amount from ap_dealer where unique_id = '%v' AND dealer = '%v' AND type = 'DLR-OTH'", createDLR_OTHReq.Unique_Id, createDLR_OTHReq.Payee)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get amount from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get amount from DB", http.StatusBadRequest, nil)
			return
		}

		if len(data) > 0 {
			paid_Amount, ok := data[0]["amount"].(float64)
			if !ok || paid_Amount == 0.0 {
				paid_Amount = 0.0
			}
		}
	}

	if len(createDLR_OTHReq.Payee) > 0 {
		balance = createDLR_OTHReq.Amount - paid_Amount
	}

	date, err := time.Parse("2006-01-02", createDLR_OTHReq.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDLR_OTHReq.Unique_Id)
	queryParameters = append(queryParameters, createDLR_OTHReq.Payee)
	queryParameters = append(queryParameters, createDLR_OTHReq.Amount)
	queryParameters = append(queryParameters, createDLR_OTHReq.Description)
	queryParameters = append(queryParameters, balance)
	queryParameters = append(queryParameters, paid_Amount)
	queryParameters = append(queryParameters, date)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateDLR_OTHFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add dlr_oth in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create dlr oth", http.StatusInternalServerError, nil)
		return
	}

	responce := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New dlr oth created with Id: %+v", responce["result"])
	appserver.FormAndSendHttpResp(resp, "Dlr_Oth Created Successfully", http.StatusOK, nil)
}
