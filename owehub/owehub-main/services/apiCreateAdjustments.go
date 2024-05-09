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
	"time"

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

	if (len(createAdjustmentsReq.UniqueId) <= 0) || (len(createAdjustmentsReq.Date) <= 0) ||
		(len(createAdjustmentsReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createAdjustmentsReq.Amount <= float64(0) {
		err = fmt.Errorf("Invalid amount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Invalid amount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	date, err := time.Parse("2006-01-02", createAdjustmentsReq.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// =========== default value delete after calculation ========= //
	Customer := "default"
	InstallerName := "FFS"
	PartnerName := "FFS"
	StateName := "Alaska"
	Bl := "default"
	SysSize := 99.99
	Epc := 99.99

	queryParameters = append(queryParameters, createAdjustmentsReq.UniqueId)
	queryParameters = append(queryParameters, Customer)
	queryParameters = append(queryParameters, PartnerName)
	queryParameters = append(queryParameters, InstallerName)
	queryParameters = append(queryParameters, StateName)
	queryParameters = append(queryParameters, SysSize)
	queryParameters = append(queryParameters, Bl)
	queryParameters = append(queryParameters, Epc)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createAdjustmentsReq.Notes)
	queryParameters = append(queryParameters, createAdjustmentsReq.Amount)

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
