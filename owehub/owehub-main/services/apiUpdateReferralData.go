/**************************************************************************
* File			: apiUpdateReferraldata.go
* DESCRIPTION	: This file contains functions for update ReferralData
						setter handler
* DATE			: 24-Apr-2024
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
 * FUNCTION:		HandleUpdateReferralDataRequest
 * DESCRIPTION:     handler for update Referral Data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateReferralDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		updateReferralDataReq models.UpdateReferralData
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleUpdateReferralDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateReferralDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update Referral data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Referral data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateReferralDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Referral data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update Referral data request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateReferralDataReq.UniqueID) <= 0) || (len(updateReferralDataReq.NewCustomer) <= 0) ||
		(len(updateReferralDataReq.ReferrerSerial) <= 0) || (len(updateReferralDataReq.ReferrerName) <= 0) ||
		(len(updateReferralDataReq.Notes) <= 0) ||
		(len(updateReferralDataReq.Date) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateReferralDataReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateReferralDataReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid RepDollDivbyPer Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateReferralDataReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateReferralDataReq.RecordId)
	queryParameters = append(queryParameters, updateReferralDataReq.UniqueID)
	queryParameters = append(queryParameters, updateReferralDataReq.NewCustomer)
	queryParameters = append(queryParameters, updateReferralDataReq.ReferrerSerial)
	queryParameters = append(queryParameters, updateReferralDataReq.ReferrerName)
	queryParameters = append(queryParameters, updateReferralDataReq.Amount)
	queryParameters = append(queryParameters, updateReferralDataReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, updateReferralDataReq.Notes)
	queryParameters = append(queryParameters, updateReferralDataReq.Date)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateReferralDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update Referral data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update Referral data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Referral data updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Referral data Updated Successfully", http.StatusOK, nil)
}
