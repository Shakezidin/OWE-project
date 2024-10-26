package services

import (
	graphapi "OWEApp/shared/graphApi"
	log "OWEApp/shared/logger"
	"errors"
	"fmt"

	"time"

	leadsService "OWEApp/owehub-leads/common"
	models "OWEApp/shared/models"
)

// ValidateCreateLeadsRequest validates the input data in the CreateLeadsRequest
func ValidateCreateLeadsRequest(req models.CreateLeadsReq) error {
	if len(req.FirstName) <= 0 || len(req.LastName) <= 0 || len(req.EmailId) <= 0 || len(req.PhoneNumber) <= 0 {
		return errors.New("empty input fields in API are not allowed")
	}
	return nil
}

// Send appointment to client via outlook api
func sentAppointmentEmail(id int64, name, email string, appointmentDate *time.Time, isReschedule bool) error {
	// Creating a new model instance
	var (
		err          error
		startTimeStr string
		model        models.OutlookEventRequest
		endTimeStr   string
	)

	log.EnterFn(0, "sentAppointmentEmail")
	defer func() { log.ExitFn(0, "sentAppointmentEmail", err) }()

	startTimeStr = appointmentDate.Format(time.RFC3339Nano)
	endTimeStr = appointmentDate.Add(30 * time.Minute).Format(time.RFC3339Nano)

	subject := "Team Meeting"
	body := "Let's discuss about the proposal"

	if isReschedule {
		subject = "Team Meeting"
		body = "Let's discuss about the proposal, we have rescheduled your meeting"
	}

	model = models.OutlookEventRequest{
		OwnerMail: leadsService.LeadAppCfg.AppointmentSenderEmail,
		Subject:   subject,
		Body:      body,
		StartTime: startTimeStr,
		EndTime:   endTimeStr,
		TimeZone:  "UTC",
		Location:  "Conference Room A",
		AttendeeEmails: []models.Attendee{
			{
				Email: email,
				Name:  name,
				Type:  "required",
			},
		},
		AllowNewTimeProposals: true,
		TransactionID:         fmt.Sprintf("OWEHUB-LEADS-%d", id),
	}
	//  OUTLOOK FUNCTION CALL
	event, eventErr := graphapi.CreateOutlookEvent(model)
	if eventErr != nil {
		err = eventErr
		return eventErr
	}
	log.FuncDebugTrace(0, "created outlook event %+v", event)
	return nil
}
