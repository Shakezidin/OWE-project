/**************************************************************************
* File			: apiUpdateAdderData.go
* DESCRIPTION	: This file contains functions for Update Adder data handler
* DATE			: 24-Apr-2024
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
		err = fmt.Errorf("HTTP Request body is null in update adder data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateAdderDataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update adder data request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateAdderDataReq.UniqueId) <= 0) || (len(updateAdderDataReq.Date) <= 0) ||
		(len(updateAdderDataReq.TypeAdMktg) <= 0) ||
		(len(updateAdderDataReq.Gc) <= 0) || (len(updateAdderDataReq.Notes) <= 0) ||
		(len(updateAdderDataReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateAdderDataReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record_id Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// if updateAdderDataReq.ExactAmount <= float64(0) {
	// 	err = fmt.Errorf("Invalid ExactAmount Not Allowed")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Invalid ExactAmount Not Allowed", http.StatusBadRequest, nil)
	// 	return
	// }

	if updateAdderDataReq.PerKwAmt <= float64(0) {
		err = fmt.Errorf("Invalid PerKwAmt Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid PerKwAmt Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateAdderDataReq.RepPercent <= float64(0) {
		err = fmt.Errorf("Invalid rep percent Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Rep Percent Not Allowed", http.StatusBadRequest, nil)
		return
	}

	date, err := time.Parse("2006-01-02", updateAdderDataReq.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	query := `SELECT system_size FROM consolidated_data_view WHERE consolidated_data_view.unique_id = $1`
	queryParameters = append(queryParameters, updateAdderDataReq.UniqueId)
	dataOne, err := db.ReteriveFromDB(db.RowDataDBIndex, query, queryParameters)
	if err != nil || len(dataOne) <= 0 {
		log.FuncErrorTrace(0, "Failed to get Add adder data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Add adder data from DB", http.StatusBadRequest, nil)
		return
	}

	system_size, _ := dataOne[0]["system_size"].(float64)

	if updateAdderDataReq.ExactAmount != 0 {
		updateAdderDataReq.AdderCalc = updateAdderDataReq.ExactAmount
	} else {
		if updateAdderDataReq.PerKwAmt != 0 {
			updateAdderDataReq.AdderCalc = updateAdderDataReq.PerKwAmt * system_size
		}
	}
	type1 := "Adder"

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateAdderDataReq.RecordId)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, updateAdderDataReq.TypeAdMktg)
	queryParameters = append(queryParameters, updateAdderDataReq.Gc)
	queryParameters = append(queryParameters, updateAdderDataReq.ExactAmount)
	queryParameters = append(queryParameters, type1)
	queryParameters = append(queryParameters, updateAdderDataReq.PerKwAmt)
	queryParameters = append(queryParameters, updateAdderDataReq.RepPercent)
	queryParameters = append(queryParameters, updateAdderDataReq.Description)
	queryParameters = append(queryParameters, updateAdderDataReq.Notes)
	queryParameters = append(queryParameters, system_size)
	queryParameters = append(queryParameters, updateAdderDataReq.AdderCalc)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateAdderDataFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update adder data in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update adder data", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "adder data Updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Adder Data Updated Successfully", http.StatusOK, nil)
}
