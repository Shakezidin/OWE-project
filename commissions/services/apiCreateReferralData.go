/**************************************************************************
* File			: apiCreateReferralData.go
* DESCRIPTION	: This file contains functions for create Referral data handler
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
 * FUNCTION:		HandleCreateReferralDataRequest
 * DESCRIPTION:     handler for create referral data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateReferralDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		ReferralData    models.CreateReferralData
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleCreateReferralDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateReferralDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create Referral Data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Referral Data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &ReferralData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Referral Data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create Referral Data request", http.StatusBadRequest, nil)
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
		err = fmt.Errorf("Invalid SysSize value: %f, Not Allowed", createReferralData.SysSize)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid SysSize value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.RepCount < float64(0) {
		err = fmt.Errorf("Invalid RepCount value: %f, Not Allowed", createReferralData.RepCount)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepCount value Not Allowed", http.StatusBadRequest, nil)
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
		err = fmt.Errorf("Invalid R1PayScale value: %f, Not Allowed", createReferralData.R1PayScale)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1PayScale value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReferralData.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2PayScale value: %f, Not Allowed", createReferralData.R2PayScale)
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R2PayScale value Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, ReferralData.UniqueID)
	queryParameters = append(queryParameters, ReferralData.NewCustomer)
	queryParameters = append(queryParameters, ReferralData.ReferrerSerial)
	queryParameters = append(queryParameters, ReferralData.ReferrerName)
	queryParameters = append(queryParameters, ReferralData.Amount)
	queryParameters = append(queryParameters, ReferralData.RepDollDivbyPer)
	queryParameters = append(queryParameters, ReferralData.Notes)
	queryParameters = append(queryParameters, ReferralData.Type)
	queryParameters = append(queryParameters, ReferralData.Rep1Name)
	queryParameters = append(queryParameters, ReferralData.Rep2Name)
	queryParameters = append(queryParameters, ReferralData.SysSize)
	queryParameters = append(queryParameters, ReferralData.RepCount)
	queryParameters = append(queryParameters, ReferralData.State)
	queryParameters = append(queryParameters, ReferralData.PerRepAddrShare)
	queryParameters = append(queryParameters, ReferralData.PerRepOvrdShare)
	queryParameters = append(queryParameters, ReferralData.R1PayScale)
	queryParameters = append(queryParameters, ReferralData.R1ReferralCredit)
	queryParameters = append(queryParameters, ReferralData.R1ReferralCreditPerc)
	queryParameters = append(queryParameters, ReferralData.R1AddrResp)
	queryParameters = append(queryParameters, ReferralData.R2PayScale)
	queryParameters = append(queryParameters, ReferralData.R2ReferralCredit)
	queryParameters = append(queryParameters, ReferralData.R2ReferralCreditPerc)
	queryParameters = append(queryParameters, ReferralData.R2AddrResp)
	queryParameters = append(queryParameters, ReferralData.StartDate)
	queryParameters = append(queryParameters, ReferralData.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateReferralDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Referral Data in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Referral Data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Referral Data created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Referral Data Created Successfully", http.StatusOK, nil)
}
