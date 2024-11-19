package services

import (
	"OWEApp/shared/db"
	emailClient "OWEApp/shared/email"
	graphapi "OWEApp/shared/graphApi"
	log "OWEApp/shared/logger"
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"

	"time"

	"OWEApp/owehub-leads/auroraclient"
	leadsService "OWEApp/owehub-leads/common"
	models "OWEApp/shared/models"
)

// Send appointment to client via outlook api
func sendAppointmentEvent(id int64, name, email string, appointmentDate *time.Time, isReschedule bool) error {
	var (
		err          error
		startTimeStr string
		model        models.OutlookEventRequest
		endTimeStr   string
	)

	log.EnterFn(0, "sendAppointmentEvent")
	defer func() { log.ExitFn(0, "sendAppointmentEvent", err) }()

	startTimeStr = appointmentDate.Format(time.RFC3339Nano)
	endTimeStr = appointmentDate.Add(30 * time.Minute).Format(time.RFC3339Nano)

	subject := fmt.Sprintf("%s - OWE%d", leadsService.LeadEventLabelSubject, id)
	body := string(leadsService.LeadEventLabelBody)

	if isReschedule {
		body = fmt.Sprintf("%s %s", body, leadsService.LeadEventLabelBodyReschedule)
	}

	model = models.OutlookEventRequest{
		OwnerMail: leadsService.LeadAppCfg.AppointmentSenderEmail,
		Subject:   subject,
		Body:      body,
		StartTime: startTimeStr,
		EndTime:   endTimeStr,
		TimeZone:  "UTC",
		AttendeeEmails: []models.Attendee{
			{
				Email: email,
				Name:  name,
				Type:  "required",
			},
		},
		AllowNewTimeProposals: true,
		//TransactionID:         fmt.Sprintf("OWEHUB-LEADS-%d", id),
		TransactionID: fmt.Sprintf("OWEHUB-LEADS-%d-%d", id, time.Now().Unix()),
	}

	// Log the model for debugging
	log.FuncDebugTrace(0, "Outlook event model: %+v", model)

	//  OUTLOOK FUNCTION CALL
	event, eventErr := graphapi.CreateOutlookEvent(model)
	if eventErr != nil {
		err = eventErr
		log.FuncErrorTrace(0, "Error creating outlook event: %+v", eventErr)
		return eventErr
	}
	log.FuncDebugTrace(0, "created outlook event %+v", event)
	return nil
}

// Struct implementing graphapi.EventHandler interface
// HandleCreated, HandleUpdated, HandleDeleted
type LeadsMsgraphEventHandler struct{}

// Create handler not required
func (h *LeadsMsgraphEventHandler) HandleCreated(eventDetails models.EventDetails) error {
	return nil
}

