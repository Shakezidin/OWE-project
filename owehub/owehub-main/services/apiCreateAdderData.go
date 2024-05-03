/**************************************************************************
* File			: apiCreateAdderData.go
* DESCRIPTION	: This file contains functions for create Adder data handler
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
 * FUNCTION:		HandleCreateAdderDataRequest
 * DESCRIPTION:     handler for create Adder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		createAdderDataReq models.CreateAdderData
		queryParameters    []interface{}
		result             []interface{}
	)

	log.EnterFn(0, "HandleCreateAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleCreateAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create AdderData request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create AdderData request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAdderDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create AdderData request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create AdderData request", http.StatusBadRequest, nil)
		return
	}

	if (len(createAdderDataReq.UniqueId) <= 0) || (len(createAdderDataReq.Date) <= 0) ||
		(len(createAdderDataReq.TypeAdMktg) <= 0) || (len(createAdderDataReq.ExactAmount) <= 0) ||
		(len(createAdderDataReq.Gc) <= 0) || (len(createAdderDataReq.Notes) <= 0) ||
		(len(createAdderDataReq.Type) <= 0) || (len(createAdderDataReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAdderDataReq.PerKwAmt <= float64(0) {
		err = fmt.Errorf("Invalid PerKwAmt Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid PerKwAmt Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAdderDataReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid SysSize Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid SysSize Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAdderDataReq.AdderCal <= float64(0) {
		err = fmt.Errorf("Invalid AdderCal Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid AdderCal Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAdderDataReq.RepPercent <= 0 {
		err = fmt.Errorf("Invalid RepPercent Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid RepPercent Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createAdderDataReq.UniqueId)
	queryParameters = append(queryParameters, createAdderDataReq.Date)
	queryParameters = append(queryParameters, createAdderDataReq.TypeAdMktg)
	queryParameters = append(queryParameters, createAdderDataReq.Type)
	queryParameters = append(queryParameters, createAdderDataReq.Gc)
	queryParameters = append(queryParameters, createAdderDataReq.ExactAmount)
	queryParameters = append(queryParameters, createAdderDataReq.PerKwAmt)
	queryParameters = append(queryParameters, createAdderDataReq.RepPercent)
	queryParameters = append(queryParameters, createAdderDataReq.Description)
	queryParameters = append(queryParameters, createAdderDataReq.Notes)
	queryParameters = append(queryParameters, createAdderDataReq.SysSize)
	queryParameters = append(queryParameters, createAdderDataReq.AdderCal)

	// Call the database function
	result, err = db.CallDBFunction(db.CreateAdderDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add adder data in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create AdderData", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "AdderData created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "AdderData Created Successfully", http.StatusOK, nil)
}
