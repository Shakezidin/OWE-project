/**************************************************************************
* File			: apiUpdateLoanFeeAdder.go
* DESCRIPTION	: This file contains functions for update Loan Fee adder
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
 * FUNCTION:		HandleUpdateLoanFeeAdderDataRequest
 * DESCRIPTION:     handler for update Loan fee adder request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateLoanFeeAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		UpdateLoanFeeAdderReq models.UpdateLoanFeeAdder
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleUpdateLoanFeeAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLoanFeeAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update loan fee adder request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update loan fee adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateLoanFeeAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update loan fee adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update loan fee adder request", http.StatusBadRequest, nil)
		return
	}

	if (len(UpdateLoanFeeAdderReq.UniqueID) <= 0) || (len(UpdateLoanFeeAdderReq.TypeMktg) <= 0) ||
		(len(UpdateLoanFeeAdderReq.Dealer) <= 0) || (len(UpdateLoanFeeAdderReq.Installer) <= 0) ||
		(len(UpdateLoanFeeAdderReq.State) <= 0) || (len(UpdateLoanFeeAdderReq.DealerTier) <= 0) ||
		(len(UpdateLoanFeeAdderReq.DescriptionRepVisible) <= 0) || (len(UpdateLoanFeeAdderReq.NotesNotRepVisible) <= 0) ||
		(len(UpdateLoanFeeAdderReq.Type) <= 0) || (len(UpdateLoanFeeAdderReq.Rep1Name) <= 0) ||
		(len(UpdateLoanFeeAdderReq.Rep2Name) <= 0) || (len(UpdateLoanFeeAdderReq.Rep1DefResp) <= 0) ||
		(len(UpdateLoanFeeAdderReq.R1AddrResp) <= 0) || (len(UpdateLoanFeeAdderReq.Rep2DefResp) <= 0) ||
		(len(UpdateLoanFeeAdderReq.R2AddrResp) <= 0) || (len(UpdateLoanFeeAdderReq.StartDate) <= 0) ||
		(len(UpdateLoanFeeAdderReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLoanFeeAdderReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLoanFeeAdderReq.Contract <= float64(0) {
		err = fmt.Errorf("Invalid contract Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Contract Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.OweCost <= float64(0) {
		err = fmt.Errorf("Invalid Owe cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Owwe Cost Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.AddrAmount <= float64(0) {
		err = fmt.Errorf("Invalid addr amount Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Addr Amount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.PerKwAmount <= float64(0) {
		err = fmt.Errorf("Invalid PerKwAmount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid PerKwAmount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid RepDollDivbyPer Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid RepDollDivbyPer Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid sys size Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Sys Size Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid rep count Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rep Count Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid PerRepAddrShare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid PerRepAddrShare Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid PerRepOvrdShare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid PerRepOvrdShare Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R1PayScale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid R1PayScale Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2PayScale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid R2PayScale Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.RecordId)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.UniqueID)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.TypeMktg)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Dealer)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Installer)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.State)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Contract)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.DealerTier)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.OweCost)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.AddrAmount)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.PerKwAmount)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.DescriptionRepVisible)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.NotesNotRepVisible)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Type)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Rep1Name)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Rep2Name)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.SysSize)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.RepCount)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.PerRepAddrShare)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.PerRepOvrdShare)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.R1PayScale)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Rep1DefResp)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.R1AddrResp)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.R2PayScale)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.Rep2DefResp)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.R2AddrResp)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.StartDate)
	queryParameters = append(queryParameters, UpdateLoanFeeAdderReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateLoanFeeAdderFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update loan fee adder in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update loan fee adder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "Loan Fee Adder Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Loan Fee Adder Updated Successfully", http.StatusOK, nil)
}
