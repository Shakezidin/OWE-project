/**************************************************************************
* File			: apiupdateArSchedule.go
* DESCRIPTION	: This file contains functions for update ar schedule handler
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
 * FUNCTION:		HandleupdateArScheduleRequest
 * DESCRIPTION:     handler for update ArSchedule request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateArScheduleRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		updateArScheduleReq models.UpdateArSchedule
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleupdateArScheduleRequest")
	defer func() { log.ExitFn(0, "HandleupdateArScheduleRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update Ar schedule request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Ar schedule request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateArScheduleReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Ar schedule request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update Ar schedule request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateArScheduleReq.UniqueId) <= 0) || (len(updateArScheduleReq.PermitPay) <= 0) ||
		(len(updateArScheduleReq.PartnerName) <= 0) || (len(updateArScheduleReq.InstallerName) <= 0) ||
		(len(updateArScheduleReq.StateName) <= 0) || (len(updateArScheduleReq.SaleTypeName) <= 0) ||
		(len(updateArScheduleReq.RedLine) <= 0) || (len(updateArScheduleReq.CalcDate) <= 0) ||
		(len(updateArScheduleReq.InstallPay) <= 0) || (len(updateArScheduleReq.PtoPay) <= 0) ||
		(len(updateArScheduleReq.StartDate) <= 0) || (len(updateArScheduleReq.PermitMax) <= 0) ||
		(len(updateArScheduleReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateArScheduleReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateArScheduleReq.RecordId)
	queryParameters = append(queryParameters, updateArScheduleReq.UniqueId)
	queryParameters = append(queryParameters, updateArScheduleReq.PartnerName)
	queryParameters = append(queryParameters, updateArScheduleReq.InstallerName)
	queryParameters = append(queryParameters, updateArScheduleReq.SaleTypeName)
	queryParameters = append(queryParameters, updateArScheduleReq.StateName)
	queryParameters = append(queryParameters, updateArScheduleReq.RedLine)
	queryParameters = append(queryParameters, updateArScheduleReq.CalcDate)
	queryParameters = append(queryParameters, updateArScheduleReq.PermitPay)
	queryParameters = append(queryParameters, updateArScheduleReq.PermitMax)
	queryParameters = append(queryParameters, updateArScheduleReq.InstallPay)
	queryParameters = append(queryParameters, updateArScheduleReq.PtoPay)
	queryParameters = append(queryParameters, updateArScheduleReq.StartDate)
	queryParameters = append(queryParameters, updateArScheduleReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateArScheduleFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update Ar schedule in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update Ar schedule", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Ar schedule updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Ar Schedule Updated Successfully", http.StatusOK, nil)
}
