/**************************************************************************
 *      Function        : getSubscriptionHandlerService.go
 *      DESCRIPTION     : to create the outlook event
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package graphapi

import (
	models "OWEApp/shared/models"
	"strings"

	log "OWEApp/shared/logger"
)

/**************************************************************************
 * File			: routingBasedOnChangeType.go
 * DESCRIPTION	:
 * DATE			: 28-Aug-2024
 **************************************************************************/
func (r *EventRouter) RoutingBasedOnChangeType(changeType, resource string) error {
	var eventDetails models.EventDetails
	eventId := getEventIdFromSubsReq(resource)
	entraId := getEntraIdFromResource(resource)

	request := models.EventGetRequest{
		EventId:   eventId,
		OwnerMail: entraId,
	}

	eventTable, err := GetOutlookEvent(request)
	if err != nil {
		log.FuncErrorTrace(0, "Error getting event details: %v", err)
		if strings.Contains(err.Error(), "he specified object was not found in the store") {
			changeType = "deleted"
		}
	}

	if changeType == "deleted" {
	} else {
		eventDetails, err = ParseEventDetails(eventTable)
		if err != nil {
			log.FuncErrorTrace(0, "Error parsing event details: %v", err)
			return err
		}
	}

	eventDetails.EventId = eventId
	eventDetails.SurveyorEntraId = entraId

	switch changeType {
	case "created":
		//* call function to create an event
		eventDetails.EventStatus = "created"
		log.FuncInfoTrace(0, "EVENT CREATED -> metadata: %v", eventDetails)
		err = r.handler.HandleCreated(eventDetails)
	case "updated":
		attendeeResponse, err := OnEventUpdate(eventId, entraId)
		if err != nil {
			return err
		}
		if attendeeResponse == ResponseTypeDeclined {
			//* call function to delete the event
			log.FuncInfoTrace(0, "EVENT UPDATED, SOMEBODY CANCELLED, SO DELETING -> metadata: %v", eventDetails)
			err = r.handler.HandleDeleted(eventDetails)
			eventDetails.EventStatus = "deleted"
		}

		//* else call update function
		eventDetails.EventStatus = "updated"
		log.FuncInfoTrace(0, "EVENT UPDATED -> metadata: %v", eventDetails)
		err = r.handler.HandleUpdated(eventDetails, attendeeResponse)
	case "deleted":
		//* call function to delete the event
		eventDetails.EventStatus = "deleted"
		log.FuncInfoTrace(0, "EVENT DELETED -> metadata: %v", eventDetails)
		err = r.handler.HandleDeleted(eventDetails)
	default:
	}
	return nil
}
