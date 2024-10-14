/**************************************************************************
* File                  : apiHandleGetLeadsDataRequest.go
* DESCRIPTION           : This file contains functions to get leads information

* DATE                  : 11-September-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

/******************************************************************************
* FUNCTION:		    HandleGetLeadsDataRequest
* DESCRIPTION:      handler for get leads data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetLeadsDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		startTime    time.Time
		endTime      time.Time
		dataReq      models.GetLeadsRequest
		data         []map[string]interface{}
		query        string
		offset       int
		whereEleList []interface{}
		whereClause  string
		recordCount  int64
	)

	log.EnterFn(0, "HandleGetLeadsDataRequest")

	defer func() { log.ExitFn(0, "HandleGetLeadsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get leads data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get leads data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get leads data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get leads data Request body", http.StatusInternalServerError, nil)
		return
	}

	// validating start date
	startTime, err = time.Parse("02-01-2006", dataReq.StartDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to convert Start date :%+v to time.Time err: %+v", dataReq.StartDate, err)
		appserver.FormAndSendHttpResp(resp, "Invalid date format, Expected format : DD-MM-YYYY", http.StatusInternalServerError, nil)
		return
	}

	// validating end date
	endTime, err = time.Parse("02-01-2006", dataReq.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to convert end date :%+v to time.Time err: %+v", dataReq.EndDate, err)
		appserver.FormAndSendHttpResp(resp, "Invalid date format, Expected format : DD-MM-YYYY", http.StatusInternalServerError, nil)
		return
	}

	userEmail := req.Context().Value("emailid").(string)

	// build whereclause based on requested status

	if dataReq.LeadStatus == "NEW" {
		whereClause = "WHERE li.status_id = 0 AND li.is_appointment_required = TRUE"
	}

	if dataReq.LeadStatus == "PROGRESS" {
		whereClause = `
			WHERE (li.status_id = 1 AND li.appointment_date > CURRENT_TIMESTAMP)
			OR (li.status_id = 2 AND li.appointment_date > CURRENT_TIMESTAMP)
			OR (li.status_id = 5 AND li.proposal_created_date IS NULL)
			OR (li.is_appointment_required = FALSE AND li.proposal_created_date IS NULL)
		`
	}

	if dataReq.LeadStatus == "DECLINED" {
		whereClause = "WHERE li.status_id = 3"
	}

	if dataReq.LeadStatus == "ACTION_NEEDED" {
		whereClause = `
			WHERE li.status_id = 4
			OR (li.status_id IN (1, 2, 5) AND li.appointment_date < CURRENT_TIMESTAMP AND li.proposal_created_date IS NULL)
		`
	}

	if whereClause == "" {
		appserver.FormAndSendHttpResp(resp, "Invalid Lead Status", http.StatusBadRequest, nil)
		return
	}

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset = (dataReq.PageNumber - 1) * dataReq.PageSize
	}

	whereClause = fmt.Sprintf(`
			%s 
			AND li.is_archived = $2
			AND li.updated_at BETWEEN $3 AND $4
		`,
		whereClause,
	)

	query = fmt.Sprintf(`
			SELECT
				li.leads_id,
				li.first_name,
				li.last_name,
				li.email_id,
				li.phone_number,
				li.street_address,
				li.finance_type,
				li.finance_company,
				li.qc_audit,
				li.appointment_scheduled_date,
				li.appointment_accepted_date,
				li.lead_won_date,
				li.is_archived,
				li.is_appointment_required,
				li.status_id
				
			FROM get_leads_info_hierarchy($1) li
			%s
			ORDER BY li.updated_at DESC
			LIMIT $5 OFFSET $6;
		`, whereClause)

	whereEleList = append(whereEleList,
		userEmail,
		dataReq.IsArchived,
		time.Date(startTime.Year(), startTime.Month(), startTime.Day(), 0, 0, 0, 0, time.UTC),
		time.Date(endTime.Year(), endTime.Month(), endTime.Day(), 23, 59, 59, 0, time.UTC),
		dataReq.PageSize,
		offset,
	)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
		return
	}

	// Create datalist
	LeadsDataList := []models.GetLeadsData{}

	for _, item := range data {
		leadsId, ok := item["leads_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get leads id from leads info Item: %+v\n", item)
			continue
		}

		fName, ok := item["first_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get first_name from leads info Item: %+v\n", item)
			continue
		}

		lName, ok := item["last_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get last_name from leads info Item: %+v\n", item)
			continue
		}

		email, ok := item["email_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get email_id from leads info Item: %+v\n", item)
			continue
		}

		phoneNo, ok := item["phone_number"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get phone_number from leads info Item: %+v\n", item)
			continue
		}

		streetAddr, ok := item["street_address"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get street_address from leads info Item: %+v\n", item)
			streetAddr = ""
		}

		aptScheduledDate, ok := item["appointment_scheduled_date"].(*time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_scheduled_date from leads info Item: %+v\n", item)
			aptScheduledDate = nil
		}

		aptAcceptedDate, ok := item["appointment_accepted_date"].(*time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_accepted_date from leads info Item: %+v\n", item)
			aptAcceptedDate = nil
		}

		leadWonDate, ok := item["lead_won_date"].(*time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get lead_won_date from leads info Item: %+v\n", item)
			leadWonDate = nil
		}

		statusId, ok := item["status_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get won status from leads info Item: %+v\n", item)
			statusId = 0
		}

		isAptRequired, ok := item["is_appointment_required"].(bool)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get is_appointment_required from leads info Item: %+v\n", item)
			isAptRequired = false
		}

		finType, ok := item["finance_type"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get finance_type from leads info Item %+v", item)
			finType = ""
		}

		finCompany, ok := item["finance_company"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get finance_company from leads info Item %+v", item)
			finCompany = ""
		}
		qcAudit, ok := item["qc_audit"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get qc_audit from leads info Item %+v", item)
			qcAudit = ""
		}

		// variable for action needed message
		actionNeededMsg := ""
		if dataReq.LeadStatus == "ACTION_NEEDED" {
			if aptAcceptedDate == nil {
				actionNeededMsg = "No Response"
			} else {
				actionNeededMsg = "Appointment Accepted"
			}
		}

		// appointment label & appointment date
		var (
			aptStatusLabel string
			aptStatusDate  *time.Time
		)
		if !isAptRequired {
			aptStatusLabel = "Not Required"
		}
		if aptScheduledDate != nil {
			aptStatusLabel = "Appointment Sent"
			aptStatusDate = aptScheduledDate
		}

		if aptAcceptedDate != nil {
			aptStatusLabel = "Appointment Accepted"
			aptStatusDate = aptAcceptedDate
		}

		// deal won/loss status
		var (
			wonLostLabel string
			wonLostDate  *time.Time
		)
		if statusId == 5 {
			wonLostLabel = "Won"
			wonLostDate = leadWonDate
		}

		LeadsData := models.GetLeadsData{
			LeadID:                 leadsId,
			FirstName:              fName,
			StatusID:               statusId,
			LastName:               lName,
			EmailID:                email,
			PhoneNumber:            phoneNo,
			StreetAddress:          streetAddr,
			ActionNeededMessage:    actionNeededMsg,
			AppointmentStatusLabel: aptStatusLabel,
			AppointmentStatusDate:  aptStatusDate,
			WonLostLabel:           wonLostLabel,
			WonLostDate:            wonLostDate,
			FinanceType:            finType,
			FinanceCompany:         finCompany,
			QCAudit:                qcAudit,
		}

		LeadsDataList = append(LeadsDataList, LeadsData)

	}

	// Count total records from db
	query = fmt.Sprintf(`SELECT COUNT(*) FROM get_leads_info_hierarchy($1) li %s`, whereClause)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList[0:4])
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead count from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch lead count", http.StatusInternalServerError, nil)
		return
	}
	recordCount = data[0]["count"].(int64)

	appserver.FormAndSendHttpResp(resp, "Leads Data", http.StatusOK, LeadsDataList, recordCount)
}
