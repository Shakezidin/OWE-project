/**************************************************************************
* File			: apiGetSchedulingProjects.go
* DESCRIPTION	: This file contains functions for fetching scheduling projects
*                 with pagination support.
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	outlook "OWEApp/shared/graphApi"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"fmt"
)

const (
	ResponseTypeNone                = "none"                // No response received
	ResponseTypeTentativelyAccepted = "tentativelyAccepted" // Tentatively accepted
	ResponseTypeAccepted            = "accepted"            // Accepted
	ResponseTypeDeclined            = "declined"            // Declined
)

func OnEventUpdate(eventId, entraId string) (string, error) {
	request := models.EventGetRequest{
		EventId:   eventId,
		OwnerMail: entraId,
	}

	eventTable, err := outlook.GetOutlookEvent(request)
	if err != nil {
		log.FuncErrorTrace(0, "Error getting event details: %v; eventId %v", err, eventId)
		return "", err
	}

	attendees := eventTable.GetAttendees()
	for _, attendee := range attendees {
		if attendee.GetStatus().GetResponse().String() == ResponseTypeDeclined {
			attendeeMail := *attendee.GetEmailAddress().GetAddress()
			log.FuncInfoTrace(0,"user %v has rejected event, hence cancelling event with id: %v", attendeeMail, eventId)

			attendeeEmail := *attendee.GetEmailAddress().GetAddress()
			cancelRequest := models.EventCancellationRequest{
				Comment:   fmt.Sprintf("Attendee %v has cancelled, so the event is being cancelled.", attendeeEmail),
				EventId:   eventId,
				OwnerMail: entraId,
			}

			err := outlook.CancelOutlookEvent(cancelRequest)
			if err != nil {
				log.FuncErrorTrace(0, "Error cancelling event: %v; eventId: %v", err, eventId)
				return ResponseTypeDeclined, err
			}
			return ResponseTypeDeclined, nil
		}
	}

	return "", nil
}
