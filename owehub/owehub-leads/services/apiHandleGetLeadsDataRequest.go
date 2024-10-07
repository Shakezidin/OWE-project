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

	// Check if leadStatusId is invalid (<= 0 or >= 4)
	if dataReq.LeadStatusId < 0 || dataReq.LeadStatusId > 4 {
		log.FuncErrorTrace(0, "Wrong Lead Status")
		appserver.FormAndSendHttpResp(resp, "Wrong Lead Status", http.StatusInternalServerError, nil)
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

	if userEmail != "" {
		// by default value of lead status is "pending"
		if dataReq.LeadStatusId < 0 || dataReq.LeadStatusId > 4 {
			dataReq.LeadStatusId = 0
		}

		if dataReq.PageNumber > 0 && dataReq.PageSize > 0 {
			offset = (dataReq.PageNumber - 1) * dataReq.PageSize
		}

		if dataReq.LeadStatusId == 4 {
			whereClause = "WHERE ((li.status_id = 5 and proposal_created_date is NULL) or (li.status_id = 2 and appointment_date < CURRENT_TIMESTAMP))"
		} else if dataReq.LeadStatusId == 2 {
			whereClause = "WHERE li.status_id = 2 and li.appointment_date > CURRENT_TIMESTAMP"
		} else {
			whereClause = fmt.Sprintf("WHERE li.status_id = %d", dataReq.LeadStatusId)
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
				li.state,
				li.first_name,
				li.last_name,
				li.email_id,
				li.phone_number,
				li.street_address,
				li.city,
				li.zipcode,
				li.proposal_type,
				li.finance_type,
				li.finance_company,
				li.sale_submission_triggered,
				li.qc_audit,
				li.proposal_signed,
				li.appointment_date,
				li.appointment_disposition_note,
				li.is_archived,
				li.notes,
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
			// log.FuncDebugTrace(0, "leads_id type: %T\n", item["leads_id"])

			leads_id, ok := item["leads_id"].(int64)
			if !ok {
				// log.FuncErrorTrace(0, "leads_id type: %T\n", item["leads_id"])
				log.FuncErrorTrace(0, "Failed to get leads id from leads info Item: %+v\n", item)
				continue
			}

			state, ok := item["state"].(int64)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get state from leads info Item: %+v\n", item)
				state = -1
			}

			first_name, ok := item["first_name"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get first_name from leads info Item: %+v\n", item)
				continue
			}

			last_name, ok := item["last_name"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get last_name from leads info Item: %+v\n", item)
				continue
			}

			email_id, ok := item["email_id"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get email_id from leads info Item: %+v\n", item)
				continue
			}

			phone_number, ok := item["phone_number"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get phone_number from leads info Item: %+v\n", item)
				continue
			}

			street_address, ok := item["street_address"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get street_address from leads info Item: %+v\n", item)
				street_address = ""
			}

			city, ok := item["city"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get city from leads info Item: %+v\n", item)
				city = ""
			}

			zipcode, ok := item["zipcode"].(int64)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get zipcode from leads info Item: %+v\n", item)
				continue
			}

			proposal_type, ok := item["proposal_type"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get proposal_type from leads info Item: %+v\n", item)
				proposal_type = ""
			}

			finance_type, ok := item["finance_type"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get finance_typed from leads info Item: %+v\n", item)
				finance_type = ""
			}

			finance_company, ok := item["finance_company"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get finance_company from leads info Item: %+v\n", item)
				finance_company = ""
			}

			sale_submission_triggered, ok := item["sale_submission_triggered"].(bool)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get sale_submission_triggered from leads info Item: %+v\n", item)
				sale_submission_triggered = false
			}

			qc_audit, ok := item["qc_audit"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get qc_audit from leads info Item: %+v\n", item)
				qc_audit = ""
			}

			proposal_signed, ok := item["proposal_signed"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get proposal_signed from leads info Item: %+v\n", item)
				proposal_signed = ""
			}

			appointment_date, ok := item["appointment_date"].(*time.Time)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get appointment_date from leads info Item: %+v\n", item)
				appointment_date = nil
			}

			appointment_disposition_note, ok := item["appointment_disposition_note"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get appointment_disposition_note from leads info Item: %+v\n", item)
				appointment_disposition_note = ""
			}

			is_archived, ok := item["is_archived"].(bool)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get is_archived from leads info Item: %+v\n", item)
				is_archived = false
			}

			notes, ok := item["notes"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get notes from leads info Item: %+v\n", item)
				notes = ""
			}

			status_id, ok := item["status_id"].(int64)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get won status from leads info Item: %+v\n", item)
				notes = ""
			}

			// variable for action needed message
			action_needed_message := ""

			// cerating action needed message
			if dataReq.LeadStatusId == 4 {
				if status_id == 2 {
					action_needed_message = "Update Status"
				} else if status_id == 5 {
					action_needed_message = "Deal Won"
				} else {
					action_needed_message = "Other"
				}
			}

			LeadsData := models.GetLeadsData{
				LeadID:                     leads_id,
				State:                      state,
				FirstName:                  first_name,
				StatusID:                   status_id,
				LastName:                   last_name,
				EmailID:                    email_id,
				PhoneNumber:                phone_number,
				StreetAddress:              street_address,
				City:                       city,
				Zipcode:                    zipcode,
				ProposalType:               proposal_type,
				FinanceType:                finance_type,
				FinanceCompany:             finance_company,
				SaleSubmissionTriggered:    sale_submission_triggered,
				QCAudit:                    qc_audit,
				ProposalSigned:             proposal_signed,
				AppointmentDate:            appointment_date,
				AppointmentDispositionNote: appointment_disposition_note,
				IsArchived:                 is_archived,
				Notes:                      notes,
				ActionNeededMessage:        action_needed_message,
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

	} else {
		log.FuncErrorTrace(0, "Failed to retrieve user email id in get leads data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to retrieve user email id in get leads data Request body", http.StatusInternalServerError, nil)
		return
	}
}
