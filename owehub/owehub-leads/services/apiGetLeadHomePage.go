/**************************************************************************
* File                  : apiGetLeadHomePage.go
* DESCRIPTION           : This file contains functions to get leads information and get leads count status
							information

* DATE                  : 30-october-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
	"time"
)

/******************************************************************************
* FUNCTION:		    HandleGetLeadsDataRequest
* DESCRIPTION:      handler for get leads data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetLeadHomePage(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		startTime        time.Time
		endTime          time.Time
		dataReq          models.GetLeadsHomePageRequest
		apiResponse      models.GetLeadsHomePageResponse
		data             []map[string]interface{}
		query            string
		whereEleList     []interface{}
		whereClause      string
		paginationClause string
		recordCount      int64
		proposalPdfLink  string
	)

	log.EnterFn(0, "HandleGetLeadHomePage")

	defer func() { log.ExitFn(0, "HandleGetLeadHomePage", err) }()

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

	// default condition: not in lost or won
	whereClause = "WHERE (li.lead_lost_date IS NULL AND NOT li.qc_audit)"

	// build whereclause based on requested status
	if dataReq.LeadStatus == "NEW" {
		whereClause += `
			AND (
				li.appointment_date IS NULL
				AND li.appointment_declined_date IS NULL
				AND li.appointment_scheduled_date IS NULL
				AND li.lead_won_date IS NULL
				AND li.is_appointment_required = TRUE 
				AND li.proposal_created_date IS NULL
			)
		`
	}

	if dataReq.LeadStatus == "PROGRESS" {
		if dataReq.ProgressFilter == "DEAL_WON" {
			whereClause += `
				AND (
					(
						li.lead_won_date IS NOT NULL
						AND li.appointment_declined_date IS NULL
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP
							AND li.is_appointment_required = TRUE
							AND (
								li.appointment_accepted_date IS NULL
								OR li.appointment_accepted_date > li.appointment_date
							)
						)
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.lead_won_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP 
							AND li.is_appointment_required = TRUE
						)
					)
				)
				
			`
		}
		if dataReq.ProgressFilter == "APPOINTMENT_SENT" {
			whereClause += `
				AND (
					li.appointment_date > CURRENT_TIMESTAMP
					AND li.is_appointment_required = TRUE
					AND li.appointment_declined_date IS NULL
					AND li.appointment_accepted_date IS NULL
				)
			`
		}
		if dataReq.ProgressFilter == "APPOINTMENT_ACCEPTED" {
			whereClause += `
				AND (
					li.is_appointment_required = TRUE
					AND li.appointment_declined_date IS NULL
					AND li.appointment_accepted_date IS NOT NULL
					AND (
						(li.lead_won_date IS NULL AND li.appointment_date > CURRENT_TIMESTAMP)
						OR
						(li.lead_won_date IS NOT NULL AND li.appointment_accepted_date < li.appointment_date)
					)
				)
			`
		}
		if dataReq.ProgressFilter == "APPOINTMENT_NOT_REQUIRED" {
			whereClause += "AND li.is_appointment_required = FALSE"
		}
		if dataReq.ProgressFilter == "PROPOSAL_IN_PROGRESS" {
			whereClause += `
				AND (
					li.proposal_created_date IS NOT NULL
					AND li.appointment_declined_date IS NULL
					AND NOT (
						li.appointment_date IS NOT NULL
						AND li.appointment_declined_date IS NULL
						AND li.appointment_date < CURRENT_TIMESTAMP
						AND li.is_appointment_required = TRUE
						AND (
							li.appointment_accepted_date IS NULL
							OR li.appointment_accepted_date > li.appointment_date
						)
					)
					AND NOT (
						li.appointment_date IS NOT NULL
						AND li.appointment_declined_date IS NULL
						AND li.lead_won_date IS NULL
						AND li.appointment_date < CURRENT_TIMESTAMP 
						AND li.is_appointment_required = TRUE
					)
				)
			`
		}
		if dataReq.ProgressFilter == "" || dataReq.ProgressFilter == "ALL" {
			whereClause += `
				AND (
					(
						li.lead_won_date IS NOT NULL
						AND li.appointment_declined_date IS NULL
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP
							AND li.is_appointment_required = TRUE
							AND (
								li.appointment_accepted_date IS NULL
								OR li.appointment_accepted_date > li.appointment_date
							)
						)
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.lead_won_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP 
							AND li.is_appointment_required = TRUE
						)
					)
					OR (
						li.appointment_date > CURRENT_TIMESTAMP
						AND li.is_appointment_required = TRUE
						AND li.appointment_declined_date IS NULL
						AND li.appointment_accepted_date IS NULL
					)
					OR (
						li.is_appointment_required = TRUE
						AND li.appointment_declined_date IS NULL
						AND li.appointment_accepted_date IS NOT NULL
						AND (
							(li.lead_won_date IS NULL AND li.appointment_date > CURRENT_TIMESTAMP)
							OR
							(li.lead_won_date IS NOT NULL AND li.appointment_accepted_date < li.appointment_date)
						)
					)
					OR (
						li.is_appointment_required = FALSE
					)
					OR (
						li.proposal_created_date IS NOT NULL
						AND li.appointment_declined_date IS NULL
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP
							AND li.is_appointment_required = TRUE
							AND (
								li.appointment_accepted_date IS NULL
								OR li.appointment_accepted_date > li.appointment_date
							)
						)
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.lead_won_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP 
							AND li.is_appointment_required = TRUE
						)
					)
				)
			`
		}
	}

	if dataReq.LeadStatus == "DECLINED" {
		whereClause += "AND (li.appointment_declined_date IS NOT NULL AND li.is_appointment_required = TRUE)"
	}

	if dataReq.LeadStatus == "ACTION_NEEDED" {
		whereClause += `
			AND (
				(
					li.appointment_date IS NOT NULL
					AND li.appointment_declined_date IS NULL
					AND li.lead_won_date IS NULL
					AND li.appointment_date < CURRENT_TIMESTAMP 
					AND li.is_appointment_required = TRUE
				)
				OR (
					li.appointment_date IS NOT NULL
					AND li.appointment_declined_date IS NULL
					AND li.appointment_date < CURRENT_TIMESTAMP
					AND li.is_appointment_required = TRUE
					AND (
						li.appointment_accepted_date IS NULL
						OR li.appointment_accepted_date > li.appointment_date
					)
				)
			)
		`
	}

	if dataReq.Search != "" {
		whereEleList = append(whereEleList, fmt.Sprintf("%s%%", dataReq.Search))
		whereClause = fmt.Sprintf(
			"%s AND (li.first_name ILIKE $%d OR li.last_name ILIKE $%d OR (li.first_name || ' ' || li.last_name) ILIKE $%d)",
			whereClause,
			len(whereEleList),
			len(whereEleList),
			len(whereEleList),
		)

		// Check if the search input is purely numeric
		if _, err := strconv.Atoi(dataReq.Search); err == nil {
			// If it's numeric, modify the whereClause to search for leads_id equal to that number
			whereClause = fmt.Sprintf(
				"%s OR li.leads_id::text ILIKE $%d)",
				whereClause[0:len(whereClause)-1],
				len(whereEleList),
			)
		}

		// if search starts with owe, search by id as well
		if strings.HasPrefix(strings.ToLower(dataReq.Search), "owe") {
			searchIdStr := dataReq.Search[3:]
			if _, atoiErr := strconv.Atoi(searchIdStr); atoiErr == nil || searchIdStr == "" {
				whereEleList = append(whereEleList, fmt.Sprintf("%s%%", searchIdStr))
				whereClause = fmt.Sprintf("%s OR li.leads_id::text ILIKE $%d)", whereClause[0:len(whereClause)-1], len(whereEleList))
			}
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
				li.appointment_date,
				li.appointment_scheduled_date,
				li.appointment_accepted_date,
				li.appointment_declined_date,
				li.lead_won_date,
				li.docusign_envelope_completed_at,
				li.docusign_envelope_declined_at,
				li.docusign_envelope_voided_at,
				li.docusign_envelope_sent_at,
				li.is_archived,
				li.aurora_proposal_id,
				li.is_appointment_required,
				li.aurora_proposal_status,
				li.aurora_proposal_link,
				li.aurora_proposal_updated_at,
				li.proposal_pdf_key,
				li.status_id,
				li.zipcode,
				li.lead_source,
				li.manual_won_date,
				ud.name as salerep_name
				
			FROM get_leads_info_hierarchy($1) li
			LEFT JOIN user_details ud ON ud.user_id = li.salerep_id
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

	for _, item := range data {
		// appointment label & appointment date
		var (
			aptStatusLabel                   string
			wonLostLabel                     string
			docusignLabel                    string
			aptStatusDate                    *time.Time
			docusignDate                     *time.Time
			wonLostDate                      *time.Time
			scheduledDatePtr                 *time.Time
			acceptedDatePtr                  *time.Time
			leadWonDatePtr                   *time.Time
			declinedDatePtr                  *time.Time
			manualWonDatePtr                 *time.Time
			proposalUpdatedAtPtr             *time.Time
			appointmentDatePtr               *time.Time
			docusignEnvelopeCompletedDatePtr *time.Time
			docusignEnvelopeDeclinedDatePtr  *time.Time
			docusignEnvelopeVoidedDatePtr    *time.Time
			docusignEnvelopeSentDatePtr      *time.Time
			canManuallyWin                   bool
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
		qcAudit, ok := item["qc_audit"].(bool)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get qc_audit from leads info Item %+v", item)
			qcAudit = false
		}

		proposalId, ok := item["aurora_proposal_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get aurora_proposal_id from leads info Item %+v", item)
			proposalId = ""
		}

		proposalStatus, ok := item["aurora_proposal_status"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get aurora_proposal_status from leads info Item %+v", item)
			proposalStatus = ""
		}

		proposalLink, ok := item["aurora_proposal_link"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get aurora_proposal_link from leads info Item %+v", item)
			proposalLink = ""
		}

		salesRepName, ok := item["salerep_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sales rep name from leads info Item: %+v\n", item)
		}
		leadSource, ok := item["lead_source"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get lead source from leads info Item: %+v\n", item)
		}

		proposalPdfKey, ok := item["proposal_pdf_key"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get proposal pdf key from leads info Item: %+v\n", item)
		} else {
			proposalPdfLink = leadsService.S3GetObjectUrl(proposalPdfKey)
		}

		zipcode, ok := item["zipcode"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get zipcode from leads info Item: %+v\n", item)
			continue
		}

		scheduledDate, ok := item["appointment_scheduled_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_scheduled_date from leads info Item: %+v\n", item)
		} else {
			scheduledDatePtr = &scheduledDate
		}

		appointmentDate, ok := item["appointment_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_date from leads info Item: %+v\n", item)
		} else {
			appointmentDatePtr = &appointmentDate
		}

		acceptedDate, ok := item["appointment_accepted_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_accepted_date from leads info Item: %+v\n", item)
		} else {
			acceptedDatePtr = &acceptedDate
		}

		leadWonDate, ok := item["lead_won_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get lead_won_date from leads info Item: %+v\n", item)
		} else {
			leadWonDatePtr = &leadWonDate
		}

		manualWonDate, ok := item["manual_won_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get manual_won_date from leads info Item: %+v\n", item)
		} else {
			manualWonDatePtr = &manualWonDate
		}

		declinedDate, ok := item["appointment_declined_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get appointment_declined_date from leads info Item: %+v\n", item)
		} else {
			declinedDatePtr = &declinedDate
		}

		proposalUpdatedAt, ok := item["aurora_proposal_updated_at"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get aurora_proposal_updated_at from leads info Item: %+v\n", item)
		} else {
			proposalUpdatedAtPtr = &proposalUpdatedAt
		}

		docusignEnvelopeSentDate, ok := item["docusign_envelope_sent_at"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get docusign_envelope_sent_at from leads info Item: %+v\n", item)
		} else {
			docusignEnvelopeSentDatePtr = &docusignEnvelopeSentDate
		}

		docusignEnvelopeVoidedDate, ok := item["docusign_envelope_voided_at"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get docusign_envelope_voided_at from leads info Item: %+v\n", item)
		} else {
			docusignEnvelopeVoidedDatePtr = &docusignEnvelopeVoidedDate
		}

		docusignEnvelopeCompletedDate, ok := item["docusign_envelope_completed_at"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get docusign_envelope_completed_at from leads info Item: %+v\n", item)
		} else {
			docusignEnvelopeCompletedDatePtr = &docusignEnvelopeCompletedDate
		}

		docusignEnvelopeDeclinedDate, ok := item["docusign_envelope_declined_at"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get docusign_envelope_declined_at from leads info Item: %+v\n", item)
		} else {
			docusignEnvelopeDeclinedDatePtr = &docusignEnvelopeDeclinedDate
		}

		//
		// APT STATUS LABEL & DATE
		//
		if scheduledDatePtr != nil {
			aptStatusLabel = "Appointment Sent"
			aptStatusDate = scheduledDatePtr
		}

		if acceptedDatePtr != nil {
			aptStatusLabel = "Appointment Accepted"
			aptStatusDate = acceptedDatePtr
		}

		if leadWonDatePtr != nil {
			wonLostLabel = "Deal Won"
			wonLostDate = leadWonDatePtr
		}

		if dataReq.LeadStatus == "ACTION_NEEDED" {
			aptStatusDate = nil
			if acceptedDatePtr == nil || appointmentDatePtr.Before(*acceptedDatePtr) {
				aptStatusLabel = "No Response"
			} else {
				aptStatusLabel = "Appointment Date Passed"
			}
		}

		if declinedDatePtr != nil {
			aptStatusLabel = "Appointment Declined"
			aptStatusDate = declinedDatePtr
		}

		if !isAptRequired {
			aptStatusLabel = "Not Required"
			aptStatusDate = nil
		}

		//
		// DOCUSIGN LABEL & DATE
		//
		if docusignEnvelopeSentDatePtr != nil {
			docusignLabel = "Sent"
			docusignDate = docusignEnvelopeSentDatePtr
		}
		if docusignEnvelopeVoidedDatePtr != nil {
			docusignLabel = "Voided"
			docusignDate = docusignEnvelopeVoidedDatePtr
		}
		if docusignEnvelopeDeclinedDatePtr != nil {
			docusignLabel = "Declined"
			docusignDate = docusignEnvelopeDeclinedDatePtr
		}
		if docusignEnvelopeCompletedDatePtr != nil {
			docusignLabel = "Completed"
			docusignDate = docusignEnvelopeCompletedDatePtr
		}

		// can manually win if docusign_envelope_completed_at is null and deal_won_date is before 48 hours
		if leadWonDatePtr != nil && manualWonDatePtr == nil && docusignEnvelopeCompletedDatePtr == nil &&
			time.Since(*leadWonDatePtr).Hours() > 48 {
			canManuallyWin = true
		}

		apiResponse.LeadsData = append(apiResponse.LeadsData, models.GetLeadsData{
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
			ProposalStatus:         proposalStatus,
			ProposalLink:           proposalLink,
			ProposalUpdatedAt:      proposalUpdatedAtPtr,
			ProposalPdfLink:        proposalPdfLink,
			DocusignLabel:          docusignLabel,
			DocusignDate:           docusignDate,
			Zipcode:                zipcode,
			CanManuallyWin:         canManuallyWin,
			SalesRepName:           salesRepName,
			LeadSource:             leadSource,
		})

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

	// code for get leads count by statu
	whereEleList = []interface{}{userEmail}

	query = `
		SELECT 'NEW' AS status_name, COUNT(*) AS count FROM get_leads_info_hierarchy($1) li
		WHERE (li.lead_lost_date IS NULL AND NOT li.qc_audit)
			AND (
				li.appointment_date IS NULL
				AND li.appointment_declined_date IS NULL
				AND li.appointment_scheduled_date IS NULL
				AND li.lead_won_date IS NULL
				AND li.is_appointment_required = TRUE 
				AND li.proposal_created_date IS NULL
			)
			AND li.updated_at BETWEEN $2 AND $3
		  	AND li.is_archived = FALSE

		UNION ALL

		SELECT 'PROGRESS' AS status_name, COUNT(*) AS count FROM get_leads_info_hierarchy($1) li
			WHERE (li.lead_lost_date IS NULL AND NOT li.qc_audit)
			AND (
					(
						li.lead_won_date IS NOT NULL
						AND li.appointment_declined_date IS NULL
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP
							AND li.is_appointment_required = TRUE
							AND (
								li.appointment_accepted_date IS NULL
								OR li.appointment_accepted_date > li.appointment_date
							)
						)
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.lead_won_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP 
							AND li.is_appointment_required = TRUE
						)
					)
					OR (
						li.appointment_date > CURRENT_TIMESTAMP
						AND li.is_appointment_required = TRUE
						AND li.appointment_declined_date IS NULL
						AND li.appointment_accepted_date IS NULL
					)
					OR (
						li.is_appointment_required = TRUE
						AND li.appointment_declined_date IS NULL
						AND li.appointment_accepted_date IS NOT NULL
						AND (
							(li.lead_won_date IS NULL AND li.appointment_date > CURRENT_TIMESTAMP)
							OR
							(li.lead_won_date IS NOT NULL AND li.appointment_accepted_date < li.appointment_date)
						)
					)
					OR (
						li.is_appointment_required = FALSE
					)
					OR (
						li.proposal_created_date IS NOT NULL
						AND li.appointment_declined_date IS NULL
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP
							AND li.is_appointment_required = TRUE
							AND (
								li.appointment_accepted_date IS NULL
								OR li.appointment_accepted_date > li.appointment_date
							)
						)
						AND NOT (
							li.appointment_date IS NOT NULL
							AND li.appointment_declined_date IS NULL
							AND li.lead_won_date IS NULL
							AND li.appointment_date < CURRENT_TIMESTAMP 
							AND li.is_appointment_required = TRUE
						)
					)
				)
				AND li.updated_at BETWEEN $2 AND $3  -- Start and end date range
				AND li.is_archived = FALSE

		UNION ALL

		SELECT 'DECLINED' AS status_name, COUNT(*) AS count FROM get_leads_info_hierarchy($1) li
		WHERE (li.lead_lost_date IS NULL AND NOT li.qc_audit)
			AND (li.appointment_declined_date IS NOT NULL AND li.is_appointment_required = TRUE)
			AND li.updated_at BETWEEN $2 AND $3  -- Start and end date range
			AND li.is_archived = FALSE

		UNION ALL

		SELECT 'ACTION_NEEDED' AS status_name, COUNT(*) AS count FROM get_leads_info_hierarchy($1) li
		WHERE (li.lead_lost_date IS NULL AND NOT li.qc_audit)
			AND (
				(
					li.appointment_date IS NOT NULL
					AND li.appointment_declined_date IS NULL
					AND li.lead_won_date IS NULL
					AND li.appointment_date < CURRENT_TIMESTAMP 
					AND li.is_appointment_required = TRUE
				)
				OR (
					li.appointment_date IS NOT NULL
					AND li.appointment_declined_date IS NULL
					AND li.appointment_date < CURRENT_TIMESTAMP
					AND li.is_appointment_required = TRUE
					AND (
						li.appointment_accepted_date IS NULL
						OR li.appointment_accepted_date > li.appointment_date
					)
				)
			)
			AND li.is_archived = FALSE
			AND li.updated_at BETWEEN $2 AND $3  -- Start and end date range
    `

	if dataReq.StartDate != "" && dataReq.EndDate != "" {
		whereEleList = append(whereEleList,
			time.Date(startTime.Year(), startTime.Month(), startTime.Day(), 0, 0, 0, 0, time.UTC),
			time.Date(endTime.Year(), endTime.Month(), endTime.Day(), 23, 59, 59, 0, time.UTC),
		)
	} else {
		whereEleList = append(whereEleList, time.Time{}, time.Now())
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get leads count by status with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get leads count by status", http.StatusInternalServerError, nil)
		return
	}

	for _, item := range data {
		count, ok := item["count"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert count to int64 type Item: %+v", item)
			continue
		}
		statusName, ok := item["status_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert status_name to string type Item: %+v", item)
			continue
		}

		apiResponse.StatusCounts = append(apiResponse.StatusCounts, models.GetLeadsCountByStatus{
			Count:      count,
			StatusName: statusName,
		})
	}

	appserver.FormAndSendHttpResp(resp, "Leads Data", http.StatusOK, apiResponse, recordCount)

}
