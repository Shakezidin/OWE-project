/**************************************************************************
 * File       	   : apiGetDealerOverrideData.go
 * DESCRIPTION     : This file contains functions to get Dealer Override data handler
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
 * FUNCTION:		HandleGetDealerOverrideConfigRequest
 * DESCRIPTION:     handler for get Dealer Override data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetDealerOverrideConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.DataRequestBody
		RecordCount    int
		dlrOverrideCgf oweconfig.DealerOverride
	)

	log.EnterFn(0, "HandleGetDealerOverrideConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetDealerOverrideConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dealer override data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer override data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealer override data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer override data Request body", http.StatusBadRequest, nil)
		return
	}

	/*Load Condiguration from database*/
	dlrOverrideCgf, err = oweconfig.GetDealerOverrideConfigFromDB(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to load dealer override config from DB. err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to load dealer override config from DB", http.StatusInternalServerError, nil)
		return
	}

	RecordCount = int(len(dlrOverrideCgf.DealerOverrideData))
	log.FuncDebugTrace(0, "Dealer override Config Total No of Records: %v", RecordCount)

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset := (dataReq.PageNumber - 1) * dataReq.PageSize
		if offset < RecordCount { // Ensure the offset is within the total record count
			end := offset + dataReq.PageSize
			if end > RecordCount { // Adjust the end index if it exceeds the total count
				end = RecordCount
			}
			dlrOverrideCgf.DealerOverrideData = dlrOverrideCgf.DealerOverrideData[offset:end]
		} else {
			dlrOverrideCgf.DealerOverrideData = []oweconfig.DealerOverrideStruct{}
		}
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of dealer override List fetched : %v list %+v", len(dlrOverrideCgf.DealerOverrideData), dlrOverrideCgf)
	appserver.FormAndSendHttpResp(resp, "Dealer override Data", http.StatusOK, dlrOverrideCgf, int64(RecordCount))
}
