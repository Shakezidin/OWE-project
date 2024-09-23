/**************************************************************************
* File			: apiCreateDealer.go
* DESCRIPTION	: This file contains functions for create dealer
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
 * FUNCTION:		HandleCreateDealerRequest
 * DESCRIPTION:     handler for create dealer request
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
		err = fmt.Errorf("HTTP Request body is null in create dealer request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create dealer request, err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDealerReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create dealer request, err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create dealer request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDealerReq.SubDealer) <= 0) || (len(createDealerReq.Dealer) <= 0) ||
		(len(createDealerReq.PayRate) <= 0) || (len(createDealerReq.StartDate) <= 0) ||
		(len(createDealerReq.EndDate) <= 0) || (len(createDealerReq.State) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	Startdate, err := time.Parse("2006-01-02", createDealerReq.StartDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	Enddate, err := time.Parse("2006-01-02", createDealerReq.EndDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDealerReq.SubDealer)
	queryParameters = append(queryParameters, createDealerReq.Dealer)
	queryParameters = append(queryParameters, createDealerReq.State)
	queryParameters = append(queryParameters, createDealerReq.PayRate)
	queryParameters = append(queryParameters, Startdate)
	queryParameters = append(queryParameters, Enddate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateDealerFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add dealer in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create dealer", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Dealer Created Successfully", http.StatusOK, nil)
}
