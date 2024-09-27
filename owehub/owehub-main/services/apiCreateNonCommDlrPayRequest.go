/**************************************************************************
* File			: apiCreateNonCommDlrPayRequest.go
* DESCRIPTION	: This file contains functions for create NonCommDlrPay handler
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
 * FUNCTION:		HandleCreateNonCommDlrPayRequest
 * DESCRIPTION:     handler for create NonCommDlrPay request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreateNonCommDlrPayRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		createNonCommDlrPay models.CreateNonCommDlrPay
		query               string
		data                []map[string]interface{}
		queryParameters     []interface{}
		result              []interface{}
		whereEleList        []interface{}
		customer            string
		dealerName          string
		dealerDBA           string
		balance             float64
		paidAmount          float64
	)

	log.EnterFn(0, "HandleCreateNonCommDlrPayRequest")
	defer func() { log.ExitFn(0, "HandleCreateNonCommDlrPayRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create non comm dealer pay request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create non comm dealer pay request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createNonCommDlrPay)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create non comm dealer pay request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create Non Comm Dealer Pay request", http.StatusBadRequest, nil)
		return
	}

	// Validate string fields
	if len(createNonCommDlrPay.UniqueID) <= 0 ||
		len(createNonCommDlrPay.ApprovedBy) <= 0 ||
		len(createNonCommDlrPay.Notes) <= 0 ||
		len(createNonCommDlrPay.Date) <= 0 {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if len(createNonCommDlrPay.UniqueID) > 0 {
		query = `SELECT home_owner as customer, dealer as dealer_name FROM consolidated_data_view WHERE unique_id = $1`
		whereEleList = append(whereEleList, createNonCommDlrPay.UniqueID)
		data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get customer, dealer_name,dealerDba from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get customer, dealer_name,dealerDba from DB", http.StatusBadRequest, nil)
			return
		}
		if len(data) > 0 {
			customer = data[0]["customer"].(string)
			dealerName = data[0]["dealer_name"].(string)
		}
	}

	if len(customer) > 0 {
		query = fmt.Sprintf("SELECT SUM(ad.amount) as paid_amount FROM ap_dealer ad WHERE ad.unique_id = '%v' AND type = 'Non-COMM'", createNonCommDlrPay.UniqueID)
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
		balance = createNonCommDlrPay.ExactAmount - paidAmount
	}

	date, err := time.Parse("2006-01-02", createNonCommDlrPay.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createNonCommDlrPay.UniqueID)
	queryParameters = append(queryParameters, customer)
	queryParameters = append(queryParameters, dealerName)
	queryParameters = append(queryParameters, dealerDBA)
	queryParameters = append(queryParameters, createNonCommDlrPay.ExactAmount)
	queryParameters = append(queryParameters, createNonCommDlrPay.ApprovedBy)
	queryParameters = append(queryParameters, createNonCommDlrPay.Notes)
	queryParameters = append(queryParameters, balance)
	queryParameters = append(queryParameters, paidAmount)
	queryParameters = append(queryParameters, dealerDBA)
	queryParameters = append(queryParameters, date)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateNonCommDlrPayFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add non comm dealer pay in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Non Comm Dealer Pay", http.StatusInternalServerError, nil)
		return
	}

	responce := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New non comm dealer pay created with Id: %+v", responce["result"])
	appserver.FormAndSendHttpResp(resp, "Non Comm Dealer Pay Created Successfully", http.StatusOK, nil)
}
