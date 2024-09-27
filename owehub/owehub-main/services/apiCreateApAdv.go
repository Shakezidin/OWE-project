/**************************************************************************
* File			: 	apiCreateApAdv.go
* DESCRIPTION	: This file contains functions to create ApAdv handler
* DATE			: 	21-May-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"io"
	"time"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:				HandleCreateApAdvRequest
 * DESCRIPTION:     handler to create ApAdv request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateApAdvRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		createApAdvReq  models.CreateApAdv
		queryParameters []interface{}
		result          []interface{}
		// whereEleList    []interface{}
		// customer        string
		// dealer          string
	)

	log.EnterFn(0, "HandleCreateApAdvRequest")
	defer func() { log.ExitFn(0, "HandleCreateApAdvRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create ApAdv request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create ApAdv request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createApAdvReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create ApAdv request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createApAdvReq.UniqueId) <= 0) || (len(createApAdvReq.Payee) <= 0) ||
		(len(createApAdvReq.Date) <= 0) || (len(createApAdvReq.ApprovedBy) <= 0) ||
		(len(createApAdvReq.Notes) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// cdvQuery := `SELECT
	// dealer, customer
	// FROM ` + db.ViewName_ConsolidatedDataView +
	// 	` WHERE unique_id = $1`

	// whereEleList = append(whereEleList, createApAdvReq.UniqueId)
	// data, err := db.ReteriveFromDB(db.RowDataDBIndex, cdvQuery, whereEleList)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get UserMgmt Onboarding data from DB err: %v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Failed to get UserMgmt Onboarding data from DB", http.StatusBadRequest, nil)
	// 	return
	// }

	// if len(data) > 0 {
	// 	customer = data[0]["home_owner"].(string)
	// 	customer = data[0]["dealer"].(string)
	// }

	if createApAdvReq.AmountOvrd <= float64(0) {
		err = errors.New("invalid values not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Values Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// converting string to date format
	date, err := time.Parse("2006-01-02", createApAdvReq.Date)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse Date: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse Date", http.StatusInternalServerError, nil)
		return
	}

	queryParameters = append(queryParameters, createApAdvReq.UniqueId)
	queryParameters = append(queryParameters, createApAdvReq.Payee)
	queryParameters = append(queryParameters, date)
	queryParameters = append(queryParameters, createApAdvReq.AmountOvrd)
	queryParameters = append(queryParameters, createApAdvReq.ApprovedBy)
	queryParameters = append(queryParameters, createApAdvReq.Notes)
	// queryParameters = append(queryParameters, dealer)
	// queryParameters = append(queryParameters, customer)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateApAdvFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add ApAdv in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create ApAdv", http.StatusInternalServerError, nil)
		return
	}

	rdata := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New ApAdv created with Id: %+v", rdata["result"])
	appserver.FormAndSendHttpResp(resp, "ApAdv Created Successfully", http.StatusOK, nil)
}
