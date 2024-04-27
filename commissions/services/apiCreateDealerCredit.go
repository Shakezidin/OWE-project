/**************************************************************************
* File			: apiCreateDealerCredit.go
* DESCRIPTION	: This file contains functions for create dealer credit handler
* DATE			: 25-Apr-2024
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
 * FUNCTION:		HandleCreateDealerCreditRequest
 * DESCRIPTION:     handler for dealer credit data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateDealerCreditRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createDealerCredit models.CreateDealerCredit
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleCreateDealerCreditRequest")
	defer func() { log.ExitFn(0, "HandleCreateDealerCreditRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create Dealer Credit request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Dealer Credit request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDealerCredit)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Dealer Credit request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Dealer Credit request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDealerCredit.UniqueID) <= 0) || (len(createDealerCredit.Customer) <= 0) ||
		(len(createDealerCredit.DealerName) <= 0) || (len(createDealerCredit.DealerDBA) <= 0) ||
		(len(createDealerCredit.ExactAmount) <= 0) || (len(createDealerCredit.ApprovedBy) <= 0) ||
		(len(createDealerCredit.Notes) <= 0) || (len(createDealerCredit.StartDate) <= 0) ||
		(createDealerCredit.EndDate != nil && len(*createDealerCredit.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDealerCredit.PerKWAmount <= float64(0) {
		err = fmt.Errorf("Invalid PerKWAmount price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerKWAmount price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDealerCredit.TotalAmount <= float64(0) {
		err = fmt.Errorf("Invalid TotalAmount value: %f, Not Allowed", createDealerCredit.TotalAmount)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid TotalAmount value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDealerCredit.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid SysSize value: %f, Not Allowed", createDealerCredit.SysSize)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid SysSize value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDealerCredit.UniqueID)
	queryParameters = append(queryParameters, createDealerCredit.Customer)
	queryParameters = append(queryParameters, createDealerCredit.DealerName)
	queryParameters = append(queryParameters, createDealerCredit.DealerDBA)
	queryParameters = append(queryParameters, createDealerCredit.ExactAmount)
	queryParameters = append(queryParameters, createDealerCredit.PerKWAmount)
	queryParameters = append(queryParameters, createDealerCredit.ApprovedBy)
	queryParameters = append(queryParameters, createDealerCredit.Notes)
	queryParameters = append(queryParameters, createDealerCredit.TotalAmount)
	queryParameters = append(queryParameters, createDealerCredit.SysSize)
	queryParameters = append(queryParameters, createDealerCredit.StartDate)
	queryParameters = append(queryParameters, createDealerCredit.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateDealerCreditFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Referral Data in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Dealer Credit", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Dealer Credit created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Dealer Credit Created Successfully", http.StatusOK, nil)
}
