/**************************************************************************
* File			: apiCreateDealerCredit.go
* DESCRIPTION	: This file contains functions for create dealer credit handler
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
 * FUNCTION:		HandleCreateDealerCreditRequest
 * DESCRIPTION:     handler for dealer credit data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleCreateDealerCreditRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createDealerReq models.CreateDealerCredit
		queryParameters []interface{}
		result          []interface{}
		totalAmount     float64
		sysSize         float64
		whereEleList    []interface{}
	)

	log.EnterFn(0, "HandleCreateDealerCreditRequest")
	defer func() { log.ExitFn(0, "HandleCreateDealerCreditRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create dealer credit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create dealer credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createDealerReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create dealer credit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create dealer credit request", http.StatusBadRequest, nil)
		return
	}

	if (len(createDealerReq.UniqueId) <= 0) || (len(createDealerReq.Date) <= 0) ||
		(len(createDealerReq.ApprovedBy) <= 0) || (len(createDealerReq.Notes) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDealerReq.ExactAmount <= float64(0) {
		err = fmt.Errorf("Invalid ExactAmount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid ExactAmount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	if createDealerReq.PerKwAmount <= float64(0) {
		err = fmt.Errorf("Invalid PerKwAmount Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid PerKwAmount Not Allowed", http.StatusBadRequest, nil)
		return
	}

	Date, err := time.Parse("2006-01-02", createDealerReq.Date)
	if err != nil {
		fmt.Println("Error parsing date:", err)
		return
	}
	query := `
		SELECT system_size FROM consolidated_data_view WHERE unique_id = $1`
	whereEleList = append(whereEleList, createDealerReq.UniqueId)

	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get new form data for table name from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Unique ID, does not exist", http.StatusBadRequest, nil)
		return
	}

	if len(data) <= 0 {
		appserver.FormAndSendHttpResp(resp, "Invalid Unique Id", http.StatusBadRequest, nil)
		return
	}

	sysSize = data[0]["system_size"].(float64)
	if createDealerReq.ExactAmount > 0 {
		totalAmount = createDealerReq.ExactAmount
	} else if createDealerReq.PerKwAmount > 0 {
		totalAmount = (sysSize * createDealerReq.PerKwAmount)
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, createDealerReq.UniqueId)
	queryParameters = append(queryParameters, Date)
	queryParameters = append(queryParameters, createDealerReq.ExactAmount)
	queryParameters = append(queryParameters, createDealerReq.PerKwAmount)
	queryParameters = append(queryParameters, createDealerReq.ApprovedBy)
	queryParameters = append(queryParameters, createDealerReq.Notes)
	queryParameters = append(queryParameters, totalAmount)
	queryParameters = append(queryParameters, sysSize)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateDealerCreditFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add dealer credit in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Dealer Credit", http.StatusInternalServerError, nil)
		return
	}

	resultData := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New dealer credit created with Id: %+v", resultData["result"])
	appserver.FormAndSendHttpResp(resp, "Dealer Credit Created Successfully", http.StatusOK, nil)
}
