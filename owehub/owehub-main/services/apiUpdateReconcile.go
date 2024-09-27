/**************************************************************************
* File			: apiupdateRReconcile.go
* DESCRIPTION	: This file contains functions for update ReconcileData handler
* DATE			: 24-Apr-2024
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
 * FUNCTION:		HandleupdateReconcileRequest
 * DESCRIPTION:     handler for update ReconcileData request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateReconcileRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateReconcileReq models.UpdateReconcile
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleupdateReconcileRequest")
	defer func() { log.ExitFn(0, "HandleupdateReconcileRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update ReconcileData request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update ReconcileData request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateReconcileReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update ReconcileData request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update ReconcileData request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateReconcileReq.UniqueId) <= 0) || (len(updateReconcileReq.Customer) <= 0) ||
		(len(updateReconcileReq.PartnerName) <= 0) || (len(updateReconcileReq.StateName) <= 0) ||
		(len(updateReconcileReq.Status) <= 0) || (len(updateReconcileReq.Notes) <= 0) ||
		(len(updateReconcileReq.StartDate) <= 0) || (len(updateReconcileReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateReconcileReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateReconcileReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid SysSize Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid SysSize Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateReconcileReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid Amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid SysAmountSize Not Allowed", http.StatusBadRequest, nil)
		return
	}

	Startdate, err := time.Parse("2006-01-02", updateReconcileReq.StartDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	Enddate, err := time.Parse("2006-01-02", updateReconcileReq.EndDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateReconcileReq.RecordId)
	queryParameters = append(queryParameters, updateReconcileReq.UniqueId)
	queryParameters = append(queryParameters, updateReconcileReq.Customer)
	queryParameters = append(queryParameters, updateReconcileReq.PartnerName)
	queryParameters = append(queryParameters, updateReconcileReq.StateName)
	queryParameters = append(queryParameters, updateReconcileReq.SysSize)
	queryParameters = append(queryParameters, updateReconcileReq.Status)
	queryParameters = append(queryParameters, Startdate)
	queryParameters = append(queryParameters, Enddate)
	queryParameters = append(queryParameters, updateReconcileReq.Amount)
	queryParameters = append(queryParameters, updateReconcileReq.Notes)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateReconcileFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Reconcile data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update Reconcile data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "ReconcileData updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "ReconcileData updated Successfully", http.StatusOK, nil)
}
