/**************************************************************************
 * File       	   : apiGetDealerCreditData.go
 * DESCRIPTION     : This file contains functions to get DealerCredit data handler
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
 * FUNCTION:		HandleGetDealerCreditConfigRequest
 * DESCRIPTION:     handler for get DealerCredit data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDealerCreditConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		RecordCount  int
		dlrCreditCgf oweconfig.DealerCredits
	)

	log.EnterFn(0, "HandleGetDealerCreditConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetDealerCreditConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dealer credit data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer credit data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealer credit data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer credit data Request body", http.StatusBadRequest, nil)
		return
	}

	/*Load Condiguration from database*/
	dlrCreditCgf, err = oweconfig.GetDealerCreditsConfigFromDB(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to load dealer credit config from DB. err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to load dealer credit config from DB", http.StatusInternalServerError, nil)
		return
	}

	RecordCount = int(len(dlrCreditCgf.DealerCreditsData))
	log.FuncDebugTrace(0, "Dealer Credit Config Total No of Records: %v", RecordCount)

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset := (dataReq.PageNumber - 1) * dataReq.PageSize
		if offset < RecordCount { // Ensure the offset is within the total record count
			end := offset + dataReq.PageSize
			if end > RecordCount { // Adjust the end index if it exceeds the total count
				end = RecordCount
			}
			dlrCreditCgf.DealerCreditsData = dlrCreditCgf.DealerCreditsData[offset:end]
		} else {
			dlrCreditCgf.DealerCreditsData = []oweconfig.DealerCreditsStruct{}
		}
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of dealer credit List fetched : %v list %+v", len(dlrCreditCgf.DealerCreditsData), dlrCreditCgf)
	appserver.FormAndSendHttpResp(resp, "Dealer Credit Data", http.StatusOK, dlrCreditCgf, int64(RecordCount))
}
