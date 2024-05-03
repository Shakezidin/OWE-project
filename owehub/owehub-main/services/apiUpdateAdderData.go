/**************************************************************************
* File			: apiUpdateAdderData.go
* DESCRIPTION	: This file contains functions for Update Adder data handler
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
 * FUNCTION:		HandleUpdateAdderDataRequest
 * DESCRIPTION:     handler for Update Adder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateAdderDataReq models.UpdateAdderDataReq
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleUpdateAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleUpdateAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create UpdateData request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create UpdateData request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAdderDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create UpdateData request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create UpdateData request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateAdderDataReq.UniqueId) <= 0) || (len(updateAdderDataReq.Date) <= 0) ||
		(len(updateAdderDataReq.TypeAdMktg) <= 0) || (len(updateAdderDataReq.ExactAmount) <= 0) ||
		(len(updateAdderDataReq.Gc) <= 0) || (len(updateAdderDataReq.Notes) <= 0) ||
		(len(updateAdderDataReq.Type) <= 0) || (len(updateAdderDataReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateAdderDataReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid record_id Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateAdderDataReq.PerKwAmt <= float64(0) {
		err = fmt.Errorf("Invalid PerKwAmt Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerKwAmt Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateAdderDataReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid SysSize Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid SysSize Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateAdderDataReq.AdderCal <= float64(0) {
		err = fmt.Errorf("Invalid AdderCal Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid AdderCal Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if updateAdderDataReq.RepPercent <= 0 {
		err = fmt.Errorf("Invalid RepPercent Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepPercent Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateAdderDataReq.RecordId)
	queryParameters = append(queryParameters, updateAdderDataReq.UniqueId)
	queryParameters = append(queryParameters, updateAdderDataReq.Date)
	queryParameters = append(queryParameters, updateAdderDataReq.TypeAdMktg)
	queryParameters = append(queryParameters, updateAdderDataReq.Type)
	queryParameters = append(queryParameters, updateAdderDataReq.Gc)
	queryParameters = append(queryParameters, updateAdderDataReq.ExactAmount)
	queryParameters = append(queryParameters, updateAdderDataReq.PerKwAmt)
	queryParameters = append(queryParameters, updateAdderDataReq.RepPercent)
	queryParameters = append(queryParameters, updateAdderDataReq.Description)
	queryParameters = append(queryParameters, updateAdderDataReq.Notes)
	queryParameters = append(queryParameters, updateAdderDataReq.SysSize)
	queryParameters = append(queryParameters, updateAdderDataReq.AdderCal)

	// Call the database function
	result, err = db.CallDBFunction(db.UpdateAdderDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add AdderData in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Update AdderData", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "AdderData Update with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "AdderData Update Successfully", http.StatusOK, nil)
}
