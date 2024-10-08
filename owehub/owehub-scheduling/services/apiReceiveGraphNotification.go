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
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
)

func HandleGetGraphNotificationRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		subscriptionBody models.GraphNotification
		// changeType       string
		// resourse         string
	)

	log.EnterFn(0, "HandleGetGraphNotificationRequest")
	defer func() { log.ExitFn(0, "HandleGetGraphNotificationRequest", err) }()

	validationToken := req.URL.Query().Get("validationToken")
	if validationToken == "" {
		log.FuncBriefTrace(0, "Failed to fetch token %+v", validationToken)
		// FormAndSendHttpResp(resp, "Failed to fetch token", http.StatusBadGateway, nil)
		// return
	}

	decodedToken, err := url.QueryUnescape(validationToken)
	if err != nil {
		log.FuncErrorTrace(0, "Error decoding validation token: %v", err)
		// http.Error(resp, "Invalid validation token", http.StatusBadRequest)
		// return
	}

	respBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Error reading req body: %v", err)
	}

	//* When we are creating subscription, body value can be null

	log.FuncInfoTrace(0, "BODY 1 -> %v", string(respBody))

	if len(string(respBody)) > 0 {
		err = json.Unmarshal(respBody, &subscriptionBody)
		if err != nil {
			log.FuncErrorTrace(0, "Error unmarshalling subscription response: %v", err)
		}

		log.FuncInfoTrace(0, "SUB BODY %v -> ", subscriptionBody)
		if len(subscriptionBody.Value) > 0 {
			err = routingBasedOnChangeType(subscriptionBody.Value[0].ChangeType, subscriptionBody.Value[0].Resource)
			if err != nil {
				log.FuncErrorTrace(0, "Error routing requests: %v", err)
			}
		}
	}

	resp.Header().Set("Content-Type", "text/plain")
	resp.WriteHeader(http.StatusOK)
	_, err = resp.Write([]byte(decodedToken))

	if err != nil {
		log.FuncErrorTrace(0, "Error writing response: %v", err)
		http.Error(resp, "Invalid validation token", http.StatusBadRequest)
		return
	}
}

/**************************************************************************
* File			: routingBasedOnChangeType.go
* DESCRIPTION	:
* DATE			: 28-Aug-2024
**************************************************************************/
func routingBasedOnChangeType(changeType, resource string) error {
	var eventDetails models.EventDetails
	eventId := getEventIdFromSubsReq(resource)
	entraId := getEntraIdFromResource(resource)

	request := models.EventGetRequest{
		EventId:   eventId,
		OwnerMail: entraId,
	}

	eventTable, err := outlook.GetOutlookEvent(request)
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
	case "updated":
		attendeeResponse, err := OnEventUpdate(eventId, entraId)
		if err != nil {
			return err
		}
		if attendeeResponse == ResponseTypeDeclined {
			//* call function to delete the event
			log.FuncInfoTrace(0, "EVENT UPDATED, SOMEBODY CANCELLED, SO DELETING -> metadata: %v", eventDetails)
			eventDetails.EventStatus = "deleted"
		}

		//* else call update function
		eventDetails.EventStatus = "updated"
		log.FuncInfoTrace(0, "EVENT UPDATED -> metadata: %v", eventDetails)
	case "deleted":
		//* call function to delete the event
		eventDetails.EventStatus = "deleted"
		log.FuncInfoTrace(0, "EVENT DELETED -> metadata: %v", eventDetails)
	default:
	}
	return nil
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
