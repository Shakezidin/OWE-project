/**************************************************************************
 * File       	   : apiGetScheduleData.go
 * DESCRIPTION     : This file contains functions for get ScheduleData handler
 * DATE            : 16-Aug-2024
 **************************************************************************/

package services

import (
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
* FUNCTION:			HandleGetScheduleDataRequest
* DESCRIPTION:		handler for get ScheduleData request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetScheduleDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		dataReq             models.GetScheduleDataRequest
		apiResp             models.GetScheduleDataResponse
		scheduleDataQuery   string
		scheduleDataRecords []map[string]interface{}
		recordCount         int64
	)

	log.EnterFn(0, "HandleGetScheduleDataRequest")
	defer func() { log.ExitFn(0, "HandleGetScheduleDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ScheduleData data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ScheduleData data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ScheduleData data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get LeaderBoard data Request body", http.StatusBadRequest, nil)
		return
	}

	if dataReq.PageSize < 1 || dataReq.PageNumber < 1 {
		log.FuncErrorTrace(0, "Invalid pagination provided for ScheduleData data request err: %v", err)
		FormAndSendHttpResp(resp, "Invalid Pagination Provided", http.StatusBadRequest, nil)
		return
	}

	scheduleDataQuery = fmt.Sprintf(
		`SELECT 
			customer, 
			customer_email,
			customer_phone_number,
			system_size,
			site_survey_scheduled_date,
			site_survey_rescheduled_date
		FROM CONSOLIDATED_DATA_VIEW 
		ORDER BY 
			site_survey_rescheduled_date,
			site_survey_scheduled_date
		LIMIT %d
		OFFSET %d`,
		dataReq.PageSize,
		(dataReq.PageNumber-1)*dataReq.PageSize,
	)

	scheduleDataRecords, err = db.ReteriveFromDB(db.RowDataDBIndex, scheduleDataQuery, nil)

	for _, item := range scheduleDataRecords {

		// ScheduleDate is one of site_survey_rescheduled_date or site_survey_scheduled_date
		// depending upon which value is not null
		scheduleDate, scheduleDateOk := item["site_survey_scheduled_date"].(time.Time)
		rescheduleDate, rescheduleDateOk := item["site_survey_rescheduled_date"].(time.Time)

		scheduleDateStr := ""

		if rescheduleDateOk {
			scheduleDateStr = rescheduleDate.Format("2 January 2006")
		} else if scheduleDateOk {
			scheduleDateStr = scheduleDate.Format("2 January 2006")
		}

		apiResp.ScheduleData = append(apiResp.ScheduleData, models.GetScheduleDataResponseItem{
			Name:         item["customer"].(string),
			Email:        item["customer_email"].(string),
			PhoneNumber:  item["customer_phone_number"].(string),
			ScheduleDate: scheduleDateStr,
		})
	}

	recordCount = int64(len(apiResp.ScheduleData))
	log.FuncInfoTrace(0, "Number of ScheduleData fetched : %v list %+v", recordCount, apiResp.ScheduleData)
	FormAndSendHttpResp(resp, "ScheduleData", http.StatusOK, apiResp, recordCount)

}
