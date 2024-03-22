/**************************************************************************
* File			: apiCreateMarketingFees.go
* DESCRIPTION	: This file contains functions for create marketing fees
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
 * FUNCTION:		HandleCreateAptSetterRequest
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
		err = fmt.Errorf("HTTP Request body is null in create Marketing Fees request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Marketing Fees request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createMarketingFees)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Marketing Fees request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Marketing Fees request", http.StatusBadRequest, nil)
		return
	}

	if (len(createMarketingFees.Source) <= 0) || (len(createMarketingFees.Dba) <= 0) ||
		(len(createMarketingFees.State) <= 0) || (len(createMarketingFees.FeeRate) <= 0) ||
		(len(createMarketingFees.StartDate) <= 0) || (len(createMarketingFees.EndDate) <= 0) ||
		(len(createMarketingFees.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createMarketingFees.ChgDlr <= 0 {
		err = fmt.Errorf("Invalid Chg Dlr Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createMarketingFees.PaySrc <= 0 {
		err = fmt.Errorf("Invalid Pay Source Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createMarketingFees.Source)
	queryParameters = append(queryParameters, createMarketingFees.Dba)
	queryParameters = append(queryParameters, createMarketingFees.State)
	queryParameters = append(queryParameters, createMarketingFees.FeeRate)
	queryParameters = append(queryParameters, createMarketingFees.ChgDlr)
	queryParameters = append(queryParameters, createMarketingFees.PaySrc)
	queryParameters = append(queryParameters, createMarketingFees.StartDate)
	queryParameters = append(queryParameters, createMarketingFees.EndDate)
	queryParameters = append(queryParameters, createMarketingFees.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateMarketingFeesFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Marketing Fees in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Marketing Fees", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Marketing Fees created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Marketing Fees Created Sucessfully", http.StatusOK, nil)
}
