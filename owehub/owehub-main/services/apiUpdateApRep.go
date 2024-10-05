/**************************************************************************
* File			: apiUpdateApRep.go
* DESCRIPTION	: This file contains functions for update ap_rep handler
* DATE			: 23-Jan-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateApRepDataRequest
 * DESCRIPTION:     handler for update ap_rep request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateApRepDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		updateApRepReq  models.UpdateApRep
		queryParameters []interface{}
		result          []interface{}
	)

	log.EnterFn(0, "HandleUpdateApRepDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateApRepDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update ap rep request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update ap rep request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateApRepReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update ap rep request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update ap rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateApRepReq.Rep) <= 0) || (len(updateApRepReq.Dba) <= 0) ||
		(len(updateApRepReq.Type) <= 0) || (len(updateApRepReq.Date) <= 0) ||
		(len(updateApRepReq.Method) <= 0) || (len(updateApRepReq.Cbiz) <= 0) ||
		(len(updateApRepReq.Notes) <= 0) || (len(updateApRepReq.Transaction) <= 0) ||
		(len(updateApRepReq.UniqueId) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateApRepReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateApRepReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Amount, Update failed", http.StatusBadRequest, nil)
		return
	}

	Date, err := time.Parse("2006-01-02", updateApRepReq.Date)
	if err != nil {
		err = fmt.Errorf("Error parsing date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid date, Update failed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateApRepReq.RecordId)
	queryParameters = append(queryParameters, updateApRepReq.UniqueId)
	queryParameters = append(queryParameters, updateApRepReq.Rep)
	queryParameters = append(queryParameters, updateApRepReq.Dba)
	queryParameters = append(queryParameters, updateApRepReq.Type)
	queryParameters = append(queryParameters, Date)
	queryParameters = append(queryParameters, updateApRepReq.Amount)
	queryParameters = append(queryParameters, updateApRepReq.Method)
	queryParameters = append(queryParameters, updateApRepReq.Cbiz)
	queryParameters = append(queryParameters, updateApRepReq.Transaction)
	queryParameters = append(queryParameters, updateApRepReq.Notes)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateApRepFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update ap rep in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update ap rep", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "ap rep updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Ap Rep Updated Successfully", http.StatusOK, nil)
}
