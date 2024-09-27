/**************************************************************************
* File			: apiCreateReferralData.go
* DESCRIPTION	: This file contains functions for create Referral data handler
* DATE			: 25-Apr-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleCreateReferralDataRequest
 * DESCRIPTION:     handler for create referral data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateReferralDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createReferralData models.CreateReferralData
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleCreateReferralDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateReferralDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create referral data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create referral data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createReferralData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create referral data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create referral data request", http.StatusBadRequest, nil)
		return
	}

	if len(createReferralData.UniqueID) == 0 || len(createReferralData.NewCustomer) == 0 ||
		len(createReferralData.ReferrerSerial) == 0 || len(createReferralData.ReferrerName) == 0 ||
		len(createReferralData.Notes) == 0 ||
		len(createReferralData.Date) == 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid RepDollDivbyPer price: %f, Not Allowed", createReferralData.RepDollDivbyPer)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.Amount <= float64(0) {
		err = fmt.Errorf("Invalid amount price: %f, Not Allowed", createReferralData.Amount)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createReferralData.UniqueID)
	queryParameters = append(queryParameters, createReferralData.NewCustomer)
	queryParameters = append(queryParameters, createReferralData.ReferrerSerial)
	queryParameters = append(queryParameters, createReferralData.ReferrerName)
	queryParameters = append(queryParameters, createReferralData.Amount)
	queryParameters = append(queryParameters, createReferralData.RepDollDivbyPer)
	queryParameters = append(queryParameters, createReferralData.Notes)
	queryParameters = append(queryParameters, createReferralData.Date)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateReferralDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add referral data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Referral Data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New referral data created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Referral Data Created Successfully", http.StatusOK, nil)
}
