/**************************************************************************
* File			: apiCreateAutoAdder.go
* DESCRIPTION	: This file contains functions for create AutoAdder
						setter handler
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
 * FUNCTION:		HandleCreateAptSetterRequest
 * DESCRIPTION:     handler for create AutoAdder request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateAutoAdderRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createAutoAdderReq models.CreateAutoAdder
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleCreateAutoAdderRequest")
	defer func() { log.ExitFn(0, "HandleCreateAutoAdderRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create AutoAdder request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create AutoAdder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAutoAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create AutoAdder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create AutoAdder request", http.StatusBadRequest, nil)
		return
	}

	if (len(createAutoAdderReq.UniqueID) <= 0) || (len(createAutoAdderReq.TypeAAMktg) <= 0) ||
		(len(createAutoAdderReq.GC) <= 0) || (len(createAutoAdderReq.ExactAmount) <= 0) ||
		(len(createAutoAdderReq.DescriptionRepVisible) <= 0) || (len(createAutoAdderReq.NotesNotRepVisible) <= 0) ||
		(len(createAutoAdderReq.Type) <= 0) || (len(createAutoAdderReq.Rep1DefResp) <= 0) ||
		(len(createAutoAdderReq.R1AddrResp) <= 0) || (len(createAutoAdderReq.Rep2DefResp) <= 0) ||
		(len(createAutoAdderReq.R2AddrResp) <= 0) || (len(createAutoAdderReq.StartDate) <= 0) ||
		(len(createAutoAdderReq.EndDate) <= 0) || (len(createAutoAdderReq.Rep1Name) <= 0) ||
		(len(createAutoAdderReq.Rep2Name) <= 0) || (len(createAutoAdderReq.State) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAutoAdderReq.PerKWAmount <= float64(0) {
		err = fmt.Errorf("Invalid perkwamount price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Perkwamount price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid Repdolldivbyper list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Repdolldivbyper list Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid Syssize Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Syssize Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid Repcount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Repcount Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid Perrepaddrshare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Perrepaddrshare Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid Perrepovrdshare Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Perrepovrdshare Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R1payscale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1payscale Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2payscale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R2payscale Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.ContractAmount <= float64(0) {
		err = fmt.Errorf("Invalid Contractamount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Contractamount Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.ProjectBaseCost <= float64(0) {
		err = fmt.Errorf("Invalid Projectbasecost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Projectbasecost Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.CrtAddr <= float64(0) {
		err = fmt.Errorf("Invalid Crtaddr Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Crtaddr Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1LoanFee <= float64(0) {
		err = fmt.Errorf("Invalid R1loanfee Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1loanfee Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1Rebate <= float64(0) {
		err = fmt.Errorf("Invalid R1rebate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1rebate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1Referral <= float64(0) {
		err = fmt.Errorf("Invalid R1referral Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1referral Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1RPlusR <= float64(0) {
		err = fmt.Errorf("Invalid R1RPlusR Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1RPlusR Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.TotalComm <= float64(0) {
		err = fmt.Errorf("Invalid Totalcomm Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Totalcomm Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createAutoAdderReq.UniqueID)
	queryParameters = append(queryParameters, createAutoAdderReq.TypeAAMktg)
	queryParameters = append(queryParameters, createAutoAdderReq.GC)
	queryParameters = append(queryParameters, createAutoAdderReq.ExactAmount)
	queryParameters = append(queryParameters, createAutoAdderReq.PerKWAmount)
	queryParameters = append(queryParameters, createAutoAdderReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, createAutoAdderReq.DescriptionRepVisible)
	queryParameters = append(queryParameters, createAutoAdderReq.NotesNotRepVisible)
	queryParameters = append(queryParameters, createAutoAdderReq.Type)
	queryParameters = append(queryParameters, createAutoAdderReq.Rep1Name)
	queryParameters = append(queryParameters, createAutoAdderReq.Rep2Name)
	queryParameters = append(queryParameters, createAutoAdderReq.SysSize)
	queryParameters = append(queryParameters, createAutoAdderReq.State)
	queryParameters = append(queryParameters, createAutoAdderReq.RepCount)
	queryParameters = append(queryParameters, createAutoAdderReq.PerRepAddrShare)
	queryParameters = append(queryParameters, createAutoAdderReq.PerRepOvrdShare)
	queryParameters = append(queryParameters, createAutoAdderReq.R1PayScale)
	queryParameters = append(queryParameters, createAutoAdderReq.Rep1DefResp)
	queryParameters = append(queryParameters, createAutoAdderReq.R1AddrResp)
	queryParameters = append(queryParameters, createAutoAdderReq.R2PayScale)
	queryParameters = append(queryParameters, createAutoAdderReq.Rep2DefResp)
	queryParameters = append(queryParameters, createAutoAdderReq.R2AddrResp)
	queryParameters = append(queryParameters, createAutoAdderReq.ContractAmount)
	queryParameters = append(queryParameters, createAutoAdderReq.ProjectBaseCost)
	queryParameters = append(queryParameters, createAutoAdderReq.CrtAddr)
	queryParameters = append(queryParameters, createAutoAdderReq.R1LoanFee)
	queryParameters = append(queryParameters, createAutoAdderReq.R1Rebate)
	queryParameters = append(queryParameters, createAutoAdderReq.R1Referral)
	queryParameters = append(queryParameters, createAutoAdderReq.R1RPlusR)
	queryParameters = append(queryParameters, createAutoAdderReq.TotalComm)
	queryParameters = append(queryParameters, createAutoAdderReq.StartDate)
	queryParameters = append(queryParameters, createAutoAdderReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateAutoAdderFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add AutoAdder in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create AutoAdder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "AutoAdder created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "AutoAdder Created Successfully", http.StatusOK, nil)
}
