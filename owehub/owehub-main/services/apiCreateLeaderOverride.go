/**************************************************************************
* File			: apiCreateLeaderOverride.go
* DESCRIPTION	: This file contains functions for create LeaderOverride handler
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
 * FUNCTION:		HandleCreateLeaderOverrideRequest
 * DESCRIPTION:     handler for create LeaderOverride request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateLeaderOverrideRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createRebateDataReq models.CreateRebateData
		queryParameters     []interface{}
		result              []interface{}
	)

	log.EnterFn(0, "HandleCreateLeaderOverrideRequest")
	defer func() { log.ExitFn(0, "HandleCreateLeaderOverrideRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create LeaderOverride request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create LeaderOverride request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createRebateDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create LeaderOverride request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create LeaderOverride request", http.StatusBadRequest, nil)
		return
	}

	if (len(createRebateDataReq.UniqueId) <= 0) || (len(createRebateDataReq.CustomerVerf) <= 0) ||
		(len(createRebateDataReq.TypeRdMktg) <= 0) || (len(createRebateDataReq.Item) <= 0) ||
		(len(createRebateDataReq.Amount) <= 0) || (len(createRebateDataReq.Notes) <= 0) ||
		(len(createRebateDataReq.Type) <= 0) || (len(createRebateDataReq.Rep_1_Name) <= 0) ||
		(len(createRebateDataReq.Rep_2_Name) <= 0) || (len(createRebateDataReq.State) <= 0) ||
		(len(createRebateDataReq.Rep1DefResp) <= 0) || (len(createRebateDataReq.R1AddrResp) <= 0) ||
		(len(createRebateDataReq.PerRepDefOvrd) <= 0) || (len(createRebateDataReq.R1RebateCredit) <= 0) ||
		(len(createRebateDataReq.R1RebateCreditPerc) <= 0) || (len(createRebateDataReq.R2RebateCredit) <= 0) ||
		(len(createRebateDataReq.R2RebateCreditPerc) <= 0) || (len(createRebateDataReq.StartDate) <= 0) ||
		(len(createRebateDataReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createRebateDataReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid RepDollDivbyPer Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createRebateDataReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid SysSize Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid SysSize Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createRebateDataReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid RepCount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepCount Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createRebateDataReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid PerRepAddrShare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerRepAddrShare Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createRebateDataReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid PerRepOvrdShare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerRepOvrdShare Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createRebateDataReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R1PayScale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1PayScale Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createRebateDataReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2PayScale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R2PayScale Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createRebateDataReq.UniqueId)
	queryParameters = append(queryParameters, createRebateDataReq.CustomerVerf)
	queryParameters = append(queryParameters, createRebateDataReq.TypeRdMktg)
	queryParameters = append(queryParameters, createRebateDataReq.Item)
	queryParameters = append(queryParameters, createRebateDataReq.Amount)
	queryParameters = append(queryParameters, createRebateDataReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, createRebateDataReq.Notes)
	queryParameters = append(queryParameters, createRebateDataReq.Type)
	queryParameters = append(queryParameters, createRebateDataReq.Rep_1_Name)
	queryParameters = append(queryParameters, createRebateDataReq.Rep_2_Name)
	queryParameters = append(queryParameters, createRebateDataReq.SysSize)
	queryParameters = append(queryParameters, createRebateDataReq.RepCount)
	queryParameters = append(queryParameters, createRebateDataReq.State)
	queryParameters = append(queryParameters, createRebateDataReq.PerRepAddrShare)
	queryParameters = append(queryParameters, createRebateDataReq.PerRepOvrdShare)
	queryParameters = append(queryParameters, createRebateDataReq.R1PayScale)
	queryParameters = append(queryParameters, createRebateDataReq.Rep1DefResp)
	queryParameters = append(queryParameters, createRebateDataReq.R1AddrResp)
	queryParameters = append(queryParameters, createRebateDataReq.R2PayScale)
	queryParameters = append(queryParameters, createRebateDataReq.PerRepDefOvrd)
	queryParameters = append(queryParameters, createRebateDataReq.R1RebateCredit)
	queryParameters = append(queryParameters, createRebateDataReq.R1RebateCreditPerc)
	queryParameters = append(queryParameters, createRebateDataReq.R2RebateCredit)
	queryParameters = append(queryParameters, createRebateDataReq.R2RebateCreditPerc)
	queryParameters = append(queryParameters, createRebateDataReq.StartDate)
	queryParameters = append(queryParameters, createRebateDataReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateRebateDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add LeaderOverride in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create LeaderOverride", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "commissions created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Commissions Created Successfully", http.StatusOK, nil)
}
