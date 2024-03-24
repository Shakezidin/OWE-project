/**************************************************************************
* File			: apiCreateDealerTier.go
* DESCRIPTION	: This file contains functions for create dealer tier
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

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
		err = fmt.Errorf("HTTP Request body is null in create Dealer Tier request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Dealer Tier request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDealertierReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Dealer Tier request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Dealer Tier request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDealertierReq.DealerName) <= 0) || (len(createDealertierReq.Tier) <= 0) ||
		(len(createDealertierReq.StartDate) <= 0) || (len(createDealertierReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDealertierReq.DealerName)
	queryParameters = append(queryParameters, createDealertierReq.Tier)
	queryParameters = append(queryParameters, createDealertierReq.StartDate)
	queryParameters = append(queryParameters, createDealertierReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateDealerTierFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Dealer Tier in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Dealer Tier", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Dealer Tier created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Dealer Tier Created Sucessfully", http.StatusOK, nil)
}
