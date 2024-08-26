/**************************************************************************
 * File            : apiGetSchedulingHome.go
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
 * FUNCTION:         HandleGetSchedulingHome
 * DESCRIPTION:      handler for get ScheduleData request
 * INPUT:            resp, req
 * RETURNS:          void
 ******************************************************************************/
func HandleGetSchedulingHome(resp http.ResponseWriter, req *http.Request) {
	var (
		err                 error
		dataReq             models.GetSchedulingHomeRequest
		apiResp             models.GetSchedulingHomeList
		scheduleDataQuery   string
		scheduleDataRecords []map[string]interface{}
		recordCount         int64
	)

	log.EnterFn(0, "HandleGetSchedulingHome")
	defer func() { log.ExitFn(0, "HandleGetSchedulingHome", err) }()

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
		log.FuncErrorTrace(0, "Invalid pagination provided for ScheduleData data request")
		FormAndSendHttpResp(resp, "Invalid Pagination Provided", http.StatusBadRequest, nil)
		return
	}

	if dataReq.Order != "desc" && dataReq.Order != "asc" {
		log.FuncErrorTrace(0, "Invalid order provided for ScheduleData data request")
		FormAndSendHttpResp(resp, "Invalid Order Provided", http.StatusBadRequest, nil)
		return
	}

	scheduleDataQuery = fmt.Sprintf(
		`SELECT 
			 home_owner, 
			 customer_email,
			 customer_phone_number,
			 system_size,
			 address,
			 contract_date
		 FROM CONSOLIDATED_DATA_VIEW
		 WHERE
		 	 contract_date IS NOT NULL 
		 	 AND site_survey_scheduled_date IS NULL
		 ORDER BY 
			 contract_date %s`,
		dataReq.Order,
	)

	scheduleDataRecords, err = db.ReteriveFromDB(db.RowDataDBIndex, scheduleDataQuery, nil)

	priorityTime := time.Now().Add(-36 * time.Hour) // contracts before this time are "priority"

	for _, record := range scheduleDataRecords {
		homeOwner, _ := record["home_owner"].(string)
		// roofType, _ := item["roof_type"].(string)
		customerEmail, _ := record["customer_email"].(string)
		customerPhoneNumber, _ := record["customer_phone_number"].(string)
		systemSize, _ := record["system_size"].(float64)
		address, _ := record["address"].(string)
		contractDate, _ := record["contract_date"].(time.Time)

		itemQueue := "regular" // item belongs to regular queue by default

		item := models.GetSchedulingHome{
			HomeOwner:           homeOwner,
			RoofType:            "XYZ",
			CustomerEmail:       customerEmail,
			CustomerPhoneNumber: customerPhoneNumber,
			SystemSize:          systemSize,
			Address:             address,
		}

		// Job is in priority if:
		// 1. More than 36 hours have been passed since contract
		// TODO: More conditions for priority job
		if contractDate.Before(priorityTime) {
			itemQueue = "priority"
		}

		// TODO: Implement travel queue

		// push the item if desired queue is selected
		if dataReq.Queue == itemQueue {
			apiResp.SchedulingHomeList = append(apiResp.SchedulingHomeList, item)
		}

	}

	apiResp.SchedulingHomeList = StaticPaginate(apiResp.SchedulingHomeList, dataReq.PageNumber, dataReq.PageSize)

	recordCount = int64(len(apiResp.SchedulingHomeList))
	log.FuncInfoTrace(0, "Number of ScheduleData fetched : %v list %+v", recordCount, apiResp.SchedulingHomeList)
	FormAndSendHttpResp(resp, "ScheduleData", http.StatusOK, apiResp, recordCount)

}
