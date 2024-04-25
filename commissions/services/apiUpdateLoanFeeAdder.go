/**************************************************************************
* File			: apiUpdateLoanFeeAdder.go
* DESCRIPTION	: This file contains functions for update Loan Fee adder
						setter handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

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
		err = fmt.Errorf("HTTP Request body is null in update loanfee adder request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update loan fee adder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateLoanFeeAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Update loan fee adder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Update loan fee adder request", http.StatusBadRequest, nil)
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
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLoanFeeAdderReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	if UpdateLoanFeeAdderReq.Contract <= float64(0) {
		err = fmt.Errorf("Invalid Sale price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sale price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.OweCost <= float64(0) {
		err = fmt.Errorf("Invalid Rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.AddrAmount <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.PerKwAmount <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if UpdateLoanFeeAdderReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
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
	result, err = db.CallDBFunction(db.UpdateLoanFeeAdderFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add loan fee adder in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update loan fee adder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "loan fee adder Updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "loan fee adder Updated Successfully", http.StatusOK, nil)
}
