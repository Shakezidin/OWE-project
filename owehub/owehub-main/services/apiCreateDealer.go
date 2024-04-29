/**************************************************************************
* File			: apiCreateDealer.go
* DESCRIPTION	: This file contains functions for create dealer
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
 * FUNCTION:		HandleCreateDealerRequest
 * DESCRIPTION:     handler for create Dealers request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateDealerRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createDealerReq models.CreateDealer
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateDealerRequest")
	defer func() { log.ExitFn(0, "HandleCreateDealerRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create Dealers request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Dealers request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDealerReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Dealers request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Dealers request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDealerReq.SubDealer) <= 0) || (len(createDealerReq.Dealer) <= 0) ||
		(len(createDealerReq.PayRate) <= 0) || (len(createDealerReq.StartDate) <= 0) ||
		(len(createDealerReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDealerReq.SubDealer)
	queryParameters = append(queryParameters, createDealerReq.Dealer)
	queryParameters = append(queryParameters, createDealerReq.PayRate)
	queryParameters = append(queryParameters, createDealerReq.StartDate)
	queryParameters = append(queryParameters, createDealerReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateDealerFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Dealers in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Dealers", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Dealers created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Dealers Created Successfully", http.StatusOK, nil)
}
