/**************************************************************************
* File			: apiUpdateAutoAdder.go
* DESCRIPTION	: This file contains functions for update AutoAdder
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
		err = fmt.Errorf("HTTP Request body is null in update AutoAdder request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update AutoAdder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAutoAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update AutoAdder request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal update AutoAdder request", http.StatusBadRequest, nil)
		return
	}

	// if (len(updateAutoAdderReq.Partner) <= 0) || (len(updateAutoAdderReq.Installer) <= 0) ||
	// 	(len(updateAutoAdderReq.State) <= 0) || (len(updateAutoAdderReq.SaleType) <= 0) ||
	// 	(len(updateAutoAdderReq.RepType) <= 0) || (len(updateAutoAdderReq.StartDate) <= 0) ||
	// 	(len(updateAutoAdderReq.EndDate) <= 0) {
	// 	err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
	// 	return
	// }

	// if updateAutoAdderReq.RecordId <= int64(0) {
	// 	err = fmt.Errorf("Invalid Record Id, unable to proceed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
	// 	return
	// }
	// if updateAutoAdderReq.SalePrice <= float64(0) {
	// 	err = fmt.Errorf("Invalid Sale price Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "Invalid Sale price, Update failed", http.StatusBadRequest, nil)
	// 	return
	// }
	// if updateAutoAdderReq.RL <= float64(0) {
	// 	err = fmt.Errorf("Invalid Rate list Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "Invalid Rate list, Update failed", http.StatusBadRequest, nil)
	// 	return
	// }
	// if updateAutoAdderReq.Rate <= float64(0) {
	// 	err = fmt.Errorf("Invalid Rate Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	FormAndSendHttpResp(resp, "Invalid Rate, Update failed", http.StatusBadRequest, nil)
	// 	return
	// }

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
	queryParameters = append(queryParameters, updateAutoAdderReq.StateID)
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
		log.FuncErrorTrace(0, "Failed to Update AutoAdder in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update AutoAdder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "AutoAdder updated with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "AutoAdder Updated Successfully", http.StatusOK, nil)
}