// Update the leads status in the database, accepted, declined, etc.
func (h *LeadsMsgraphEventHandler) HandleUpdated(eventDetails models.EventDetails, attendeeResponse string) error {
	var (
		err         error
		event       graphmodels.Eventable
		updateCount int64
		data        []map[string]interface{}
		query       string
		leadsId     int
	)

	log.EnterFn(0, "LeadsEventHandler.HandleUpdated")
	defer func() { log.ExitFn(0, "LeadsEventHandler.HandleUpdated", err) }()

	if eventDetails.TransactionID == nil {
		log.FuncErrorTrace(0, "Event transaction id is nil")
		return nil
	}

	// retrieve lead id from the transaction id
	if !strings.HasPrefix(*eventDetails.TransactionID, "OWEHUB-LEADS-") {
		log.FuncDebugTrace(0, "Event id %v does not have a valid leads id", *eventDetails.TransactionID)
		return nil
	}

	leadsIdStr := strings.TrimPrefix(*eventDetails.TransactionID, "OWEHUB-LEADS-")

	// Split the TransactionID to retrieve the lead ID
	parts := strings.Split(leadsIdStr, "-")

	leadsId, err = strconv.Atoi(parts[0])

	if err != nil {
		log.FuncDebugTrace(0, "Failed to parse lead ID from Transaction ID: %v, err: %v", *eventDetails.TransactionID, err)
		return nil
	}

	// fetch attendees from the event
	event, err = graphapi.GetOutlookEvent(models.EventGetRequest{
		EventId:   eventDetails.EventId,
		OwnerMail: leadsService.LeadAppCfg.AppointmentSenderEmail,
	})
	if err != nil {
		log.FuncErrorTrace(0, "Error getting event details: %v", err)
		return err
	}

	attendees := event.GetAttendees()
	if len(attendees) == 0 {
		log.FuncErrorTrace(0, "Event %v has no attendees", eventDetails.EventId)
		return nil
	}

	response := attendees[0].GetStatus().GetResponse()

	if response.String() == "accepted" {
		log.FuncDebugTrace(0, "Event %v accepted by user, leads id %d", eventDetails.EventId, leadsId)
		query = `
			UPDATE leads_info
			SET APPOINTMENT_ACCEPTED_DATE = CURRENT_TIMESTAMP,
			UPDATED_AT = CURRENT_TIMESTAMP,
			APPOINTMENT_DECLINED_DATE = NULL,
			STATUS_ID = 2
			WHERE leads_id = $1
			AND APPOINTMENT_DATE > CURRENT_TIMESTAMP
		`
		err, updateCount = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{leadsId})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to update leads info in db: %v", err)
			return err
		}

		if updateCount == 0 {
			log.FuncErrorTrace(0, "No leads info found for given lead id or appointment date is passed")
			return nil
		}

		// send sms and email
		query = `
			SELECT
				li.first_name,
				li.last_name,
				li.phone_number,
				li.email_id,
				li.appointment_date,
				li.frontend_base_url,
				ud.name as creator_name,
				ud.email_id as creator_email,
				ud.mobile_number as creator_phone
			FROM
				leads_info li
			INNER JOIN user_details ud ON ud.user_id = li.salerep_id	
			WHERE
				leads_id = $1
		`
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{leadsId})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to get lead details from database: %v", err)
			return err
		}
		if len(data) <= 0 {
			log.FuncErrorTrace(0, "Lead with leads_id %d not found", leadsId)
			return nil
		}

		phoneNo, ok := data[0]["phone_number"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert phone_number to string type Item: %+v", data[0])
			return nil
		}

		creatorName, ok := data[0]["creator_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert creator_name to string type Item: %+v", data[0])
			return nil
		}

		creatorEmail, ok := data[0]["creator_email"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert creator_email to string type Item: %+v", data[0])
			return nil
		}

		creatorPhone, ok := data[0]["creator_phone"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert creator_phone to string type Item: %+v", data[0])
			return nil
		}

		firstName, ok := data[0]["first_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get first name from database Item: %+v", data[0])
			return nil
		}
		lastName, ok := data[0]["last_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get first name from database Item: %+v", data[0])
			return nil
		}

		leadEmail, ok := data[0]["email_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert email_id to string type Item: %+v", data[0])
			return nil
		}

		frontendBaseUrl, ok := data[0]["frontend_base_url"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert frontend_base_url to string type Item: %+v", data[0])
			return nil
		}

		smsMessage := leadsService.SmsAppointmentAccepted.WithData(leadsService.SmsDataAppointmentAccepted{
			LeadId:        int64(leadsId),
			LeadFirstName: firstName,
			LeadLastName:  lastName,
			UserName:      creatorName,
		})

		emailTmplData := emailClient.TemplateDataLeadStatusChanged{
			UserName:        creatorName,
			LeadId:          int64(leadsId),
			LeadFirstName:   firstName,
			LeadLastName:    lastName,
			LeadEmailId:     leadEmail,
			LeadPhoneNumber: phoneNo,
			NewStatus:       "APT_ACCEPTED",
			ViewUrl:         fmt.Sprintf("%s/leadmng-dashboard?view=%d", frontendBaseUrl, leadsId),
		}

		err = sendSms(creatorPhone, smsMessage)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
		}

		err = emailClient.SendEmail(emailClient.SendEmailRequest{
			ToName:       creatorName,
			ToEmail:      creatorEmail,
			Subject:      "Appointment Accepted",
			TemplateData: emailTmplData,
		})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
		}
	}

	if response.String() == "declined" {
		log.FuncDebugTrace(0, "Event %v declined by user, lead id %d", eventDetails.EventId, leadsId)
		query = `
			UPDATE leads_info
			SET APPOINTMENT_DECLINED_DATE = CURRENT_TIMESTAMP,
			UPDATED_AT = CURRENT_TIMESTAMP,
			APPOINTMENT_ACCEPTED_DATE = NULL,
			APPOINTMENT_DATE = NULL,
			STATUS_ID = 3
			WHERE leads_id = $1
			AND APPOINTMENT_DATE > CURRENT_TIMESTAMP
		`
		err, updateCount = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{leadsId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update leads info in db: %v", err)
			return err
		}
		if updateCount == 0 {
			log.FuncErrorTrace(0, "No leads info found for given lead id or appointment date is passed")
			return nil
		}
	}

	return nil
}

