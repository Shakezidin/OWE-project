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
	"strconv"
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
		err              error
		startTime        time.Time
		endTime          time.Time
		dataReq          models.GetLeadsRequest
		data             []map[string]interface{}
		query            string
		whereEleList     []interface{}
		whereClause      string
		paginationClause string
		recordCount      int64
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

	userEmail := req.Context().Value("emailid").(string)

	whereEleList = append(whereEleList, userEmail)

	// no condition specified, default to all
	if dataReq.LeadStatus == "" {
		whereClause = "WHERE li.leads_id IS NOT NULL"
	}

	// build whereclause based on requested status
	if dataReq.LeadStatus == "NEW" {
		whereClause = "WHERE (li.status_id = 0 AND li.is_appointment_required = TRUE)"
	}

	if dataReq.LeadStatus == "PROGRESS" {
		if dataReq.ProgressFilter == "DEAL_WON" {
			whereClause = "WHERE (li.status_id = 5 AND li.proposal_created_date IS NULL)"
		}
		if dataReq.ProgressFilter == "APPOINTMENT_SENT" {
			whereClause = "WHERE (li.status_id = 1 AND li.appointment_date > CURRENT_TIMESTAMP)"
		}
		if dataReq.ProgressFilter == "APPOINTMENT_ACCEPTED" {
			whereClause = "WHERE (li.status_id = 2 AND li.appointment_date > CURRENT_TIMESTAMP)"
		}
		if dataReq.ProgressFilter == "APPOINTMENT_NOT_REQUIRED" {
			whereClause = "WHERE (li.status_id != 6 AND li.is_appointment_required = FALSE AND LOWER(li.aurora_proposal_status) IS DISTINCT FROM 'completed')"
		}
		if dataReq.ProgressFilter == "PROPOSAL_IN_PROGRESS" {
			whereClause = "WHERE (li.status_id = 5 AND li.proposal_created_date IS NOT NULL AND LOWER(li.aurora_proposal_status) IS DISTINCT FROM 'completed')"
		}
		if dataReq.ProgressFilter == "" || dataReq.ProgressFilter == "ALL" {
			whereClause = `
				WHERE (
					(li.status_id IN (1, 2) AND li.appointment_date > CURRENT_TIMESTAMP)
					OR (li.status_id = 5 AND LOWER(li.aurora_proposal_status) != 'completed')
					OR (li.status_id != 6 AND li.is_appointment_required = FALSE AND LOWER(li.aurora_proposal_status) IS DISTINCT FROM 'completed')
				)
			`
		}
	}

	if dataReq.LeadStatus == "DECLINED" {
		whereClause = "WHERE (li.status_id = 3 AND li.is_appointment_required = TRUE)"
	}

	if dataReq.LeadStatus == "ACTION_NEEDED" {
		whereClause = `
			WHERE (
				li.status_id = 4
				OR (
					li.status_id IN (1, 2) 
					AND li.appointment_date < CURRENT_TIMESTAMP 
					AND li.is_appointment_required = TRUE
				)
			)
		`
	}

	if whereClause == "" {
		appserver.FormAndSendHttpResp(resp, "Invalid Lead Status", http.StatusBadRequest, nil)
		return
	}

	if dataReq.Search != "" {
		whereEleList = append(whereEleList, fmt.Sprintf("%s%%", dataReq.Search))
		whereClause = fmt.Sprintf(
			"%s AND (li.first_name ILIKE $%d OR li.last_name ILIKE $%d)",
			whereClause,
			len(whereEleList),
			len(whereEleList),
		)

		// if search query convertible to int, search by id as well
		searchId, searchIdErr := strconv.Atoi(dataReq.Search)
		if searchIdErr == nil {
			whereClause = fmt.Sprintf("%s OR li.leads_id = %d)", whereClause[0:len(whereClause)-1], searchId)
		}
	}

	if dataReq.StartDate != "" && dataReq.EndDate != "" {
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

		whereClause = fmt.Sprintf("%s AND li.updated_at BETWEEN $%d AND $%d", whereClause, len(whereEleList)+1, len(whereEleList)+2)
		whereEleList = append(whereEleList,
			time.Date(startTime.Year(), startTime.Month(), startTime.Day(), 0, 0, 0, 0, time.UTC),
			time.Date(endTime.Year(), endTime.Month(), endTime.Day(), 23, 59, 59, 0, time.UTC),
		)
	}

	// filter in all conditions: is_archived, start_time, end_time
	whereEleList = append(whereEleList, dataReq.IsArchived)
	whereClause = fmt.Sprintf("%s AND li.is_archived = $%d", whereClause, len(whereEleList))

	if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
		offset := (dataReq.PageNumber - 1) * dataReq.PageSize
		paginationClause = fmt.Sprintf("LIMIT %d OFFSET %d", dataReq.PageSize, offset)
	}

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
				li.appointment_declined_date,
				li.lead_won_date,
				li.is_archived,
				li.aurora_proposal_id,
				li.is_appointment_required,
				li.status_id
				
			FROM get_leads_info_hierarchy($1) li
			%s
			ORDER BY li.updated_at DESC
			%s;
		`, whereClause, paginationClause)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
		return
	}

	// Create datalist
	LeadsDataList := []models.GetLeadsData{}

	for _, item := range data {
		// appointment label & appointment date
		var (
			aptStatusLabel   string
			aptStatusDate    *time.Time
			wonLostLabel     string
			wonLostDate      *time.Time
			scheduledDatePtr *time.Time
			acceptedDatePtr  *time.Time
			leadWonDatePtr   *time.Time
			declinedDatePtr  *time.Time
		)

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

		proposalId, ok := item["aurora_proposal_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get aurora_proposal_id from leads info Item %+v", item)
			proposalId = ""
		}

		scheduledDate, ok := item["appointment_scheduled_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_scheduled_date from leads info Item: %+v\n", item)
			scheduledDatePtr = nil
		} else {
			scheduledDatePtr = &scheduledDate
		}

		acceptedDate, ok := item["appointment_accepted_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_accepted_date from leads info Item: %+v\n", item)
			acceptedDatePtr = nil
		} else {
			acceptedDatePtr = &acceptedDate
		}

		leadWonDate, ok := item["lead_won_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get lead_won_date from leads info Item: %+v\n", item)
			leadWonDatePtr = nil
		} else {
			leadWonDatePtr = &leadWonDate
		}

		declinedDate, ok := item["appointment_declined_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_declined_date from leads info Item: %+v\n", item)
			declinedDatePtr = nil
		} else {
			declinedDatePtr = &declinedDate
		}

		if !isAptRequired {
			aptStatusLabel = "Not Required"
		}
		if scheduledDatePtr != nil {
			aptStatusLabel = "Appointment Sent"
			aptStatusDate = scheduledDatePtr
		}

		if acceptedDatePtr != nil {
			aptStatusLabel = "Appointment Accepted"
			aptStatusDate = acceptedDatePtr
		}

		if statusId == 5 {
			wonLostLabel = "Deal Won"
			wonLostDate = leadWonDatePtr
		}

		if dataReq.LeadStatus == "ACTION_NEEDED" {
			aptStatusDate = nil
			if acceptedDatePtr == nil {
				aptStatusLabel = "No Response"
			} else {
				aptStatusLabel = "Appointment Accepted"
			}
		}

		if statusId == 3 {
			aptStatusLabel = "Appointment Declined"
			aptStatusDate = declinedDatePtr
		}

		LeadsData := models.GetLeadsData{
			LeadID:                 leadsId,
			FirstName:              fName,
			StatusID:               statusId,
			LastName:               lName,
			EmailID:                email,
			PhoneNumber:            phoneNo,
			StreetAddress:          streetAddr,
			AppointmentStatusLabel: aptStatusLabel,
			AppointmentStatusDate:  aptStatusDate,
			WonLostLabel:           wonLostLabel,
			WonLostDate:            wonLostDate,
			FinanceType:            finType,
			FinanceCompany:         finCompany,
			QCAudit:                qcAudit,
			ProposalID:             proposalId,
		}

		LeadsDataList = append(LeadsDataList, LeadsData)

	}

	// Count total records from db
	query = fmt.Sprintf(`SELECT COUNT(*) FROM get_leads_info_hierarchy($1) li %s`, whereClause)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead count from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch lead count", http.StatusInternalServerError, nil)
		return
	}
	recordCount = data[0]["count"].(int64)

	appserver.FormAndSendHttpResp(resp, "Leads Data", http.StatusOK, LeadsDataList, recordCount)
}
