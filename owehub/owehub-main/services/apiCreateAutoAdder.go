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
		err = fmt.Errorf("HTTP Request body is null in create auto adder request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create auto adder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAutoAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create auto adder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create auto adder request", http.StatusBadRequest, nil)
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
		err = fmt.Errorf("Invalid per_kw_amount price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Per Kw Amount price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid rep doll div by per Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rep Doll Div by Per Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid sys size Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sys Size Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid rep count Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rep Count Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid per rep addr share Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Per Rep Addr Share Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid per rep ovrd share Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Per Rep Ovrd Share Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R1 pay scale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1 Pay Scale Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid R2 pay scale Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R2 Pay Scale Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.ContractAmount <= float64(0) {
		err = fmt.Errorf("Invalid contract amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Contract Amount Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.ProjectBaseCost <= float64(0) {
		err = fmt.Errorf("Invalid project base cost Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Project Base Cost Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.CrtAddr <= float64(0) {
		err = fmt.Errorf("Invalid crt addr Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Crt Addr Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1LoanFee <= float64(0) {
		err = fmt.Errorf("Invalid R1 Loan Fee Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1 Loan Fee Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1Rebate <= float64(0) {
		err = fmt.Errorf("Invalid R1 rebate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1 Rebate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1Referral <= float64(0) {
		err = fmt.Errorf("Invalid R1 referral Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1 Referral Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.R1RPlusR <= float64(0) {
		err = fmt.Errorf("Invalid R1R Plus_R Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid R1R Plus_R Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.TotalComm <= float64(0) {
		err = fmt.Errorf("Invalid total comm Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Total Comm Not Allowed", http.StatusBadRequest, nil)
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
		log.FuncErrorTrace(0, "Failed to Add auto adder in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create Auto Adder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New auto adder created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Auto Adder Created Successfully", http.StatusOK, nil)
}
