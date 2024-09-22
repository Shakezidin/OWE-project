/**************************************************************************
* File			: apiCreateAutoAdder.go
* DESCRIPTION	: This file contains functions for create AutoAdder
						setter handler
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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create auto adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createAutoAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create auto adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create auto adder request", http.StatusBadRequest, nil)
		return
	}

	if (len(createAutoAdderReq.UniqueID) <= 0) || (len(createAutoAdderReq.Date) <= 0) ||
		(len(createAutoAdderReq.Type) <= 0) || (len(createAutoAdderReq.GC) <= 0) ||
		// (len(createAutoAdderReq.DescriptionRepVisible) <= 0) ||
		// (len(createAutoAdderReq.AdderType) <= 0) ||
		(len(createAutoAdderReq.NotesNoRepVisible) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// if createAutoAdderReq.ExactAmount <= float64(0) {
	// 	err = fmt.Errorf("Invalid exact amount Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Invalid exact amount Not Allowed", http.StatusBadRequest, nil)
	// 	return
	// }
	if createAutoAdderReq.PerKWAmount <= float64(0) {
		err = fmt.Errorf("Invalid per_kw_amount price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Per Kw Amount price Not Allowed", http.StatusBadRequest, nil)
		return
	}
	if createAutoAdderReq.RepPercentage <= float64(0) {
		err = fmt.Errorf("Invalid rep percentage Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid rep percentage Not Allowed", http.StatusBadRequest, nil)
		return
	}

	Date, err := time.Parse("2006-01-02", createAutoAdderReq.Date)
	if err != nil {
		err = fmt.Errorf("Error parsing date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid date not allowed", http.StatusBadRequest, nil)
		return
	}

	createAutoAdderReq.PerKWAmount = 99.99
	createAutoAdderReq.DescriptionRepVisible = "description"
	createAutoAdderReq.AdderType = "adder type"

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createAutoAdderReq.UniqueID)
	queryParameters = append(queryParameters, Date)
	queryParameters = append(queryParameters, createAutoAdderReq.Type)
	queryParameters = append(queryParameters, createAutoAdderReq.GC)
	queryParameters = append(queryParameters, createAutoAdderReq.ExactAmount)
	queryParameters = append(queryParameters, createAutoAdderReq.PerKWAmount)
	queryParameters = append(queryParameters, createAutoAdderReq.RepPercentage)
	queryParameters = append(queryParameters, createAutoAdderReq.DescriptionRepVisible)
	queryParameters = append(queryParameters, createAutoAdderReq.NotesNoRepVisible)
	queryParameters = append(queryParameters, createAutoAdderReq.AdderType)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateAutoAdderFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add auto adder in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Auto Adder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New auto adder created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Auto Adder Created Successfully", http.StatusOK, nil)
}