// Update the leads status in the: declined
func (h *LeadsMsgraphEventHandler) HandleDeleted(eventDetails models.EventDetails) error {
	var (
		err   error
		query string
		data  []map[string]interface{}
	)

	log.EnterFn(0, "LeadsEventHandler.HandleDeleted")
	defer func() { log.ExitFn(0, "LeadsEventHandler.HandleDeleted", err) }()

	if eventDetails.TransactionID == nil {
		log.FuncErrorTrace(0, "Event transaction id is nil")
		return nil
	}

	// retrieve lead id from the transaction id
	if !strings.HasPrefix(*eventDetails.TransactionID, "OWEHUB-LEADS-") {
		log.FuncDebugTrace(0, "Event id %v does not have a valid leads id", *eventDetails.TransactionID)
		return nil
	}

	leadsIdStr := strings.TrimPrefix(*eventDetails.TransactionID, "OWEHUB-LEADS-")

	// Split the TransactionID to retrieve the lead ID
	parts := strings.Split(leadsIdStr, "-")

	leadsId, err := strconv.Atoi(parts[0])
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse leads id err %v", err)
		return err
	}

	query = `
		UPDATE leads_info
		SET APPOINTMENT_DECLINED_DATE = CURRENT_TIMESTAMP,
		UPDATED_AT = CURRENT_TIMESTAMP,
		APPOINTMENT_ACCEPTED_DATE = NULL,
		APPOINTMENT_DATE = NULL,
		STATUS_ID = 3
		WHERE leads_id = $1
		AND APPOINTMENT_DATE > CURRENT_TIMESTAMP
	`
	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{leadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update leads info in db: %v", err)
		return err
	}

	// send sms and email
	query = `
	SELECT
		li.first_name,
		li.last_name,
		li.phone_number,
		li.email_id,
		li.appointment_date,
		li.frontend_base_url,
		ud.name as creator_name,
		ud.email_id as creator_email,
		ud.mobile_number as creator_phone
	FROM
		leads_info li
	INNER JOIN user_details ud ON ud.user_id = li.salerep_id	
	WHERE
		leads_id = $1
`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{leadsId})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead details from database: %v", err)
		return err
	}
	if len(data) <= 0 {
		log.FuncErrorTrace(0, "Lead with leads_id %d not found", leadsId)
		return nil
	}

	phoneNo, ok := data[0]["phone_number"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert phone_number to string type Item: %+v", data[0])
		return nil
	}

	creatorName, ok := data[0]["creator_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_name to string type Item: %+v", data[0])
		return nil
	}

	creatorEmail, ok := data[0]["creator_email"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_email to string type Item: %+v", data[0])
		return nil
	}

	creatorPhone, ok := data[0]["creator_phone"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert creator_phone to string type Item: %+v", data[0])
		return nil
	}

	firstName, ok := data[0]["first_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get first name from database Item: %+v", data[0])
		return nil
	}
	lastName, ok := data[0]["last_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get first name from database Item: %+v", data[0])
		return nil
	}

	leadEmail, ok := data[0]["email_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert email_id to string type Item: %+v", data[0])
		return nil
	}

	frontendBaseUrl, ok := data[0]["frontend_base_url"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to assert frontend_base_url to string type Item: %+v", data[0])
		return nil
	}

	smsMessage := leadsService.SmsAppointmentDeclined.WithData(leadsService.SmsDataAppointmentDeclined{
		LeadId:        int64(leadsId),
		LeadFirstName: firstName,
		LeadLastName:  lastName,
		UserName:      creatorName,
	})

	emailTmplData := emailClient.TemplateDataLeadStatusChanged{
		UserName:        creatorName,
		LeadId:          int64(leadsId),
		LeadFirstName:   firstName,
		LeadLastName:    lastName,
		LeadEmailId:     leadEmail,
		LeadPhoneNumber: phoneNo,
		NewStatus:       "APT_DECLINED",
		ViewUrl:         fmt.Sprintf("%s/leadmng-dashboard?view=%d", frontendBaseUrl, leadsId),
	}

	err = sendSms(creatorPhone, smsMessage)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to send sms to lead creator err %v", err)
	}

	err = emailClient.SendEmail(emailClient.SendEmailRequest{
		ToName:       creatorName,
		ToEmail:      creatorEmail,
		Subject:      "Appointment Declined",
		TemplateData: emailTmplData,
	})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to send email to lead creator err %v", err)
	}

	return nil
}

// getLeadPdfFilename returns the filename for the leads proposal pdf
func getLeadPdfFilename(firstName, lastName string) string {
	name := ""

	for _, r := range strings.ToLower(firstName) {
		// only allow alphabets and numbers
		if r >= 97 && r <= 122 || r >= 48 && r <= 57 {
			name += string(r)
		}
	}
	name += "_"
	for _, r := range strings.ToLower(lastName) {
		// only allow alphabets and numbers
		if r >= 97 && r <= 122 || r >= 48 && r <= 57 {
			name += string(r)
		}
	}

	return fmt.Sprintf("%s_%d.pdf", name, time.Now().Unix())
}

