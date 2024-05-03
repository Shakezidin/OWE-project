/**************************************************************************
* File			: apiCreateAdjustments.go
* DESCRIPTION	: This file contains functions for create adjustments handler
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
 * FUNCTION:		HandleCreateAdjustmentsRequest
 * DESCRIPTION:     handler for create adjustments request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateAdjustmentsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		createAdjustmentsReq models.CreateAdjustments
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleCreateAdjustmentsRequest")
	defer func() { log.ExitFn(0, "HandleCreateAdjustmentsRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create adjustments request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create adjustments request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAdjustmentsReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create adjustments request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal create adjustments request", http.StatusBadRequest, nil)
		return
	}

	if (len(createAdjustmentsReq.UniqueId) <= 0) || (len(createAdjustmentsReq.Customer) <= 0) ||
		(len(createAdjustmentsReq.PartnerName) <= 0) || (len(createAdjustmentsReq.InstallerName) <= 0) ||
		(len(createAdjustmentsReq.StateName) <= 0) || (len(createAdjustmentsReq.Bl) <= 0) ||
		(len(createAdjustmentsReq.Notes) <= 0) || (len(createAdjustmentsReq.StartDate) <= 0) ||
		(len(createAdjustmentsReq.EndDate) <= 0) || (len(createAdjustmentsReq.Date) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAdjustmentsReq.SysSize <= float64(0) {
		err = fmt.Errorf("Invalid sys_size Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid sys_size Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAdjustmentsReq.Epc <= float64(0) {
		err = fmt.Errorf("Invalid epc Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid epc Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAdjustmentsReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createAdjustmentsReq.UniqueId)
	queryParameters = append(queryParameters, createAdjustmentsReq.Customer)
	queryParameters = append(queryParameters, createAdjustmentsReq.PartnerName)
	queryParameters = append(queryParameters, createAdjustmentsReq.InstallerName)
	queryParameters = append(queryParameters, createAdjustmentsReq.StateName)
	queryParameters = append(queryParameters, createAdjustmentsReq.SysSize)
	queryParameters = append(queryParameters, createAdjustmentsReq.Bl)
	queryParameters = append(queryParameters, createAdjustmentsReq.Epc)
	queryParameters = append(queryParameters, createAdjustmentsReq.Date)
	queryParameters = append(queryParameters, createAdjustmentsReq.Notes)
	queryParameters = append(queryParameters, createAdjustmentsReq.Amount)
	queryParameters = append(queryParameters, createAdjustmentsReq.StartDate)
	queryParameters = append(queryParameters, createAdjustmentsReq.EndDate)

	// Call the database function

	result, err = db.CallDBFunction(db.CreateAdjustmentsFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to add adjustments in DB with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to Create adjustments", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "new adjustments created with Id: %+v", data["result"])
	FormAndSendHttpResp(resp, "Adjustments Created Successfully", http.StatusOK, nil)
}
