/**************************************************************************
* File			: apiCreatePaymentSchedule.go
* DESCRIPTION	: This file contains functions for create payment schedule
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
 * FUNCTION:		HandleCreatePaymentScheduleRequest
 * DESCRIPTION:     handler for create payment schedule request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreatePaymentScheduleRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		createPaymentSchedule models.CreatePaymentSchedule
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleCreatePaymentScheduleRequest")
	defer func() { log.ExitFn(0, "HandleCreatePaymentScheduleRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create payment schedule request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create payment schedule request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createPaymentSchedule)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create payment schedule request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Payment Schedule request", http.StatusBadRequest, nil)
		return
	}

	if ((len(createPaymentSchedule.Dealer) <= 0) || len(createPaymentSchedule.PartnerName) <= 0) ||
		(len(createPaymentSchedule.InstallerName) <= 0) || (len(createPaymentSchedule.SaleType) <= 0) ||
		(len(createPaymentSchedule.State) <= 0) || (len(createPaymentSchedule.RepPay) <= 0) ||
		(len(createPaymentSchedule.StartDate) <= 0) || (len(createPaymentSchedule.EndDate) <= 0) ||
		(len(createPaymentSchedule.CommissionModel) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createPaymentSchedule.Rl <= float64(0) {
		err = fmt.Errorf("Invalid rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createPaymentSchedule.Draw <= float64(0) {
		err = fmt.Errorf("Invalid draw percentage Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Draw Percentage Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createPaymentSchedule.DrawMax <= float64(0) {
		err = fmt.Errorf("Invalid draw max Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Draw Max Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createPaymentSchedule.RepDraw <= float64(0) {
		err = fmt.Errorf("Invalid Rep Draw Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rep Draw Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createPaymentSchedule.RepDrawMax <= float64(0) {
		err = fmt.Errorf("Invalid Rep Draw Max Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rep Draw Max Not Allowed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createPaymentSchedule.Dealer)
	queryParameters = append(queryParameters, createPaymentSchedule.PartnerName)
	queryParameters = append(queryParameters, createPaymentSchedule.InstallerName)
	queryParameters = append(queryParameters, createPaymentSchedule.SaleType)
	queryParameters = append(queryParameters, createPaymentSchedule.State)
	queryParameters = append(queryParameters, createPaymentSchedule.Rl)
	queryParameters = append(queryParameters, createPaymentSchedule.Draw)
	queryParameters = append(queryParameters, createPaymentSchedule.DrawMax)
	queryParameters = append(queryParameters, createPaymentSchedule.RepDraw)
	queryParameters = append(queryParameters, createPaymentSchedule.RepDrawMax)
	queryParameters = append(queryParameters, createPaymentSchedule.RepPay)
	queryParameters = append(queryParameters, createPaymentSchedule.CommissionModel)
	queryParameters = append(queryParameters, createPaymentSchedule.StartDate)
	queryParameters = append(queryParameters, createPaymentSchedule.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreatePaymentScheduleFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add payment schedule in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Payment Schedule", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New payment schedule created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Payment Schedule Created Successfully", http.StatusOK, nil)
}
