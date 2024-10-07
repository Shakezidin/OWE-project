/**************************************************************************
 * File       	   : apiGetPartnerPayScheduleData.go
 * DESCRIPTION     : This file contains functions to get PartnerPaySchedule data handler
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
 * FUNCTION:		HandleGetPartnerPayScheduleConfigRequest
 * DESCRIPTION:     handler for get PartnerPaySchedule data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetPartnerPayScheduleConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		dataReq            models.DataRequestBody
		RecordCount        int
		partnerPaySchedCgf oweconfig.PartnerPaySchedule
	)

	log.EnterFn(0, "HandleGetPartnerPayScheduleConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetPartnerPayScheduleConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PartnerPaySchedule data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PartnerPaySchedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PartnerPaySchedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PartnerPaySchedule data Request body", http.StatusBadRequest, nil)
		return
	}

	/*Load Condiguration from database*/
	partnerPaySchedCgf, err = oweconfig.GetPartnerPayScheduleConfigFromDB(dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to load PartnerPaySchedule config from DB. err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to load PartnerPaySchedule config from DB", http.StatusInternalServerError, nil)
		return
	}

	RecordCount = int(len(partnerPaySchedCgf.PartnerPayScheduleData))
	log.FuncDebugTrace(0, "PartnerPaySchedule Config Total No of Records: %v", RecordCount)

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset := (dataReq.PageNumber - 1) * dataReq.PageSize
		if offset < RecordCount { // Ensure the offset is within the total record count
			end := offset + dataReq.PageSize
			if end > RecordCount { // Adjust the end index if it exceeds the total count
				end = RecordCount
			}
			partnerPaySchedCgf.PartnerPayScheduleData = partnerPaySchedCgf.PartnerPayScheduleData[offset:end]
		} else {
			partnerPaySchedCgf.PartnerPayScheduleData = []oweconfig.PartnerPayScheduleStruct{}
		}
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of PartnerPaySchedule List fetched : %v list %+v", len(partnerPaySchedCgf.PartnerPayScheduleData), partnerPaySchedCgf)
	appserver.FormAndSendHttpResp(resp, "PartnerPaySchedule Data", http.StatusOK, partnerPaySchedCgf, int64(RecordCount))
}
