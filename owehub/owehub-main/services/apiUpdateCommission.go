/**************************************************************************
* File			: apiUpdateCommission.go
* DESCRIPTION	: This file contains functions for update commission
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
 * FUNCTION:		HandleUpdateCommissionRequest
 * DESCRIPTION:     handler for update commissions request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateCommissionRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		updateCommissionReq models.UpdateCommission
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleUpdateCommissionRequest")
	defer func() { log.ExitFn(0, "HandleUpdateCommissionRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update commissions request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update commissions request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateCommissionReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update commissions request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update commissions request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateCommissionReq.Partner) <= 0) || (len(updateCommissionReq.Installer) <= 0) ||
		(len(updateCommissionReq.State) <= 0) || (len(updateCommissionReq.SaleType) <= 0) ||
		(len(updateCommissionReq.RepType) <= 0) || (len(updateCommissionReq.StartDate) <= 0) ||
		(len(updateCommissionReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateCommissionReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateCommissionReq.SalePrice <= float64(0) {
		err = fmt.Errorf("Invalid Sale price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Sale price, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateCommissionReq.RL <= float64(0) {
		err = fmt.Errorf("Invalid Rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate list, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateCommissionReq.Rate <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate, Update failed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", updateCommissionReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing date:", err)
		appserver.FormAndSendHttpResp(resp, "Invalid date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", updateCommissionReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing date:", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateCommissionReq.RecordId)
	queryParameters = append(queryParameters, updateCommissionReq.Partner)
	queryParameters = append(queryParameters, updateCommissionReq.Installer)
	queryParameters = append(queryParameters, updateCommissionReq.State)
	queryParameters = append(queryParameters, updateCommissionReq.SaleType)
	queryParameters = append(queryParameters, updateCommissionReq.SalePrice)
	queryParameters = append(queryParameters, updateCommissionReq.RepType)
	queryParameters = append(queryParameters, updateCommissionReq.RL)
	queryParameters = append(queryParameters, updateCommissionReq.Rate)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateCommissionFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update commissions in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update commissions", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "commissions updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Commissions Updated Successfully", http.StatusOK, nil)
}
