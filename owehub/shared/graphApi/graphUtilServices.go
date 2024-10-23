/**************************************************************************
 *      Function        : graphUtilServices.go
 *      DESCRIPTION     : to create the outlook event
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package graphapi

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"fmt"
	"regexp"
	"time"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
)

const (
	ResponseTypeNone                = "none"                // No response received
	ResponseTypeTentativelyAccepted = "tentativelyAccepted" // Tentatively accepted
	ResponseTypeAccepted            = "accepted"            // Accepted
	ResponseTypeDeclined            = "declined"            // Declined
)

type EventHandler interface {
	HandleCreated(eventDetails models.EventDetails) error
	HandleUpdated(eventDetails models.EventDetails, attendeeResponse string) error
	HandleDeleted(eventDetails models.EventDetails) error
}

type EventRouter struct {
	handler EventHandler
}

func NewEventRouter(handler EventHandler) *EventRouter {
	return &EventRouter{handler: handler}
}

/**************************************************************************
 * File			: ParseEventDetails.go
 * DESCRIPTION	:
 * DATE			: 28-Aug-2024
 **************************************************************************/
func ParseEventDetails(event graphmodels.Eventable) (models.EventDetails, error) {
	if event == nil {
		return models.EventDetails{}, fmt.Errorf("event is nil")
	}

	startTime := event.GetStart().GetDateTime()
	if startTime == nil {
		return models.EventDetails{}, fmt.Errorf("start time is nil")
	}

	endTime := event.GetEnd().GetDateTime()
	if endTime == nil {
		return models.EventDetails{}, fmt.Errorf("end time is nil")
	}

	const graphTimeFormat = "2006-01-02T15:04:05.0000000"
	startDateTime, err := time.Parse(graphTimeFormat, *startTime)
	if err != nil {
		return models.EventDetails{}, fmt.Errorf("error parsing start time: %v", err)
	}

	endDateTime, err := time.Parse(graphTimeFormat, *endTime)
	if err != nil {
		return models.EventDetails{}, fmt.Errorf("error parsing end time: %v", err)
	}

	eventDetails := models.EventDetails{
		Date:          startDateTime.Format("2006-01-02"),
		Day:           startDateTime.Weekday().String(),
		StartTime:     startDateTime.Format("15:04"),
		EndTime:       endDateTime.Format("15:04"),
		StartDate:     startDateTime,
		EndDate:       endDateTime,
		TransactionID: event.GetTransactionId(),
		TimeZone:      event.GetOriginalStartTimeZone(),
	}

	return eventDetails, nil
}

/**************************************************************************
 * File			: getEventIdFromSubsReq.go
 * DESCRIPTION	:
 * DATE			: 28-Aug-2024
 **************************************************************************/
func getEventIdFromSubsReq(resource string) string {
	var eventID string
	re := regexp.MustCompile(`Events/([^/]+)$`)
	match := re.FindStringSubmatch(resource)
	if len(match) > 1 {
		eventID = match[1]
	}
	return eventID
}

/**************************************************************************
 * File			: getEntraIdFromResource.go
 * DESCRIPTION	:
 * DATE			: 28-Aug-2024
 **************************************************************************/
func getEntraIdFromResource(resource string) string {
	var userID string
	re := regexp.MustCompile(`Users/([^/]+)/`)
	match := re.FindStringSubmatch(resource)
	if len(match) > 1 {
		userID = match[1]
	}
	return userID
}

/**************************************************************************
 * File			: OnEventUpdate.go
 * DESCRIPTION	:
 * DATE			: 28-Aug-2024
 **************************************************************************/
func OnEventUpdate(eventId, entraId string) (string, error) {
	request := models.EventGetRequest{
		EventId:   eventId,
		OwnerMail: entraId,
	}

	eventTable, err := GetOutlookEvent(request)
	if err != nil {
		log.FuncErrorTrace(0, "Error getting event details: %v; eventId %v", err, eventId)
		return "", err
	}

	attendees := eventTable.GetAttendees()
	for _, attendee := range attendees {
		if attendee.GetStatus().GetResponse().String() == ResponseTypeDeclined {
			attendeeMail := *attendee.GetEmailAddress().GetAddress()
			log.FuncInfoTrace(0, "user %v has rejected event, hence cancelling event with id: %v", attendeeMail, eventId)

			attendeeEmail := *attendee.GetEmailAddress().GetAddress()
			cancelRequest := models.EventCancellationRequest{
				Comment:   fmt.Sprintf("Attendee %v has cancelled, so the event is being cancelled.", attendeeEmail),
				EventId:   eventId,
				OwnerMail: entraId,
			}

			err := CancelOutlookEvent(cancelRequest)
			if err != nil {
				log.FuncErrorTrace(0, "Error cancelling event: %v; eventId: %v", err, eventId)
				return ResponseTypeDeclined, err
			}
			return ResponseTypeDeclined, nil
		}
	}

	return "", nil
}
