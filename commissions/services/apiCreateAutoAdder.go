/**************************************************************************
* File			: apiCreateAutoAdder.go
* DESCRIPTION	: This file contains functions for create AutoAdder
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
		(len(createAutoAdderReq.EndDate) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAutoAdderReq.SalePrice <= float64(0) {
		err = fmt.Errorf("Invalid Sale price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Sale price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.RL <= float64(0) {
		err = fmt.Errorf("Invalid Rate list Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate list Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.Rate <= float64(0) {
		err = fmt.Errorf("Invalid Rate Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid Rate Not Allowed", http.StatusBadRequest, nil)
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
	queryParameters = append(queryParameters, createAutoAdderReq.Rep1)
	queryParameters = append(queryParameters, createAutoAdderReq.Rep2)
	queryParameters = append(queryParameters, createAutoAdderReq.SysSize)
	queryParameters = append(queryParameters, createAutoAdderReq.StateID)
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
