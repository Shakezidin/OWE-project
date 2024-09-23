/**************************************************************************
* File			: apiUpdateMarketingFee.go
* DESCRIPTION	: This file contains functions for update Marketing Fee
						setter handler
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
 * FUNCTION:		HandleUpdateMarketingFeeRequest
 * DESCRIPTION:     handler for update marketing fee request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateMarketingFeeRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		updateMarketingFeeReq models.UpdateMarketingFee
		queryParameters       []interface{}
		result                []interface{}
	)

	log.EnterFn(0, "HandleUpdateMarketingFeeRequest")
	defer func() { log.ExitFn(0, "HandleUpdateMarketingFeeRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update marketing fee request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update marketing fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateMarketingFeeReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update marketing fee request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update marketing fee request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateMarketingFeeReq.Source) <= 0) || (len(updateMarketingFeeReq.Dba) <= 0) ||
		(len(updateMarketingFeeReq.State) <= 0) || (len(updateMarketingFeeReq.FeeRate) <= 0) ||
		(len(updateMarketingFeeReq.StartDate) <= 0) || (len(updateMarketingFeeReq.EndDate) <= 0) ||
		(len(updateMarketingFeeReq.Description) <= 0) {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed, Update failed", http.StatusBadRequest, nil)
		return
	}

	if updateMarketingFeeReq.RecordId <= int64(0) {
		err = fmt.Errorf("Invalid Record Id, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Record Id, Update failed", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("2006-01-02", updateMarketingFeeReq.StartDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid start date not allowed", http.StatusBadRequest, nil)
		return
	}

	endDate, err := time.Parse("2006-01-02", updateMarketingFeeReq.EndDate)
	if err != nil {
		err = fmt.Errorf("Error parsing start date:", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid end date not allowed", http.StatusBadRequest, nil)
		return
	}
	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, updateMarketingFeeReq.RecordId)
	queryParameters = append(queryParameters, updateMarketingFeeReq.Source)
	queryParameters = append(queryParameters, updateMarketingFeeReq.Dba)
	queryParameters = append(queryParameters, updateMarketingFeeReq.State)
	queryParameters = append(queryParameters, updateMarketingFeeReq.FeeRate)
	queryParameters = append(queryParameters, updateMarketingFeeReq.ChgDlr)
	queryParameters = append(queryParameters, updateMarketingFeeReq.PaySrc)
	queryParameters = append(queryParameters, startDate)
	queryParameters = append(queryParameters, endDate)
	queryParameters = append(queryParameters, updateMarketingFeeReq.Description)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateMarketingFeeFunction, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Update marketing fee in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Update marketing fee", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "marketing fee updated with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Marketing Fee Updated Successfully", http.StatusOK, nil)
}
