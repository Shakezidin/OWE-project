package services

import (
	graphapi "OWEApp/shared/graphApi"
	log "OWEApp/shared/logger"
	"errors"
	"fmt"

	"time"

	leadsService "OWEApp/owehub-leads/common"
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
		eventErr           error
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
	event, eventErr := graphapi.CreateOutlookEvent(model)
	if eventErr != nil {
		return eventErr
	}
	log.FuncDebugTrace(0, "created outlook event %+v", event)

	// create subscription for decline
	declineSub, declineSubErr := graphapi.CreateSubscription(models.SubscriptionRequest{
		NotificationURL:    "https://staging.owe-hub.com/api/owe-leads-service/v1/receive_graph_notification",
		ChangeType:         "create",
		Resource:           fmt.Sprintf("/users/%s/events/%s/decline", leadsService.LeadAppCfg.AppointmentSenderEmail, *event.GetId()),
		ExpirationDateTime: appointmentEndTime,
	})
	if declineSubErr != nil {
		return declineSubErr
	}
	log.FuncDebugTrace(0, "created outlook subscription %+v", declineSub)

	// create subscription for accept
	acceptSub, acceptSubErr := graphapi.CreateSubscription(models.SubscriptionRequest{
		NotificationURL:    "https://staging.owe-hub.com/api/owe-leads-service/v1/receive_graph_notification",
		ChangeType:         "create",
		Resource:           fmt.Sprintf("/users/%s/events/%s/accept", leadsService.LeadAppCfg.AppointmentSenderEmail, *event.GetId()),
		ExpirationDateTime: appointmentEndTime,
	})
	if acceptSubErr != nil {
		return acceptSubErr
	}
	log.FuncDebugTrace(0, "created outlook subscription %+v", acceptSub)

	return nil
}
