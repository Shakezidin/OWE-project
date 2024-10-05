/**************************************************************************
 * File       	   : apiGetFinanceScheduleData.go
 * DESCRIPTION     : This file contains functions to get Finance Schedule data handler
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
 * FUNCTION:		HandleGetFinanceScheduleConfigRequest
 * DESCRIPTION:     handler for get Finance Schedule data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetFinanceScheduleConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.DataRequestBody
		RecordCount    int
		finScheduleCgf oweconfig.FinanceSchedule
	)

	log.EnterFn(0, "HandleGetFinanceScheduleConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetFinanceScheduleConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get dealer finance schedule data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer finance schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get dealer finance schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer finance schedule data Request body", http.StatusBadRequest, nil)
		return
	}

	/*Load Condiguration from database*/
	finScheduleCgf, err = oweconfig.GetFinanceScheduleConfigFromDB(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to load dealer finance schedule config from DB. err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to load dealer finance schedule config from DB", http.StatusInternalServerError, nil)
		return
	}

	RecordCount = int(len(finScheduleCgf.FinanceScheduleData))
	log.FuncDebugTrace(0, "Dealer finance schedule Config Total No of Records: %v", RecordCount)

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset := (dataReq.PageNumber - 1) * dataReq.PageSize
		if offset < RecordCount { // Ensure the offset is within the total record count
			end := offset + dataReq.PageSize
			if end > RecordCount { // Adjust the end index if it exceeds the total count
				end = RecordCount
			}
			finScheduleCgf.FinanceScheduleData = finScheduleCgf.FinanceScheduleData[offset:end]
		} else {
			finScheduleCgf.FinanceScheduleData = []oweconfig.FinanceScheduleStruct{}
		}
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of dealer finance schedule List fetched : %v list %+v", len(finScheduleCgf.FinanceScheduleData), finScheduleCgf)
	appserver.FormAndSendHttpResp(resp, "Dealer finance schedule Data", http.StatusOK, finScheduleCgf, int64(RecordCount))
}
