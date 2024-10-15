package services

import (
	log "OWEApp/shared/logger"
	"errors"

	"time"

	leadsService "OWEApp/owehub-leads/common"
	graphApi "OWEApp/shared/graphApi"
	models "OWEApp/shared/models"

	"github.com/google/uuid"
)

// ValidateCreateLeadsRequest validates the input data in the CreateLeadsRequest
func ValidateCreateLeadsRequest(req models.CreateLeadsReq) error {
	if len(req.FirstName) <= 0 || len(req.LastName) <= 0 || len(req.EmailId) <= 0 || len(req.PhoneNumber) <= 0 {
		return errors.New("empty input fields in API are not allowed")
	}
	return nil
}

// Send appointment to client via outlook api
func sentAppointmentEmail(clientEmail string, appointmentDate *time.Time, isReschedule bool, name string) error {
	// Creating a new model instance
	var (
		err                error
		appointmentTimeStr string
		model              models.OutlookEventRequest
		appointmentEndTime string
	)

	appointmentTimeStr = appointmentDate.Format(time.RFC3339Nano)
	appointmentEndTime = appointmentDate.Add(30 * time.Minute).Format(time.RFC3339Nano)
	if isReschedule {
		model = models.OutlookEventRequest{
			OwnerMail: leadsService.LeadAppCfg.AppointmentSenderEmail,
			Subject:   "Team Meeting",
			Body:      "Let's discuss about the proposal, we have rescheduled your meeting",
			StartTime: appointmentTimeStr,
			EndTime:   appointmentEndTime,
			TimeZone:  "Pacific Standard Time",
			Location:  "Conference Room A",
			AttendeeEmails: []models.Attendee{
				{
					Email: clientEmail,
					Name:  name,
					Type:  "required",
				},
			},
			AllowNewTimeProposals: true,
			TransactionID:         uuid.NewString(),
		}
	} else {
		model = models.OutlookEventRequest{
			OwnerMail: leadsService.LeadAppCfg.AppointmentSenderEmail,
			Subject:   "Team Meeting",
			Body:      "Let's discuss about the proposal",
			StartTime: appointmentTimeStr,
			EndTime:   appointmentEndTime,
			TimeZone:  "Pacific Standard Time",
			Location:  "Conference Room A",
			AttendeeEmails: []models.Attendee{
				{
					Email: clientEmail,
					Name:  name,
					Type:  "required",
				},
			},
			AllowNewTimeProposals: true,
			TransactionID:         uuid.NewString(),
		}
	}

	//  OUTLOOK FUNCTION CALL
	event, err := graphApi.CreateOutlookEvent(model)
	if err != nil {
		return err
	}
	log.FuncDebugTrace(0, "got response from create outlook event %+v", event)
	return nil
}
