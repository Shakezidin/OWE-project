/**************************************************************************
* File			: apiupdateArSchedule.go
* DESCRIPTION	: This file contains functions for update ar schedule handler
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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Ar schedule request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateArScheduleReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Ar schedule request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update Ar schedule request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateArScheduleReq.PartnerName) <= 0) || (len(updateArScheduleReq.InstallerName) <= 0) ||
		(len(updateArScheduleReq.StateName) <= 0) || (len(updateArScheduleReq.SaleTypeName) <= 0) ||
		(len(updateArScheduleReq.CalcDate) <= 0) || (len(updateArScheduleReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateArScheduleReq.RedLine <= float64(0) {
		err = fmt.Errorf("Invalid RedLine price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Per RedLine Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateArScheduleReq.PermitPay <= float64(0) {
		err = fmt.Errorf("Invalid PermitPay price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Per PermitPay Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateArScheduleReq.PermitMax <= float64(0) {
		err = fmt.Errorf("Invalid PermitMax price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Per PermitMax Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateArScheduleReq.InstallPay <= float64(0) {
		err = fmt.Errorf("Invalid InstallPay price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Per RedInstallPayLine Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateArScheduleReq.PtoPay <= float64(0) {
		err = fmt.Errorf("Invalid PtoPay price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Per PtoPay Not Allowed", http.StatusBadRequest, nil)
		return
	}

	Startdate, err := time.Parse("2006-01-02", updateArScheduleReq.StartDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	Enddate, err := time.Parse("2006-01-02", updateArScheduleReq.EndDate)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateArScheduleReq.RecordId)
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
	queryParameters = append(queryParameters, Startdate)
	queryParameters = append(queryParameters, Enddate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateArScheduleFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update Ar schedule in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update Ar schedule", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Ar schedule updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Ar Schedule Updated Successfully", http.StatusOK, nil)
}
