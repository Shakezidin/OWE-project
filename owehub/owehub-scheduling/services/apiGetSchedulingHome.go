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

	scheduleDataQuery = `
		SELECT 
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
			contract_date $1`

	scheduleDataRecords, err = db.ReteriveFromDB(db.RowDataDBIndex, scheduleDataQuery, []interface{}{dataReq.Order})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get schedule data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get schedule data from DB", http.StatusBadRequest, nil)
		return
	}

	priorityTime := time.Now().Add(-36 * time.Hour) // contracts before this time are "priority"

	for _, record := range scheduleDataRecords {
		// Home Owner Name
		homeOwner, ok := record["home_owner"].(string)
		if !ok || homeOwner == "" {
			log.FuncErrorTrace(0, "Failed to get home owner name for Record: %v", record)
			continue
		}

		// Email
		customerEmail, ok := record["customer_email"].(string)
		if !ok || customerEmail == "" {
			log.FuncErrorTrace(0, "Failed to get customer email for Record: %v", record)
			continue
		}

		// Phone Number
		customerPhoneNumber, ok := record["customer_phone_number"].(string)
		if !ok || customerPhoneNumber == "" {
			log.FuncErrorTrace(0, "Failed to get customer phone number for Home Owner: %v, Item: %+v", homeOwner, record)
			customerPhoneNumber = ""
		}

		// System Size
		systemSize, ok := record["system_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get system size for Home Owner: %v, Item: %+v", homeOwner, record)
			systemSize = 0.0
		}

		// Address
		address, ok := record["address"].(string)
		if !ok || address == "" {
			log.FuncErrorTrace(0, "Failed to get address for Home Owner: %v, Item: %+v", homeOwner, record)
			address = ""
		}

		// Contract Date
		contractDate, ok := record["contract_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get contract date for Home Owner: %v, Item: %+v", homeOwner, record)
			contractDate = time.Time{}
		}

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
