/**************************************************************************
 * File       	   : apiGetLeadsHistory.go // 🔴🔴
 * DESCRIPTION     : This file contains functions for get LeadsHistory data handler
 * DATE            : 21-Sept-2024
 **************************************************************************/

package services

import (
	//"OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

	// "OWEApp/shared/types"
	// "sort"
	// "strings"
	//"time"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetLeadInfo// 🔴🔴
 * DESCRIPTION:     handler for get LeadsHistoy data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLeadInfo(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		whereEleList []interface{}
		dataReq      models.GetLeadInfoRequest
		data         []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetLeadInfo")
	defer func() { log.ExitFn(0, "HandleGetLeadInfo", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Leads data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Leads data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Leads info request body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get Leads info request body", http.StatusBadRequest, nil)
		return
	}

	authenticatedUserEmail := req.Context().Value("emailid").(string)
	// Construct the query to fetch lead data by lead_id
	query := `
				SELECT
					li.leads_id,
					li.first_name,
					li.last_name,
					li.email_id,
					li.phone_number,
					li.street_address,
					li.city,
					li.finance_type,
					li.finance_company,
					li.sale_submission_triggered,
					li.qc_audit,
					li.proposal_signed,
					li.appointment_disposition,
					li.appointment_disposition_note,
					li.notes,
					li.created_at,
					li.updated_at,
					li.appointment_scheduled_date,
					li.appointment_accepted_date,
					li.appointment_declined_date,
					li.lead_won_date,
					li.appointment_date,
					li.lead_lost_date,
					li.proposal_created_date,
					li.status_id,
					ud.name as created_by_name
				FROM
					get_leads_info_hierarchy($1) li
				INNER JOIN user_details ud ON ud.user_id = li.created_by
				WHERE li.leads_id = $2
			`

	whereEleList = append(whereEleList, authenticatedUserEmail, dataReq.LeadsID)

	// Execute the query
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead info from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch lead info", http.StatusInternalServerError, nil)
		return
	}

	if len(data) == 0 {
		log.FuncErrorTrace(0, "No lead info found for given lead id")
		appserver.FormAndSendHttpResp(resp, "No lead info found", http.StatusNotFound, nil)
		return
	}
	// Access the first result (assuming one lead will be returned for the given ID)
	leadData := data[0]

	apiResponse := models.GetLeadInfoRes{}

	streetAddress, ok := leadData["street_address"].(string)
	if ok {
		apiResponse.StreetAddress = streetAddress
	}

	city, ok := leadData["city"].(string)
	if ok {
		apiResponse.City = city
	}

	financeType, ok := leadData["finance_type"].(string)
	if ok {
		apiResponse.FinanceType = financeType
	}

	financeCompany, ok := leadData["finance_company"].(string)
	if ok {
		apiResponse.FinanceCompany = financeCompany
	}

	saleSubmissionTriggered, ok := leadData["sale_submission_triggered"].(bool)
	if ok {
		apiResponse.SaleSubmissionTriggered = saleSubmissionTriggered
	}

	qcAudit, ok := leadData["qc_audit"].(string)
	if ok {
		apiResponse.QCAudit = qcAudit
	}

	proposalSigned, ok := leadData["proposal_signed"].(bool)
	if ok {
		apiResponse.ProposalSigned = proposalSigned
	}

	appointmentDisposition, ok := leadData["appointment_disposition"].(string)
	if ok {
		apiResponse.AppointmentDisposition = appointmentDisposition
	}

	appointmentDispositionNote, ok := leadData["appointment_disposition_note"].(string)
	if ok {
		apiResponse.AppointmentDispositionNote = appointmentDispositionNote
	}

	notes, ok := leadData["notes"].(string)
	if ok {
		apiResponse.Notes = notes
	}

	createdAt, ok := leadData["created_at"].(time.Time)
	if ok {
		apiResponse.CreatedAt = &createdAt
	}

	updatedAt, ok := leadData["updated_at"].(time.Time)
	if ok {
		apiResponse.UpdatedAt = &updatedAt
	}

	appointmentScheduledDate, ok := leadData["appointment_scheduled_date"].(time.Time)
	if ok {
		apiResponse.AppointmentScheduledDate = &appointmentScheduledDate
	}

	appointmentAcceptedDate, ok := leadData["appointment_accepted_date"].(time.Time)
	if ok {
		apiResponse.AppointmentAcceptedDate = &appointmentAcceptedDate
	}
	appointmentDeclinedDate, ok := leadData["appointment_declined_date"].(time.Time)
	if ok {
		apiResponse.AppointmentDeclinedDate = &appointmentDeclinedDate
	}
	leadWonDate, ok := leadData["lead_won_date"].(time.Time)
	if ok {
		apiResponse.LeadWonDate = &leadWonDate
	}

	appointmentDate, ok := leadData["appointment_date"].(time.Time)
	if ok {
		apiResponse.AppointmentDate = &appointmentDate
	}

	leadLostDate, ok := leadData["lead_lost_date"].(time.Time)
	if ok {
		apiResponse.LeadLostDate = &leadLostDate
	}

	proposalCreatedDate, ok := leadData["proposal_created_date"].(time.Time)
	if ok {
		apiResponse.ProposalCreatedDate = &proposalCreatedDate
	}

	statusId, ok := leadData["status_id"].(int64)
	if ok {
		apiResponse.StatusID = statusId
	}

	apiResponse.LeadsID = leadData["leads_id"].(int64) // LeadsID is asserted as int64
	apiResponse.FirstName = leadData["first_name"].(string)
	apiResponse.LastName = leadData["last_name"].(string)
	apiResponse.EmailId = leadData["email_id"].(string)
	apiResponse.PhoneNumber = leadData["phone_number"].(string)
	apiResponse.CreatedByName = leadData["created_by_name"].(string)

	// Send the response
	appserver.FormAndSendHttpResp(resp, "Lead Info Data", http.StatusOK, apiResponse, 1)
}
