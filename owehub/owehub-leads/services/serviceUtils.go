package services

import (
	"OWEApp/shared/db"
	graphapi "OWEApp/shared/graphApi"
	log "OWEApp/shared/logger"
	"fmt"
	"strconv"
	"strings"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"

	"time"

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
		err     error
		event   graphmodels.Eventable
		query   string
		leadsId int
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
	// leadsId, err = strconv.Atoi(leadsIdStr)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to parse leads id err %v", err)
	// 	return err
	// }

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
		`
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{leadsId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update leads info in db: %v", err)
			return err
		}
	}

	if response.String() == "declined" {
		log.FuncDebugTrace(0, "Event %v declined by user, lead id %d", eventDetails.EventId, leadsId)
		query = `
			UPDATE leads_info
			SET APPOINTMENT_DECLINED_DATE = CURRENT_TIMESTAMP,
			UPDATED_AT = CURRENT_TIMESTAMP,
			APPOINTMENT_ACCEPTED_DATE = NULL,
			STATUS_ID = 3
			WHERE leads_id = $1
		`
		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{leadsId})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update leads info in db: %v", err)
			return err
		}
	}

	return nil
}

// Update the leads status in the: declined
func (h *LeadsMsgraphEventHandler) HandleDeleted(eventDetails models.EventDetails) error {
	var (
		err   error
		query string
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

	// leadsIdStr := strings.TrimPrefix(*eventDetails.TransactionID, "OWEHUB-LEADS-")
	// leadsId, err := strconv.Atoi(leadsIdStr)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to parse leads id err %v", err)
	// 	return err
	// }

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
		STATUS_ID = 3
		WHERE leads_id = $1
	`
	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{leadsId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update leads info in db: %v", err)
		return err
	}

	return nil
}
