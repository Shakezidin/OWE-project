/**************************************************************************
* File			: apiCreateReconcile.go
* DESCRIPTION	: This file contains functions for create Reconcile data handler
* DATE			: 24-Apr-2024
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
 * FUNCTION:		HandleCreateReconcileRequest
 * DESCRIPTION:     handler for create Reconcile data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateReconcileRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createReconcileReq models.CreateReconcile
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleCreateReconcileRequest")
	defer func() { log.ExitFn(0, "HandleCreateReconcileRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create reconcile data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create reconcile data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createReconcileReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create reconcile data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create reconcile data request", http.StatusBadRequest, nil)
		return
	}

	if (len(createReconcileReq.UniqueId) <= 0) || (len(createReconcileReq.Customer) <= 0) ||
		(len(createReconcileReq.PartnerName) <= 0) || (len(createReconcileReq.StateName) <= 0) ||
		(len(createReconcileReq.Status) <= 0) || (len(createReconcileReq.Notes) <= 0) ||
		(len(createReconcileReq.StartDate) <= 0) || (len(createReconcileReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createReconcileReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid Sys Size Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sys Size Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createReconcileReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid Amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createReconcileReq.UniqueId)
	queryParameters = append(queryParameters, createReconcileReq.Customer)
	queryParameters = append(queryParameters, createReconcileReq.PartnerName)
	queryParameters = append(queryParameters, createReconcileReq.StateName)
	queryParameters = append(queryParameters, createReconcileReq.SysSize)
	queryParameters = append(queryParameters, createReconcileReq.Status)
	queryParameters = append(queryParameters, createReconcileReq.StartDate)
	queryParameters = append(queryParameters, createReconcileReq.EndDate)
	queryParameters = append(queryParameters, createReconcileReq.Amount)
	queryParameters = append(queryParameters, createReconcileReq.Notes)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateReconcileFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add reconcile data in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Reconcile data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New reconcile data created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Reconcile Data Created Successfully", http.StatusOK, nil)
}
