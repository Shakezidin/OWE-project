/**************************************************************************
* File			: apiUpdateLeadStatus.go
* DESCRIPTION	: This file contains functions for UpdateLeadStatus handler
* DATE			: 27-Sept-2024
**************************************************************************/

package services

import (
	leadService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	emailClient "OWEApp/shared/email"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateLeadStatusRequest
 * DESCRIPTION:     handler for UpdateLeadStatus request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateLeadStatusRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		whereEleList []interface{}
		dataReq      models.UpdateLeadStatusRequest
		query        string
		data         []map[string]interface{}
		dateTime     time.Time
	)

	log.EnterFn(0, "HandleUpdateLeadStatusRequest")
	defer func() { log.ExitFn(0, "HandleUpdateLeadStatusRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal request: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal request", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmail, ok := req.Context().Value("emailid").(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get emailid from context")
		appserver.FormAndSendHttpResp(resp, "Failed to update lead status", http.StatusInternalServerError, nil)
		return
	}

	// fetch user_id of authenticated user
	query = "SELECT user_id FROM user_details WHERE email_id = $1"
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmail})
	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get user_id from database: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get user_id from database", http.StatusInternalServerError, nil)
		return
	}

	authenticatedUserId, ok := data[0]["user_id"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert user_id to int64 type Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get the user_id from database", http.StatusInternalServerError, nil)
		return
	}

	// fetch lead details along with creator details, also thereby veryfing authenticated user has access to the lead
	query = `
		SELECT
			li.status_id,
			li.first_name,
			li.last_name,
			li.phone_number,
			li.email_id,
			li.appointment_date,
			ud.name as creator_name,
			ud.email_id as creator_email,
			ud.mobile_number as creator_phone
		FROM
			get_leads_info_hierarchy($1) li
		INNER JOIN user_details ud ON ud.user_id = li.created_by	
		WHERE
			leads_id = $2
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmail, dataReq.LeadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead details from database: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get lead details from database", http.StatusInternalServerError, nil)
		return
	}

	if len(data) <= 0 {
		log.FuncErrorTrace(0, "Lead with leads_id %d not found", dataReq.LeadsId)
		appserver.FormAndSendHttpResp(resp, "Lead not found", http.StatusBadRequest, nil, 0)
		return
	}

	phoneNo, ok := data[0]["phone_number"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert phone_number to string type Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get lead details from database", http.StatusInternalServerError, nil)
		return
	}

	creatorName, ok := data[0]["creator_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_name to string type Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get lead details from database", http.StatusInternalServerError, nil)
		return
	}

	creatorEmail, ok := data[0]["creator_email"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_email to string type Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get lead details from database", http.StatusInternalServerError, nil)
		return
	}

	creatorPhone, ok := data[0]["creator_phone"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_phone to string type Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get lead details from database", http.StatusInternalServerError, nil)
		return
	}

	leadEmail, ok := data[0]["email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert email_id to string type Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get lead details from database", http.StatusInternalServerError, nil)
		return
	}

	firstName, ok := data[0]["first_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get first name from database Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get first name from database", http.StatusInternalServerError, nil)
		return
	}
	lastName, ok := data[0]["last_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get first name from database Item: %+v", data[0])
		appserver.FormAndSendHttpResp(resp, "Failed to get last name from database", http.StatusInternalServerError, nil)
		return
	}

	// CASE 1: set lead status to 1 (SENT) --> Send Appointment
	if dataReq.StatusId == 1 {

		leadStatus, ok := data[0]["status_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert status_id to int64 type Item: %+v", data[0])
			appserver.FormAndSendHttpResp(resp, "Failed to get lead details from database", http.StatusInternalServerError, nil)
			return
		}

		isRescheduling := leadStatus != 0

		// validating date time
		dateTime, err = time.Parse(time.RFC3339, dataReq.AppointmentDateTime)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to convert date time :%+v to time.Time err: %+v", dataReq.AppointmentDateTime, err)
			appserver.FormAndSendHttpResp(resp, "Invalid date format, Expected format : 2024-10-14T15:04:05Z", http.StatusInternalServerError, nil)
			return
		}
		leadName := firstName + " " + lastName

		//Function call sentAppointmentEmail
		err = sendAppointmentEvent(dataReq.LeadsId, leadName, leadEmail, &dateTime, isRescheduling)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send the email to the lead %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to send the email to the lead", http.StatusInternalServerError, nil, 0)
			return
		}

		query = `UPDATE leads_info 
					SET appointment_date = $1, 
					appointment_scheduled_date = CURRENT_TIMESTAMP,
					appointment_accepted_date = NULL,
					status_id = 1,
					updated_at = CURRENT_TIMESTAMP,
					last_updated_by = $2 
					WHERE leads_id = $3`
		whereEleList = []interface{}{dateTime, authenticatedUserId, dataReq.LeadsId}
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update the lead details in db : %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update the lead details in db", http.StatusInternalServerError, nil)
			return
		}

		respData := models.UpdateLeadStatusResponse{
			AppointmentDateTime: dataReq.AppointmentDateTime, //same date-time string back in the response
		}

		appserver.FormAndSendHttpResp(resp, "Appointment Sent", http.StatusOK, respData, 0)

		// send sms and email
		smsMessage := leadService.SmsAppointmentSent.WithData(leadService.SmsDataAppointmentSent{
			LeadId:        dataReq.LeadsId,
			LeadFirstName: firstName,
			LeadLastName:  lastName,
			UserName:      creatorName,
		})
		emailTmplData := emailClient.TemplateDataLeadStatusChanged{
			UserName:        creatorName,
			LeadId:          dataReq.LeadsId,
			LeadFirstName:   firstName,
			LeadLastName:    lastName,
			LeadEmailId:     leadEmail,
			LeadPhoneNumber: phoneNo,
			NewStatus:       "APT_SENT",
			ViewUrl:         fmt.Sprintf("%s/leadmng-dashboard?view=%d", leadService.LeadAppCfg.FrontendBaseUrl, dataReq.LeadsId),
		}

		if isRescheduling {
			emailTmplData.NewStatus = "APT_RESCHEDULED"
			smsMessage = leadService.SmsAppointmentRescheduled.WithData(leadService.SmsDataAppointmentRescheduled{
				LeadId:        dataReq.LeadsId,
				LeadFirstName: firstName,
				LeadLastName:  lastName,
				UserName:      creatorName,
			})
		}

		err = sendSms(creatorPhone, smsMessage)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
		}

		err = emailClient.SendEmail(emailClient.SendEmailRequest{
			ToName:       creatorName,
			ToEmail:      creatorEmail,
			Subject:      "Appointment Sent",
			TemplateData: emailTmplData,
		})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
		}

		return
	}

	// CASE 2: set lead status to 5 (WON) --> Update lead status
	if dataReq.StatusId == 5 {

		query = `UPDATE leads_info 
					SET status_id = 5,
					updated_at = CURRENT_TIMESTAMP,
					lead_won_date = CURRENT_TIMESTAMP,
					last_updated_by = $1,
					lead_lost_date = NULL
					WHERE leads_id = $2`

		if dataReq.IsManualWin {
			query = `UPDATE leads_info 
						SET status_id = 5,
						updated_at = CURRENT_TIMESTAMP,
						manual_won_date = CURRENT_TIMESTAMP,
						last_updated_by = $1,
						lead_lost_date = NULL
						WHERE leads_id = $2`
		}

		whereEleList = []interface{}{authenticatedUserId, dataReq.LeadsId}
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update the lead details in db : %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update the lead details in db", http.StatusInternalServerError, nil)
			return
		}
		appserver.FormAndSendHttpResp(resp, "Status Updated", http.StatusOK, nil, 0)

		// send sms and email
		smsMessage := leadService.SmsLeadWon.WithData(leadService.SmsDataLeadWon{
			LeadId:        dataReq.LeadsId,
			LeadFirstName: firstName,
			LeadLastName:  lastName,
			UserName:      creatorName,
		})

		emailTmplData := emailClient.TemplateDataLeadStatusChanged{
			UserName:        creatorName,
			LeadId:          dataReq.LeadsId,
			LeadFirstName:   firstName,
			LeadLastName:    lastName,
			LeadEmailId:     leadEmail,
			LeadPhoneNumber: phoneNo,
			NewStatus:       "DEAL_WON",
			ViewUrl:         fmt.Sprintf("%s/leadmng-dashboard?view=%d", leadService.LeadAppCfg.FrontendBaseUrl, dataReq.LeadsId),
		}

		if dataReq.IsManualWin {
			emailTmplData.NewStatus = "DEAL_WON_MANUAL"
			emailTmplData.ViewUrl = fmt.Sprintf("%s/leadmng-records?view=%d", leadService.LeadAppCfg.FrontendBaseUrl, dataReq.LeadsId)
			smsMessage = leadService.SmsLeadWonManual.WithData(leadService.SmsDataLeadWonManual{
				LeadId:        dataReq.LeadsId,
				LeadFirstName: firstName,
				LeadLastName:  lastName,
				UserName:      creatorName,
			})
		}

		err = sendSms(creatorPhone, smsMessage)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
		}

		err = emailClient.SendEmail(emailClient.SendEmailRequest{
			ToName:       creatorName,
			ToEmail:      creatorEmail,
			Subject:      "Deal Won",
			TemplateData: emailTmplData,
		})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
		}
		return
	}

	// CASE 3: set lead status to 6 (LOST) --> Update lead status with reason
	if dataReq.StatusId == 6 {

		if dataReq.Reason == "" {
			log.FuncErrorTrace(0, "Reason should be provided for lead to be lost")
			appserver.FormAndSendHttpResp(resp, "Reason is required", http.StatusBadRequest, nil)
			return
		}

		query = `UPDATE leads_info 
					SET status_id = 6,
					updated_at = CURRENT_TIMESTAMP,
					lead_lost_date = CURRENT_TIMESTAMP,
					last_updated_by = $1,
					lead_won_date = NULL,
					appointment_disposition_note = $2
					WHERE leads_id = $3`
		whereEleList = []interface{}{authenticatedUserId, dataReq.Reason, dataReq.LeadsId}
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update the lead details in db : %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update the lead details in db", http.StatusInternalServerError, nil)
			return
		}
		appserver.FormAndSendHttpResp(resp, "Status Updated", http.StatusOK, nil, 0)

		// send sms and email
		smsMessage := leadService.SmsLeadLost.WithData(leadService.SmsDataLeadLost{
			LeadId:        dataReq.LeadsId,
			LeadFirstName: firstName,
			LeadLastName:  lastName,
			UserName:      creatorName,
		})

		emailTmplData := emailClient.TemplateDataLeadStatusChanged{
			UserName:        creatorName,
			LeadId:          dataReq.LeadsId,
			LeadFirstName:   firstName,
			LeadLastName:    lastName,
			LeadEmailId:     leadEmail,
			LeadPhoneNumber: phoneNo,
			NewStatus:       "DEAL_LOST",
			ViewUrl:         fmt.Sprintf("%s/leadmng-records?view=%d", leadService.LeadAppCfg.FrontendBaseUrl, dataReq.LeadsId),
		}

		err = sendSms(creatorPhone, smsMessage)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
		}

		err = emailClient.SendEmail(emailClient.SendEmailRequest{
			ToName:       creatorName,
			ToEmail:      creatorEmail,
			Subject:      "Deal Lost",
			TemplateData: emailTmplData,
		})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
		}
		return
	}

	if dataReq.QC == true {
		query = "UPDATE leads_info SET qc_audit = $1 WHERE WHERE leads_id = $2"
		whereEleList = []interface{}{dataReq.QC, dataReq.LeadsId}
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

		if err != nil {
			log.FuncErrorTrace(0, "Failed to update the lead  qc details in db : %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update the lead qc details in db", http.StatusInternalServerError, nil)
			return
		}
		appserver.FormAndSendHttpResp(resp, "Status Updated", http.StatusOK, nil, 0)

		// send sms and email
		smsMessage := leadService.SmsAppointmentNotRequired.WithData(leadService.SmsDataAppointmentNotRequired{
			LeadId:        dataReq.LeadsId,
			LeadFirstName: firstName,
			LeadLastName:  lastName,
			UserName:      creatorName,
		})

		emailTmplData := emailClient.TemplateDataLeadStatusChanged{
			UserName:        creatorName,
			LeadId:          dataReq.LeadsId,
			LeadFirstName:   firstName,
			LeadLastName:    lastName,
			LeadEmailId:     leadEmail,
			LeadPhoneNumber: phoneNo,
			NewStatus:       "Qualified",
			ViewUrl:         fmt.Sprintf("%s/leadmng-records?view=%d", leadService.LeadAppCfg.FrontendBaseUrl, dataReq.LeadsId),
		}

		err = sendSms(creatorPhone, smsMessage)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
		}

		err = emailClient.SendEmail(emailClient.SendEmailRequest{
			ToName:       creatorName,
			ToEmail:      creatorEmail,
			Subject:      "Qualified",
			TemplateData: emailTmplData,
		})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
		}
		return
	}

	// CASE 4: status_id not provided (update is_appointment_required)
	if dataReq.StatusId == 0 {
		query = "UPDATE leads_info SET is_appointment_required = $1, updated_at = CURRENT_TIMESTAMP, last_updated_by = $2 WHERE leads_id = $3"
		whereEleList = []interface{}{dataReq.IsAppointmentRequired, authenticatedUserId, dataReq.LeadsId}
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update the lead details in db : %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update the lead details in db", http.StatusInternalServerError, nil)
			return
		}
		appserver.FormAndSendHttpResp(resp, "Status Updated", http.StatusOK, nil, 0)

		// send sms and email
		smsMessage := leadService.SmsAppointmentNotRequired.WithData(leadService.SmsDataAppointmentNotRequired{
			LeadId:        dataReq.LeadsId,
			LeadFirstName: firstName,
			LeadLastName:  lastName,
			UserName:      creatorName,
		})

		emailTmplData := emailClient.TemplateDataLeadStatusChanged{
			UserName:        creatorName,
			LeadId:          dataReq.LeadsId,
			LeadFirstName:   firstName,
			LeadLastName:    lastName,
			LeadEmailId:     leadEmail,
			LeadPhoneNumber: phoneNo,
			NewStatus:       "APT_NOT_REQUIRED",
			ViewUrl:         fmt.Sprintf("%s/leadmng-dashboard?view=%d", leadService.LeadAppCfg.FrontendBaseUrl, dataReq.LeadsId),
		}

		err = sendSms(creatorPhone, smsMessage)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
		}

		err = emailClient.SendEmail(emailClient.SendEmailRequest{
			ToName:       creatorName,
			ToEmail:      creatorEmail,
			Subject:      "Appointment Not Required",
			TemplateData: emailTmplData,
		})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
		}
		return
	}

	log.FuncErrorTrace(0, "Invalid update lead action, can't update lead status to %d", dataReq.StatusId)
	appserver.FormAndSendHttpResp(resp, "Invalid update lead action", http.StatusBadRequest, nil)
}
