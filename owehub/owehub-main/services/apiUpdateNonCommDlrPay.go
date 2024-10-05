/**************************************************************************
* File			: apiUpdateNonCommDlrPayRequest.go
* DESCRIPTION	: This file contains functions for Update non comm dlrpay handler
* DATE			: 25-Apr-2024
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
 * FUNCTION:		HandleUpdateNonCommDlrPayRequest
 * DESCRIPTION:     handler for Update non comm dlrpay request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateNonCommDlrPayRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		UpdateNonCommDlrPay models.UpdateNonCommDlrPay
		queryParameters     []interface{}
		result              []interface{}
		whereEleList        []interface{}
		query               string
		data                []map[string]interface{}
		customer            string
		dealerName          string
		dealerDBA           string
		balance             float64
		paidAmount          float64
	)

	log.EnterFn(0, "HandleUpdateNonCommDlrPayRequest")
	defer func() { log.ExitFn(0, "HandleUpdateNonCommDlrPayRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update non comm dealer pay request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update non comm dealer pay request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &UpdateNonCommDlrPay)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update non comm dealer pay request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update non comm dealer pay request", http.StatusBadRequest, nil)
		return
	}

	// Validate string fields
	if len(UpdateNonCommDlrPay.UniqueID) <= 0 ||
		len(UpdateNonCommDlrPay.ApprovedBy) <= 0 ||
		len(UpdateNonCommDlrPay.Notes) <= 0 ||
		len(UpdateNonCommDlrPay.Date) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	// Validate float64 fields
	if UpdateNonCommDlrPay.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid record_id: %f, Not Allowed", UpdateNonCommDlrPay.RecordId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid record_id Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if len(UpdateNonCommDlrPay.UniqueID) > 0 {
		query = `SELECT home_owner as customer, dealer as dealer_name FROM consolidated_data_view WHERE unique_id = $1`
		whereEleList = append(whereEleList, UpdateNonCommDlrPay.UniqueID)
		data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get customer, dealer_name,dealerDba from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get customer, dealer_name,dealerDba from DB", http.StatusBadRequest, nil)
			return
		}
		if len(data) > 0 {
			customer = data[0]["customer"].(string)
			dealerName = data[0]["dealer_name"].(string)
			// dealerDBA = data[0]["dealerDBA"].(string)
		}
	}

	if len(customer) > 0 {
		query = fmt.Sprintf("SELECT SUM(ad.amount) as paid_amount FROM ap_dealer ad WHERE ad.unique_id = '%v' AND type = 'Non-COMM'", UpdateNonCommDlrPay.UniqueID)

		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get appt setters data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get appt setters data from DB", http.StatusBadRequest, nil)
			return
		}
		if len(data) > 0 {
			paidAmount = data[0]["paid_amount"].(float64)
		}
	}

	if len(customer) > 0 {
		balance = UpdateNonCommDlrPay.ExactAmount - paidAmount
	}

	date, err := time.Parse("2006-01-02", UpdateNonCommDlrPay.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.RecordId)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.UniqueID)
	queryParameters = append(queryParameters, customer)
	queryParameters = append(queryParameters, dealerName)
	queryParameters = append(queryParameters, dealerDBA)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.ExactAmount)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.ApprovedBy)
	queryParameters = append(queryParameters, UpdateNonCommDlrPay.Notes)
	queryParameters = append(queryParameters, balance)
	queryParameters = append(queryParameters, paidAmount)
	queryParameters = append(queryParameters, dealerDBA)
	queryParameters = append(queryParameters, date)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateNonCommDlrPayFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to update non comm dealer pay in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update non comm dealer pay", http.StatusInternalServerError, nil)
		return
	}

	responce := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "non comm dealer pay Updated with Id: %+v", responce["result"])
	appserver.FormAndSendHttpResp(resp, "Non Comm Dealer Pay Updated Successfully", http.StatusOK, nil)
}
