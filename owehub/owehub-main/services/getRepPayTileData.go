/**************************************************************************
 * File       	   : apiGetInstallCostData.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetInstallCostDataRequest
 * DESCRIPTION:     handler for get InstallCost data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleManageRepPayTileDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		data    []map[string]interface{}
		dataReq models.GetRepPayTileDataReq
		query   string
	)

	log.EnterFn(0, "HandleGetInstallCostDataRequest")
	defer func() { log.ExitFn(0, "HandleGetInstallCostDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get install cost data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dlr_oth  data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dlr_oth  data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get dlr_oth  data Request body", http.StatusBadRequest, nil)
		return
	}

	if len(dataReq.Dealer) <= 0 {
		dataReq.Dealer = "ALL"
	}
	// tableName := db.TableName_DLR_PAY_APCALC

	if dataReq.Dealer == "ALL" {
		query = `SELECT
		(SELECT SUM(amt_paid)
		 FROM rep_pay_pr_data
		 WHERE current_status = 'ACTIVE'
		   AND current_status != 'PTO') AS amount_paid,
	    (SELECT SUM(amt_paid) FROM rep_pay_pr_data) AS amt_paid
		(SELECT SUM(balance)
		 FROM rep_pay_pr_data
		 WHERE current_status IN ('NTP', 'Install', 'PTO')) AS current_due`
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get install cost data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get install cost data from DB", http.StatusBadRequest, nil)
		return
	}

	amountPrepaid, _ := data[0]["amount_paid"].(float64)
	pipelineRemaining, _ := data[0]["amt_paid"].(float64)
	currentDue, _ := data[0]["current_due"].(float64)

	// Prepare response data structure
	dealerPayTileData := models.GetDealerPayTileData{
		AmountPrepaid:     amountPrepaid,
		PipelineRemaining: pipelineRemaining - amountPrepaid,
		CurrentDue:        currentDue,
	}

	// Log the data being sent
	log.FuncDebugTrace(0, "dlr pay tiles data: %+v", dealerPayTileData)

	// Send response using FormAndSendHttpResp function
	FormAndSendHttpResp(resp, "dealer pay tales data retrieved successfully", http.StatusOK, dealerPayTileData)
}
