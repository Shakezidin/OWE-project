/**************************************************************************
* File			: apiCreateMarketingFees.go
* DESCRIPTION	: This file contains functions for create marketing fees handler
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
 * FUNCTION:		HandleCreateMarketingFeesRequest
 * DESCRIPTION:     handler for create Marketing Fees request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateMarketingFeesRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createMarketingFees models.CreateMarketingFees
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleCreateMarketingFeesRequest")
	defer func() { log.ExitFn(0, "HandleCreateMarketingFeesRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create marketing fee request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create marketing fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createMarketingFees)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create marketing fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Marketing Fees request", http.StatusBadRequest, nil)
		return
	}

	if (len(createMarketingFees.Source) <= 0) || (len(createMarketingFees.Dba) <= 0) ||
		(len(createMarketingFees.State) <= 0) || (len(createMarketingFees.FeeRate) <= 0) ||
		(len(createMarketingFees.StartDate) <= 0) || (len(createMarketingFees.EndDate) <= 0) ||
		(len(createMarketingFees.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", createMarketingFees.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", createMarketingFees.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createMarketingFees.Source)
	queryParameters = append(queryParameters, createMarketingFees.Dba)
	queryParameters = append(queryParameters, createMarketingFees.State)
	queryParameters = append(queryParameters, createMarketingFees.FeeRate)
	queryParameters = append(queryParameters, createMarketingFees.ChgDlr)
	queryParameters = append(queryParameters, createMarketingFees.PaySrc)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)
	queryParameters = append(queryParameters, createMarketingFees.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateMarketingFeesFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Marketing Fees in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Marketing Fees", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New marketing fees created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Marketing Fees Created Successfully", http.StatusOK, nil)
}
