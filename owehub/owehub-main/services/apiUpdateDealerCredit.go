/**************************************************************************
* File			: apiUpdateDealerCredit.go
* DESCRIPTION	: This file contains functions for Update dealer credit handler
* DATE			: 25-Apr-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateDealerCreditRequest
 * DESCRIPTION:     handler for dealer credit data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateDealerCreditRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		updateDealerCredit models.UpdateDealerCredit
		queryParameters    []interface{}
		result             []interface{}
		totalAmount        float64
		sysSize            float64
		whereEleList       []interface{}
	)

	log.EnterFn(0, "HandleUpdateDealerCreditRequest")
	defer func() { log.ExitFn(0, "HandleUpdateDealerCreditRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update dealer credit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update dealer credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateDealerCredit)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update dealer credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Update Dealer Credit request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateDealerCredit.UniqueId) <= 0) || (len(updateDealerCredit.Date) <= 0) ||
		(len(updateDealerCredit.ApprovedBy) <= 0) || (len(updateDealerCredit.Notes) <= 0) {
		err = errors.New("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerCredit.RecordId <= int64(0) {
		err = errors.New("Invalid record_id Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerCredit.ExactAmount <= float64(0) {
		err = errors.New("Invalid ExactAmount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid ExactAmount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if updateDealerCredit.PerKwAmount <= float64(0) {
		err = errors.New("Invalid PerKwAmount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid PerKwAmount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	Date, err := time.Parse("2006-01-02", updateDealerCredit.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	query := `
		SELECT system_size FROM consolidated_data_view WHERE unique_id = $1`
	whereEleList = append(whereEleList, updateDealerCredit.UniqueId)

	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get new form data for table name from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Unique ID, does not exist", http.StatusBadRequest, nil)
		return
	}

	if len(data) > 0 {
		sysSize = data[0]["system_size"].(float64)
	}
	if updateDealerCredit.ExactAmount > 0 {
		totalAmount = updateDealerCredit.ExactAmount
	} else if updateDealerCredit.PerKwAmount > 0 {
		totalAmount = (sysSize * updateDealerCredit.PerKwAmount)
	}

	queryParameters = append(queryParameters, updateDealerCredit.RecordId)
	queryParameters = append(queryParameters, updateDealerCredit.UniqueId)
	queryParameters = append(queryParameters, Date)
	queryParameters = append(queryParameters, updateDealerCredit.ExactAmount)
	queryParameters = append(queryParameters, updateDealerCredit.PerKwAmount)
	queryParameters = append(queryParameters, updateDealerCredit.ApprovedBy)
	queryParameters = append(queryParameters, updateDealerCredit.Notes)
	queryParameters = append(queryParameters, totalAmount)
	queryParameters = append(queryParameters, sysSize)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateDealerCreditFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update dealer credit in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update dealer credit", http.StatusInternalServerError, nil)
		return
	}

	resultData := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "dealer credit updated with Id: %+v", resultData["result"])
	appserver.FormAndSendHttpResp(resp, "Dealer Credit Updated Successfully", http.StatusOK, nil)
}
