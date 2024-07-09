/**************************************************************************
* File			: apiCreateVDealer.go
* DESCRIPTION	: This file contains functions for create v_Dealer handler
* DATE			: 22-May-2024
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
 * FUNCTION:		HandleCreateVDealerRequest
 * DESCRIPTION:     handler for create v_dealer request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateVDealerRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		createVDealerReq models.CreateVDealer
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleCreateVDealerRequest")
	defer func() { log.ExitFn(0, "HandleCreateVDealerRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create v dealer request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create v dealer request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createVDealerReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create v dealer request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create v dealer request", http.StatusBadRequest, nil)
		return
	}

	if (len(createVDealerReq.DealerCode) <= 0) || (len(createVDealerReq.DealerName) <= 0) ||
		(len(createVDealerReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createVDealerReq.DealerCode)
	queryParameters = append(queryParameters, createVDealerReq.DealerName)
	queryParameters = append(queryParameters, createVDealerReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateVDealerFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add v dealer in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create V dealer", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New v dealer created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "V Dealer Created Successfully", http.StatusOK, nil)
}
