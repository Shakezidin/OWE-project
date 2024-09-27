/**************************************************************************
* File			: apiUpdatePaymentSchedule.go
* DESCRIPTION	: This file contains functions for update payment schedule
						setter handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleUpdatePaymentScheduleRequest
 * DESCRIPTION:     handler for update payment schedule request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdatePaymentScheduleRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		updatePaymentSchedule models.UpdatePaymentSchedule
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleUpdatePaymentScheduleRequest")
	defer func() { log.ExitFn(0, "HandleUpdatePaymentScheduleRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update payment schedule request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update payment schedule request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updatePaymentSchedule)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update update payment schedule err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update update payment schedule", http.StatusBadRequest, nil)
		return
	}

	if ((len(updatePaymentSchedule.Dealer) <= 0) || len(updatePaymentSchedule.PartnerName) <= 0) ||
		(len(updatePaymentSchedule.InstallerName) <= 0) || (len(updatePaymentSchedule.SaleType) <= 0) ||
		(len(updatePaymentSchedule.State) <= 0) || (len(updatePaymentSchedule.RepPay) <= 0) ||
		(len(updatePaymentSchedule.StartDate) <= 0) || (len(updatePaymentSchedule.EndDate) <= 0) ||
		(len(updatePaymentSchedule.CommissionModel) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updatePaymentSchedule.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updatePaymentSchedule.Rl <= float64(0) {
		err = fmt.Errorf("Invalid rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updatePaymentSchedule.Draw <= float64(0) {
		err = fmt.Errorf("Invalid draw percentage Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Draw Percentage Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updatePaymentSchedule.DrawMax <= float64(0) {
		err = fmt.Errorf("Invalid draw max Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Draw Max Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updatePaymentSchedule.RepDraw <= float64(0) {
		err = fmt.Errorf("Invalid Rep Draw Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rep Draw Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updatePaymentSchedule.RepDrawMax <= float64(0) {
		err = fmt.Errorf("Invalid Rep Draw Max Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rep Draw Max Not Allowed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updatePaymentSchedule.RecordId)
	queryParameters = append(queryParameters, updatePaymentSchedule.Dealer)
	queryParameters = append(queryParameters, updatePaymentSchedule.PartnerName)
	queryParameters = append(queryParameters, updatePaymentSchedule.InstallerName)
	queryParameters = append(queryParameters, updatePaymentSchedule.SaleType)
	queryParameters = append(queryParameters, updatePaymentSchedule.State)
	queryParameters = append(queryParameters, updatePaymentSchedule.Rl)
	queryParameters = append(queryParameters, updatePaymentSchedule.Draw)
	queryParameters = append(queryParameters, updatePaymentSchedule.DrawMax)
	queryParameters = append(queryParameters, updatePaymentSchedule.RepDraw)
	queryParameters = append(queryParameters, updatePaymentSchedule.RepDrawMax)
	queryParameters = append(queryParameters, updatePaymentSchedule.RepPay)
	queryParameters = append(queryParameters, updatePaymentSchedule.CommissionModel)
	queryParameters = append(queryParameters, updatePaymentSchedule.StartDate)
	queryParameters = append(queryParameters, updatePaymentSchedule.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdatePaymentScheduleFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update payment schedule in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update payment schedule", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "payment schedule updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Payment Schedule Updated Successfully", http.StatusOK, nil)
}
