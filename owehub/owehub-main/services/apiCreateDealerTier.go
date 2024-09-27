/**************************************************************************
* File			: apiCreateDealerTier.go
* DESCRIPTION	: This file contains functions for create dealer tier
						setter handler
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
 * FUNCTION:		HandleCreateDealerTierRequest
 * DESCRIPTION:     handler for create Dealer Tier request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateDealerTierRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createDealertierReq models.CreateDealerTier
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleCreateDealerTierRequest")
	defer func() { log.ExitFn(0, "HandleCreateDealerTierRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create dealer tier request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create dealer tier request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDealertierReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create dealer tier request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Dealer Tier request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDealertierReq.DealerName) <= 0) || (len(createDealertierReq.Tier) <= 0) ||
		(len(createDealertierReq.StartDate) <= 0) || (len(createDealertierReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", createDealertierReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", createDealertierReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDealertierReq.DealerName)
	queryParameters = append(queryParameters, createDealertierReq.Tier)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateDealerTierFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add dealer tier in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Dealer Tier", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New dealer tier created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Dealer Tier Created Successfully", http.StatusOK, nil)
}
