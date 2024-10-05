/**************************************************************************
* File			: apiUpdateAutoAdder.go
* DESCRIPTION	: This file contains functions for update auto adder handler
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
		err = fmt.Errorf("HTTP Request body is null in update auto adder request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update auto adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAutoAdderReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update auto adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update auto adder request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateAutoAdderReq.UniqueID) <= 0) || (len(updateAutoAdderReq.Date) <= 0) ||
		(len(updateAutoAdderReq.Type) <= 0) || (len(updateAutoAdderReq.GC) <= 0) ||
		// (len(updateAutoAdderReq.DescriptionRepVisible) <= 0) ||
		// (len(updateAutoAdderReq.AdderType) <= 0)||
		(len(updateAutoAdderReq.NotesNoRepVisible) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// if updateAutoAdderReq.ExactAmount <= float64(0) {
	// 	err = fmt.Errorf("Invalid exacy amount list Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Invalid exact amount Not Allowed, Update failed", http.StatusBadRequest, nil)
	// 	return
	// }
	if updateAutoAdderReq.PerKWAmount <= float64(0) {
		err = fmt.Errorf("Invalid perkwamount price Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Perkwamount Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}
	if updateAutoAdderReq.RepPercentage <= float64(0) {
		err = fmt.Errorf("Invalid rep percentage Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid rep percentage Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	Date, err := time.Parse("2006-01-02", updateAutoAdderReq.Date)
	if err != nil {
		err = fmt.Errorf("Error parsing date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid date, Update failed", http.StatusBadRequest, nil)
		return
	}

	updateAutoAdderReq.PerKWAmount = 99.99
	updateAutoAdderReq.DescriptionRepVisible = "description"
	updateAutoAdderReq.AdderType = "adder type"

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateAutoAdderReq.RecordId)
	queryParameters = append(queryParameters, updateAutoAdderReq.UniqueID)
	queryParameters = append(queryParameters, Date)
	queryParameters = append(queryParameters, updateAutoAdderReq.Type)
	queryParameters = append(queryParameters, updateAutoAdderReq.GC)
	queryParameters = append(queryParameters, updateAutoAdderReq.ExactAmount)
	queryParameters = append(queryParameters, updateAutoAdderReq.PerKWAmount)
	queryParameters = append(queryParameters, updateAutoAdderReq.RepPercentage)
	queryParameters = append(queryParameters, updateAutoAdderReq.DescriptionRepVisible)
	queryParameters = append(queryParameters, updateAutoAdderReq.NotesNoRepVisible)
	queryParameters = append(queryParameters, updateAutoAdderReq.AdderType)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateAutoAdderFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update auto adder in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to apdate auto adder", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "auto adder updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Auto Adder Updated Successfully", http.StatusOK, nil)
}