// function to send SMS to the Client/sales rep
func sendSms(phoneNumber string, message string) error {
	var (
		err error
		req *http.Request
	)
	log.EnterFn(0, "sendSms")
	defer log.ExitFn(0, "sendSms", err)
	// encode request body into buffer
	// get api url & create the request
	apiUrl := leadsService.LeadAppCfg.TwilioApiUrl
	apiUrl = strings.ReplaceAll(apiUrl, "{accounts_id}", leadsService.LeadAppCfg.TwilioAccountSid)
	// Form data
	data := url.Values{}
	data.Set("From", leadsService.LeadAppCfg.TwilioFromPhone)
	data.Set("To", "+"+phoneNumber)
	data.Set("Body", message)
	// Create the request
	req, err = http.NewRequest("POST", apiUrl, bytes.NewBufferString(data.Encode()))
	if err != nil {
		return err
	}
	// set headers
	req.SetBasicAuth(leadsService.LeadAppCfg.TwilioAccountSid, leadsService.LeadAppCfg.TwilioAuthToken)
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	// send the request
	log.FuncDebugTrace(0, "Calling twilio api %s", apiUrl)
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err := client.Do(req)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to call api %s err %v", apiUrl, err)
		return err
	}
	defer resp.Body.Close()
	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from aurora api err %v", err)
		return err
	}
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusAccepted {
		respString := string(respBytes)
		err = fmt.Errorf("call to twilio api %s failed with status code %d, response: %+v", apiUrl, resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return err
	}
	log.FuncDebugTrace(0, "Message sent successfully: %s with response %+v", apiUrl, resp.StatusCode)
	return nil
}

// get aurora proposal pdf url
// NOTE: This is a long running & blocking process
func getAuroraProposalPdfUrl(designId string) (string, error) {
	var (
		err                               error
		retrieveProposalPdfGenerationResp *auroraclient.RetrieveProposalPdfGenerationApiResponse
		runProposalPdfGenerationResp      *auroraclient.RunProposalPdfGenerationApiResponse
	)

	log.EnterFn(0, "getAuroraProposalPdfUrl")
	defer func() { log.ExitFn(0, "getAuroraProposalPdfUrl", err) }()

	// aurora api calls to generate pdf
	runProposalPdfGenerationApi := auroraclient.RunProposalPdfGenerationApi{
		DesignId: designId,
	}

	runProposalPdfGenerationResp, err = runProposalPdfGenerationApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to call aurora api err %v", err)
		return "", err
	}

	jobId, ok := runProposalPdfGenerationResp.ProposalPdfGenerationJob["job_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get job_id from run pdf generation: %+v", runProposalPdfGenerationResp.ProposalPdfGenerationJob)
		return "", errors.New("Failed to get job_id from run pdf generation")
	}

	pdfGenUrl, ok := runProposalPdfGenerationResp.ProposalPdfGenerationJob["url"].(string)
	if ok {
		log.FuncDebugTrace(0, "Got URL from run pdf generation: %s", pdfGenUrl)
		return pdfGenUrl, nil
	}

	// If the job is not done, we will poll the status of the job
	startTimeUnix := time.Now().Unix()
	for {
		<-time.After(time.Second * 5)
		log.FuncDebugTrace(0, "PDF generation: Checking PDF generation status")

		retrieveProposalPdfGenerationApi := auroraclient.RetrieveProposalPdfGenerationApi{
			DesignId: designId,
			JobId:    jobId,
		}

		retrieveProposalPdfGenerationResp, err = retrieveProposalPdfGenerationApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to call aurora api err %v", err)
			return "", err
		}

		pdfGenerationJobStatus, ok := retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob["status"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get status from retrieve pdf generation: %+v", retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob)
			return "", err
		}

		if pdfGenerationJobStatus == "running" {
			log.FuncDebugTrace(0, "PDF generation: PDF generation still running")
			continue
		}

		if pdfGenerationJobStatus == "failed" {
			pdfGenerationError, ok := retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob["error"].(map[string]string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get error from retrieve pdf generation: %+v", retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob)
				return "", errors.New("PDF generation failed")
			}
			log.FuncErrorTrace(0, "PDF generation: PDF generation failed with error: %s", pdfGenerationError["message"])
			return "", errors.New("PDF generation failed")
		}

		if pdfGenerationJobStatus == "succeeded" {
			log.FuncDebugTrace(0, "PDF generation: PDF generation completed")
			pdfGenerationUrl, ok := retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob["url"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get url from retrieve pdf generation: %+v", retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob)
				return "", errors.New("PDF generation failed")
			}
			log.FuncDebugTrace(0, "PDF generation: Got URL from retrieve pdf generation: %s", pdfGenerationUrl)
			return pdfGenerationUrl, nil
		}

		// timeout after 10 minutes
		if time.Now().Unix()-startTimeUnix > 1200 {
			log.FuncErrorTrace(0, "PDF generation: PDF generation timed out")
			return "", errors.New("PDF generation timed out")
		}
	}
}
