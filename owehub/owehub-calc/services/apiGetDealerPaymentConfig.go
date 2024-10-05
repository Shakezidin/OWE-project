/**************************************************************************
 * File       	   : apiGetDealerPaymentConfig.go
 * DESCRIPTION     : This file contains functions to get Dealer payment data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	oweconfig "OWEApp/shared/oweconfig"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetDealerPaymentConfigRequest
 * DESCRIPTION:     handler for get Dealer Payment data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDealerPaymentConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err           error
		dataReq       models.DataRequestBody
		RecordCount   int
		dlrPaymentCgf oweconfig.DealerPayments
	)

	log.EnterFn(0, "HandleGetDealerPaymentConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetDealerPaymentConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dealer payment data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer payment data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealer payment data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer payment data Request body", http.StatusBadRequest, nil)
		return
	}

	/*Load Condiguration from database*/
	dlrPaymentCgf, err = oweconfig.GetDealerPaymentsConfigFromDB(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to load dealer payment config from DB. err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to load dealer payment config from DB", http.StatusInternalServerError, nil)
		return
	}

	RecordCount = int(len(dlrPaymentCgf.DealerPaymentsData))
	log.FuncDebugTrace(0, "Dealer Payment Config Total No of Records: %v", RecordCount)

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset := (dataReq.PageNumber - 1) * dataReq.PageSize
		if offset < RecordCount { // Ensure the offset is within the total record count
			end := offset + dataReq.PageSize
			if end > RecordCount { // Adjust the end index if it exceeds the total count
				end = RecordCount
			}
			dlrPaymentCgf.DealerPaymentsData = dlrPaymentCgf.DealerPaymentsData[offset:end]
		} else {
			dlrPaymentCgf.DealerPaymentsData = []oweconfig.DealerPaymentsStruct{}
		}
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of dealer payment List fetched : %v list %+v", len(dlrPaymentCgf.DealerPaymentsData), dlrPaymentCgf)
	appserver.FormAndSendHttpResp(resp, "Dealer payment Data", http.StatusOK, dlrPaymentCgf, int64(RecordCount))
}
