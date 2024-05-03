/**************************************************************************
* File			: apiCreateReferralData.go
* DESCRIPTION	: This file contains functions for create Referral data handler
* DATE			: 25-Apr-2024
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
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create referral data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createReferralData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create referral data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create referral data request", http.StatusBadRequest, nil)
		return
	}

	if len(createReferralData.UniqueID) == 0 || len(createReferralData.NewCustomer) == 0 ||
		len(createReferralData.ReferrerSerial) == 0 || len(createReferralData.ReferrerName) == 0 ||
		len(createReferralData.Amount) == 0 || len(createReferralData.Notes) == 0 ||
		len(createReferralData.Type) == 0 || len(createReferralData.Rep1Name) == 0 ||
		len(createReferralData.Rep2Name) == 0 || len(createReferralData.State) == 0 ||
		len(createReferralData.R1ReferralCredit) == 0 || len(createReferralData.R1ReferralCreditPerc) == 0 ||
		len(createReferralData.R1AddrResp) == 0 || len(createReferralData.R2ReferralCredit) == 0 ||
		len(createReferralData.R2ReferralCreditPerc) == 0 || len(createReferralData.R2AddrResp) == 0 ||
		len(createReferralData.StartDate) == 0 || createReferralData.EndDate == nil || len(*createReferralData.EndDate) == 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid RepDollDivbyPer price: %f, Not Allowed", createReferralData.RepDollDivbyPer)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer price Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid Sys Size value: %f, Not Allowed", createReferralData.SysSize)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sys Size value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.RepCount < float64(0) {
		err = fmt.Errorf("Invalid Rep Count value: %f, Not Allowed", createReferralData.RepCount)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rep Count value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.PerRepAddrShare < float64(0) {
		err = fmt.Errorf("Invalid PerRepAddrShare value: %f, Not Allowed", createReferralData.PerRepAddrShare)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerRepAddrShare value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.PerRepOvrdShare < float64(0) {
		err = fmt.Errorf("Invalid PerRepOvrdShare value: %f, Not Allowed", createReferralData.PerRepOvrdShare)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerRepOvrdShare value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R1 Pay Scale value: %f, Not Allowed", createReferralData.R1PayScale)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1 Pay Scale value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2 Pay Scale value: %f, Not Allowed", createReferralData.R2PayScale)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R2 Pay Scale value Not Allowed", http.StatusBadRequest, nil)
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
	queryParameters = append(queryParameters, createReferralData.Type)
	queryParameters = append(queryParameters, createReferralData.Rep1Name)
	queryParameters = append(queryParameters, createReferralData.Rep2Name)
	queryParameters = append(queryParameters, createReferralData.SysSize)
	queryParameters = append(queryParameters, createReferralData.RepCount)
	queryParameters = append(queryParameters, createReferralData.State)
	queryParameters = append(queryParameters, createReferralData.PerRepAddrShare)
	queryParameters = append(queryParameters, createReferralData.PerRepOvrdShare)
	queryParameters = append(queryParameters, createReferralData.R1PayScale)
	queryParameters = append(queryParameters, createReferralData.R1ReferralCredit)
	queryParameters = append(queryParameters, createReferralData.R1ReferralCreditPerc)
	queryParameters = append(queryParameters, createReferralData.R1AddrResp)
	queryParameters = append(queryParameters, createReferralData.R2PayScale)
	queryParameters = append(queryParameters, createReferralData.R2ReferralCredit)
	queryParameters = append(queryParameters, createReferralData.R2ReferralCreditPerc)
	queryParameters = append(queryParameters, createReferralData.R2AddrResp)
	queryParameters = append(queryParameters, createReferralData.StartDate)
	queryParameters = append(queryParameters, createReferralData.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateReferralDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add referral data in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Referral Data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New referral data created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Referral Data Created Successfully", http.StatusOK, nil)
}
