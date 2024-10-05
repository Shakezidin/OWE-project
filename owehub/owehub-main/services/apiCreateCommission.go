/**************************************************************************
* File			: apiCreateCommission.go
* DESCRIPTION	: This file contains functions for create commission
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
 * FUNCTION:		HandleCreateAptSetterRequest
 * DESCRIPTION:     handler for create commissions request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateCommissionRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createCommissionReq models.CreateCommission
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleCreateCommissionRequest")
	defer func() { log.ExitFn(0, "HandleCreateCommissionRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create commissions request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create commissions request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createCommissionReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create commissions request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create commissions request", http.StatusBadRequest, nil)
		return
	}

	if (len(createCommissionReq.Partner) <= 0) || (len(createCommissionReq.Installer) <= 0) ||
		(len(createCommissionReq.State) <= 0) || (len(createCommissionReq.SaleType) <= 0) ||
		(len(createCommissionReq.RepType) <= 0) || (len(createCommissionReq.StartDate) <= 0) ||
		(len(createCommissionReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createCommissionReq.SalePrice <= float64(0) {
		err = fmt.Errorf("Invalid Sale price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Sale price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createCommissionReq.RL <= float64(0) {
		err = fmt.Errorf("Invalid Rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createCommissionReq.Rate <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", createCommissionReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing date:", err)
		appserver.FormAndSendHttpResp(resp, "Invalid date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", createCommissionReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing date:", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createCommissionReq.Partner)
	queryParameters = append(queryParameters, createCommissionReq.Installer)
	queryParameters = append(queryParameters, createCommissionReq.State)
	queryParameters = append(queryParameters, createCommissionReq.SaleType)
	queryParameters = append(queryParameters, createCommissionReq.SalePrice)
	queryParameters = append(queryParameters, createCommissionReq.RepType)
	queryParameters = append(queryParameters, createCommissionReq.RL)
	queryParameters = append(queryParameters, createCommissionReq.Rate)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateCommissionFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add commissions in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create commissions", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "commissions created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Commissions Created Successfully", http.StatusOK, nil)
}
