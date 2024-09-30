/**************************************************************************
* File			: apiCreateLoanFeeAdder.go
* DESCRIPTION	: This file contains functions for create Loan Fee adder
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
 * FUNCTION:		HandleCreateLoanFeeAdderDataRequest
 * DESCRIPTION:     handler for create Loan fee adder request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateLoanFeeAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		createLoanFeeAdderReq models.CreateLoanFeeAdder
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleCreateLoanFeeAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateLoanFeeAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create loanfee adder request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create loan fee adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createLoanFeeAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create loan fee adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create loan fee adder request", http.StatusBadRequest, nil)
		return
	}

	if (len(createLoanFeeAdderReq.UniqueID) <= 0) || (len(createLoanFeeAdderReq.TypeMktg) <= 0) ||
		(len(createLoanFeeAdderReq.Dealer) <= 0) || (len(createLoanFeeAdderReq.Installer) <= 0) ||
		(len(createLoanFeeAdderReq.State) <= 0) || (len(createLoanFeeAdderReq.DealerTier) <= 0) ||
		(len(createLoanFeeAdderReq.DescriptionRepVisible) <= 0) || (len(createLoanFeeAdderReq.NotesNotRepVisible) <= 0) ||
		(len(createLoanFeeAdderReq.Type) <= 0) || (len(createLoanFeeAdderReq.Rep1Name) <= 0) ||
		(len(createLoanFeeAdderReq.Rep2Name) <= 0) || (len(createLoanFeeAdderReq.Rep1DefResp) <= 0) ||
		(len(createLoanFeeAdderReq.R1AddrResp) <= 0) || (len(createLoanFeeAdderReq.Rep2DefResp) <= 0) ||
		(len(createLoanFeeAdderReq.R2AddrResp) <= 0) || (len(createLoanFeeAdderReq.StartDate) <= 0) ||
		(len(createLoanFeeAdderReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createLoanFeeAdderReq.Contract <= float64(0) {
		err = fmt.Errorf("Invalid Sale price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Sale price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.OweCost <= float64(0) {
		err = fmt.Errorf("Invalid Rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.AddrAmount <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.PerKwAmount <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.RepDollDivbyPer <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.RepCount <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.PerRepAddrShare <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.PerRepOvrdShare <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.R1PayScale <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createLoanFeeAdderReq.R2PayScale <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createLoanFeeAdderReq.UniqueID)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.TypeMktg)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Dealer)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Installer)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.State)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Contract)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.DealerTier)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.OweCost)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.AddrAmount)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.PerKwAmount)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.RepDollDivbyPer)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.DescriptionRepVisible)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.NotesNotRepVisible)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Type)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Rep1Name)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Rep2Name)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.SysSize)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.RepCount)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.PerRepAddrShare)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.PerRepOvrdShare)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.R1PayScale)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Rep1DefResp)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.R1AddrResp)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.R2PayScale)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.Rep2DefResp)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.R2AddrResp)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.StartDate)
	queryParameters = append(queryParameters, createLoanFeeAdderReq.EndDate)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateLoanFeeAdderFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add loan fee adder in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create loan fee adder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "loan fee adder created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "loan fee adder Created Successfully", http.StatusOK, nil)
}
