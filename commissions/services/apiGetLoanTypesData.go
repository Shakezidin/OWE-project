/**************************************************************************
 * File       	   : apiGetLoanTypesData.go
 * DESCRIPTION     : This file contains functions for get loan type data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetLoanTypesDataRequest
 * DESCRIPTION:     handler for get loan data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLoanTypesDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetLoanTypesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLoanTypesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get loan data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get loan data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get loan data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get loan data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_loan_type
	query = `
	SELECT lt.product_code, lt.active, lt.adder, lt.description FROM loan_type lt`

	filter, whereEleList = PrepareFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get partner data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get partner data from DB", http.StatusBadRequest, nil)
		return
	}

	loansList := models.GetLoanTypeList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		// Convert fields from item
		productCode, codeOk := item["product_code"].(string)
		if !codeOk || productCode == "" {
			log.FuncErrorTrace(0, "Failed to get partner code Item: %+v\n", item)
			continue
		}

		active, activeOk := func() (int, bool) {
			activeVal, ok := item["active"].(int64)
			if !ok {
				return 0, false
			}
			return int(activeVal), true
		}()
		if !activeOk {
			log.FuncErrorTrace(0, "Failed to get active Item: %+v\n", item)
			continue
		}

		adder, adderOk := func() (int, bool) {
			adderVal, ok := item["adder"].(int64)
			if !ok {
				return 0, false
			}
			return int(adderVal), true
		}()
		if !adderOk {
			log.FuncErrorTrace(0, "Failed to get adder Item: %+v\n", item)
			continue
		}
		description, descOk := item["description"].(string)
		if !descOk || description == "" {
			description = ""
		}

		// Create a new CreateLoanType object
		loanType := models.GetLoanTypeData{
			ProductCode: productCode,
			Active:      active,
			Adder:       adder,
			Description: description,
		}
		loansList.LoanTypeList = append(loansList.LoanTypeList, loanType)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of loan List fetched : %v list %+v", len(loansList.LoanTypeList), loansList)
	FormAndSendHttpResp(resp, "Loan Data", http.StatusOK, loansList)
}
