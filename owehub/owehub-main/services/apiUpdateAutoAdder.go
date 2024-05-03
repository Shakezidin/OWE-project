/**************************************************************************
* File			: apiUpdateAutoAdder.go
* DESCRIPTION	: This file contains functions for update auto adder handler
* DATE			: 23-Jan-2024
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
 * FUNCTION:		HandleUpdateAutoAdderRequest
 * DESCRIPTION:     handler for update AutoAdder request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateAutoAdderRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateAutoAdderReq models.UpdateAutoAdder
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateAutoAdderRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAutoAdderRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update auto adder request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update auto adder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAutoAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update auto adder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update auto adder request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateAutoAdderReq.UniqueID) <= 0) || (len(updateAutoAdderReq.TypeAAMktg) <= 0) ||
		(len(updateAutoAdderReq.GC) <= 0) || (len(updateAutoAdderReq.ExactAmount) <= 0) ||
		(len(updateAutoAdderReq.DescriptionRepVisible) <= 0) || (len(updateAutoAdderReq.NotesNotRepVisible) <= 0) ||
		(len(updateAutoAdderReq.Type) <= 0) || (len(updateAutoAdderReq.Rep1DefResp) <= 0) ||
		(len(updateAutoAdderReq.R1AddrResp) <= 0) || (len(updateAutoAdderReq.Rep2DefResp) <= 0) ||
		(len(updateAutoAdderReq.R2AddrResp) <= 0) || (len(updateAutoAdderReq.StartDate) <= 0) ||
		(len(updateAutoAdderReq.State) <= 0) || (len(updateAutoAdderReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateAutoAdderReq.PerKWAmount <= float64(0) {
		err = fmt.Errorf("Invalid perkwamount price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Perkwamount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid Repdolldivbyper list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Repdolldivbyper Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid Sys size Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sys size Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid Repcount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rep count Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid Perrepaddrshare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Perrepaddrshare Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid Perrepovrdshare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Perrepovrdshare Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R1payscale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1payscale Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2payscale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R2payscale Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.ContractAmount <= float64(0) {
		err = fmt.Errorf("Invalid Contractamount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Contractamount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.ProjectBaseCost <= float64(0) {
		err = fmt.Errorf("Invalid Projectbasecost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Projectbasecost Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.CrtAddr <= float64(0) {
		err = fmt.Errorf("Invalid Crtaddr Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Crtaddr Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.R1LoanFee <= float64(0) {
		err = fmt.Errorf("Invalid R1loanfee Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1loanfee Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.R1Rebate <= float64(0) {
		err = fmt.Errorf("Invalid R1rebate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1rebate Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.R1Referral <= float64(0) {
		err = fmt.Errorf("Invalid R1referral Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1referral Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.R1RPlusR <= float64(0) {
		err = fmt.Errorf("Invalid R1RPlusR Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1R Plus R Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.TotalComm <= float64(0) {
		err = fmt.Errorf("Invalid Totalcomm Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Total comm Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.Rep1 <= 0 {
		err = fmt.Errorf("Invalid Rep1 Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rep1 Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.Rep2 <= 0 {
		err = fmt.Errorf("Invalid Rep2 Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rep2 Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateAutoAdderReq.RecordId)
	queryParameters = append(queryParameters, updateAutoAdderReq.UniqueID)
	queryParameters = append(queryParameters, updateAutoAdderReq.TypeAAMktg)
	queryParameters = append(queryParameters, updateAutoAdderReq.GC)
	queryParameters = append(queryParameters, updateAutoAdderReq.ExactAmount)
	queryParameters = append(queryParameters, updateAutoAdderReq.PerKWAmount)
	queryParameters = append(queryParameters, updateAutoAdderReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, updateAutoAdderReq.DescriptionRepVisible)
	queryParameters = append(queryParameters, updateAutoAdderReq.NotesNotRepVisible)
	queryParameters = append(queryParameters, updateAutoAdderReq.Type)
	queryParameters = append(queryParameters, updateAutoAdderReq.Rep1)
	queryParameters = append(queryParameters, updateAutoAdderReq.Rep2)
	queryParameters = append(queryParameters, updateAutoAdderReq.SysSize)
	queryParameters = append(queryParameters, updateAutoAdderReq.State)
	queryParameters = append(queryParameters, updateAutoAdderReq.RepCount)
	queryParameters = append(queryParameters, updateAutoAdderReq.PerRepAddrShare)
	queryParameters = append(queryParameters, updateAutoAdderReq.PerRepOvrdShare)
	queryParameters = append(queryParameters, updateAutoAdderReq.R1PayScale)
	queryParameters = append(queryParameters, updateAutoAdderReq.Rep1DefResp)
	queryParameters = append(queryParameters, updateAutoAdderReq.R1AddrResp)
	queryParameters = append(queryParameters, updateAutoAdderReq.R2PayScale)
	queryParameters = append(queryParameters, updateAutoAdderReq.Rep2DefResp)
	queryParameters = append(queryParameters, updateAutoAdderReq.R2AddrResp)
	queryParameters = append(queryParameters, updateAutoAdderReq.ContractAmount)
	queryParameters = append(queryParameters, updateAutoAdderReq.ProjectBaseCost)
	queryParameters = append(queryParameters, updateAutoAdderReq.CrtAddr)
	queryParameters = append(queryParameters, updateAutoAdderReq.R1LoanFee)
	queryParameters = append(queryParameters, updateAutoAdderReq.R1Rebate)
	queryParameters = append(queryParameters, updateAutoAdderReq.R1Referral)
	queryParameters = append(queryParameters, updateAutoAdderReq.R1RPlusR)
	queryParameters = append(queryParameters, updateAutoAdderReq.TotalComm)
	queryParameters = append(queryParameters, updateAutoAdderReq.StartDate)
	queryParameters = append(queryParameters, updateAutoAdderReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateAutoAdderFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update auto adder in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to apdate auto adder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "auto adder updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Auto Adder Updated Successfully", http.StatusOK, nil)
}
