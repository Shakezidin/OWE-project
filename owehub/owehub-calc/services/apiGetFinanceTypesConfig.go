/**************************************************************************
 * File       	   : apiGetFinanceTypesData.go
 * DESCRIPTION     : This file contains functions to get FinanceTypes data handler
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
 * FUNCTION:		HandleGetFinanceTypesConfigRequest
 * DESCRIPTION:     handler for get FinanceTypes data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetFinanceTypesConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.DataRequestBody
		RecordCount int
		finTypesCgf oweconfig.FinanceTypes
	)

	log.EnterFn(0, "HandleGetFinanceTypesConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetFinanceTypesConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get FinanceTypes data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get FinanceTypes data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get FinanceTypes data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get FinanceTypes data Request body", http.StatusBadRequest, nil)
		return
	}

	/*Load Condiguration from database*/
	finTypesCgf, err = oweconfig.GetFinanceTypesConfigFromDB(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to load dealer finance types config from DB. err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to load dealer finance types config from DB", http.StatusInternalServerError, nil)
		return
	}

	RecordCount = int(len(finTypesCgf.FinanceTypesData))
	log.FuncDebugTrace(0, "Dealer finance types Config Total No of Records: %v", RecordCount)

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset := (dataReq.PageNumber - 1) * dataReq.PageSize
		if offset < RecordCount { // Ensure the offset is within the total record count
			end := offset + dataReq.PageSize
			if end > RecordCount { // Adjust the end index if it exceeds the total count
				end = RecordCount
			}
			finTypesCgf.FinanceTypesData = finTypesCgf.FinanceTypesData[offset:end]
		} else {
			finTypesCgf.FinanceTypesData = []oweconfig.FinanceTypesStruct{}
		}
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of finance types List fetched : %v list %+v", len(finTypesCgf.FinanceTypesData), finTypesCgf)
	appserver.FormAndSendHttpResp(resp, "Dealer finance types Data", http.StatusOK, finTypesCgf, int64(RecordCount))
}
