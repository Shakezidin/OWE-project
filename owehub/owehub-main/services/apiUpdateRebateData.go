/**************************************************************************
* File			: apiUpdateRebatedata.go
* DESCRIPTION	: This file contains functions for update RebateData
						setter handler
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
 * FUNCTION:		HandleUpdateRebateDataRequest
 * DESCRIPTION:     handler for update Rebate Data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateRebateDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		updateRebateDataReq models.UpdateRebateData
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleUpdateRebateDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateRebateDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update rebate data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update rebate data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateRebateDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update rebate data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update rebate data request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateRebateDataReq.UniqueId) <= 0) || (len(updateRebateDataReq.CustomerVerf) <= 0) ||
		(len(updateRebateDataReq.TypeRdMktg) <= 0) || (len(updateRebateDataReq.Item) <= 0) ||
		(len(updateRebateDataReq.Amount) <= 0) || (len(updateRebateDataReq.Notes) <= 0) ||
		(len(updateRebateDataReq.Type) <= 0) || (len(updateRebateDataReq.Rep_1_Name) <= 0) ||
		(len(updateRebateDataReq.Rep_2_Name) <= 0) || (len(updateRebateDataReq.State) <= 0) ||
		(len(updateRebateDataReq.Rep1DefResp) <= 0) || (len(updateRebateDataReq.R1AddrResp) <= 0) ||
		(len(updateRebateDataReq.PerRepDefOvrd) <= 0) || (len(updateRebateDataReq.R1RebateCredit) <= 0) ||
		(len(updateRebateDataReq.R1RebateCreditPerc) <= 0) || (len(updateRebateDataReq.R2RebateCredit) <= 0) ||
		(len(updateRebateDataReq.R2RebateCreditPerc) <= 0) || (len(updateRebateDataReq.StartDate) <= 0) ||
		(len(updateRebateDataReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateRebateDataReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateRebateDataReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid RepDollDivbyPer Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateRebateDataReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid SysSize Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid SysSize Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateRebateDataReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid RepCount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepCount Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateRebateDataReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid PerRepAddrShare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerRepAddrShare Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateRebateDataReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid PerRepOvrdShare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerRepOvrdShare Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateRebateDataReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R1PayScale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1PayScale Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateRebateDataReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2PayScale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R2PayScale Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateRebateDataReq.RecordId)
	queryParameters = append(queryParameters, updateRebateDataReq.UniqueId)
	queryParameters = append(queryParameters, updateRebateDataReq.CustomerVerf)
	queryParameters = append(queryParameters, updateRebateDataReq.TypeRdMktg)
	queryParameters = append(queryParameters, updateRebateDataReq.Item)
	queryParameters = append(queryParameters, updateRebateDataReq.Amount)
	queryParameters = append(queryParameters, updateRebateDataReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, updateRebateDataReq.Notes)
	queryParameters = append(queryParameters, updateRebateDataReq.Type)
	queryParameters = append(queryParameters, updateRebateDataReq.Rep_1_Name)
	queryParameters = append(queryParameters, updateRebateDataReq.Rep_2_Name)
	queryParameters = append(queryParameters, updateRebateDataReq.SysSize)
	queryParameters = append(queryParameters, updateRebateDataReq.RepCount)
	queryParameters = append(queryParameters, updateRebateDataReq.State)
	queryParameters = append(queryParameters, updateRebateDataReq.PerRepAddrShare)
	queryParameters = append(queryParameters, updateRebateDataReq.PerRepOvrdShare)
	queryParameters = append(queryParameters, updateRebateDataReq.R1PayScale)
	queryParameters = append(queryParameters, updateRebateDataReq.Rep1DefResp)
	queryParameters = append(queryParameters, updateRebateDataReq.R1AddrResp)
	queryParameters = append(queryParameters, updateRebateDataReq.R2PayScale)
	queryParameters = append(queryParameters, updateRebateDataReq.PerRepDefOvrd)
	queryParameters = append(queryParameters, updateRebateDataReq.R1RebateCredit)
	queryParameters = append(queryParameters, updateRebateDataReq.R1RebateCreditPerc)
	queryParameters = append(queryParameters, updateRebateDataReq.R2RebateCredit)
	queryParameters = append(queryParameters, updateRebateDataReq.R2RebateCreditPerc)
	queryParameters = append(queryParameters, updateRebateDataReq.StartDate)
	queryParameters = append(queryParameters, updateRebateDataReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateRebateDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update rebate data in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to update rebate data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "rebate data updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "rebate data Updated Successfully", http.StatusOK, nil)
}
