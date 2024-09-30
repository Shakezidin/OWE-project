/**************************************************************************
 * File       	   : apiGetInstallCostData.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleManageDlrPayTileDataRequest
 * DESCRIPTION:     handler for get InstallCost data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleManageDlrPayTileDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		data    []map[string]interface{}
		dataReq models.GetDlrPayTileDataReq
		query   string
	)

	log.EnterFn(0, "HandleManageDlrPayTileDataRequest")
	defer func() { log.ExitFn(0, "HandleManageDlrPayTileDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dlr pay time data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dlrpay tile  data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dlrpay tile data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dlrpay tile data Request body", http.StatusBadRequest, nil)
		return
	}

	if len(dataReq.Dealer) <= 0 {
		dataReq.Dealer = "ALL"
	}
	// tableName := db.TableName_DLR_PAY_APCALC

	if dataReq.Dealer == "ALL" {
		query = `
		SELECT
		(SELECT SUM(r1_comm_paid) 
		 FROM dealer_pay_calc_standard 
		 WHERE inst_sys IS NULL 
		   AND r1_comm_paid IS NOT NULL) AS amount_prepaid,
		
		(SELECT SUM(r1_balance)
		 FROM dealer_pay_calc_standard 
		 WHERE unique_id IS NOT NULL 
		   AND dealer NOT IN ('HOUSE') 
		   AND r1_balance != 'NaN') AS pipeline_remaining,
		
		(SELECT SUM(draw_amt) 
		 FROM dlr_pay_pr_data 
		 WHERE draw_amt IS NOT NULL) AS current_due`
	} else {
		query = fmt.Sprintf(`
		SELECT
			(SELECT SUM(r1_comm_paid) 
			 FROM dealer_pay_calc_standard 
			 WHERE inst_sys IS NULL 
			   AND dealer = '%v' 
			   AND r1_comm_paid != 'NaN' AND r1_comm_paid != 'Infinity') AS amount_prepaid,
			
			(SELECT SUM(r1_balance) 
			 FROM dealer_pay_calc_standard 
			 WHERE unique_id IS NOT NULL 
			   AND dealer = '%v' 
			   AND r1_balance != 'NaN' AND r1_balance != 'Infinity') AS pipeline_remaining,
			
			(SELECT SUM(draw_amt) 
			 FROM dlr_pay_pr_data 
			 WHERE dealer = '%v' 
			 AND draw_amt != 'NaN' AND draw_amt != 'Infinity') AS current_due`,
			dataReq.Dealer, dataReq.Dealer, dataReq.Dealer)
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get dlrpay tile data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get dlrpay tile data from DB", http.StatusBadRequest, nil)
		return
	}

	amountPrepaid, _ := data[0]["amount_prepaid"].(float64)
	pipelineRemaining, _ := data[0]["pipeline_remaining"].(float64)
	currentDue, _ := data[0]["current_due"].(float64)

	// Prepare response data structure
	dealerPayTileData := models.GetDealerPayTileData{
		AmountPrepaid:     amountPrepaid,
		PipelineRemaining: pipelineRemaining,
		CurrentDue:        currentDue,
	}

	// Log the data being sent
	log.FuncDebugTrace(0, "dlr pay tiles data: %+v", dealerPayTileData)

	// Send response using appserver.FormAndSendHttpResp function
	appserver.FormAndSendHttpResp(resp, "dealer pay tales data retrieved successfully", http.StatusOK, dealerPayTileData)
}
