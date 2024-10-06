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
	"time"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
)

func HandleGetGraphNotificationRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		subscriptionBody models.SubscriptionReq
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

	log.FuncInfoTrace(0, "BODY -> %v", string(respBody))

	if len(respBody) > 0 {
		err = json.Unmarshal(respBody, &subscriptionBody)
		if err != nil {
			log.FuncErrorTrace(0, "Error unmarshalling subscription response: %v", err)
		}
		err = routingBasedOnChangeType(subscriptionBody.ChangeType, subscriptionBody.Resource)
		if err != nil {
			log.FuncErrorTrace(0, "Error routing requests: %v", err)
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

func routingBasedOnChangeType(changeType, resource string) error {
	eventId := getEventIdFromSubsReq(resource)
	entraId := getEntraIdFromResource(resource)

	request := models.EventGetRequest{
		EventId:   eventId,
		OwnerMail: entraId,
	}

	eventTable, err := outlook.GetOutlookEvent(request)
	if err != nil {
		log.FuncErrorTrace(0, "Error getting event details: %v", err)
		return err
	}

	eventDetails, err := ParseEventDetails(eventTable)
	if err != nil {
		log.FuncErrorTrace(0, "Error parsing event details: %v", err)
		return err
	}

	eventDetails.EventId = eventId
	eventDetails.SurveyorEntraId = entraId

	switch changeType {
	case "created":
		//* call function to create an event
		eventDetails.EventStatus = "created"
	case "updated":
		attendeeResponse, err := OnEventUpdate(eventId, entraId)
		if err != nil {
			return err
		}
		if attendeeResponse == ResponseTypeDeclined {
			//* call function to delete the event
			eventDetails.EventStatus = "deleted"
		}

		//* else call update function
		eventDetails.EventStatus = "updated"
	case "deleted":
		//* call function to delete the event
		eventDetails.EventStatus = "deleted"
	default:
	}
	return nil
}

func ParseEventDetails(event graphmodels.Eventable) (*models.EventDetails, error) {
	if event == nil {
		return nil, fmt.Errorf("event is nil")
	}

	startTime := event.GetStart().GetDateTime()
	if startTime == nil {
		return nil, fmt.Errorf("start time is nil")
	}

	endTime := event.GetEnd().GetDateTime()
	if endTime == nil {
		return nil, fmt.Errorf("end time is nil")
	}

	startDateTime, err := time.Parse(time.RFC3339, *startTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing start time: %v", err)
	}

	endDateTime, err := time.Parse(time.RFC3339, *endTime)
	if err != nil {
		return nil, fmt.Errorf("error parsing end time: %v", err)
	}

	return &models.EventDetails{
		Date:          startDateTime.Format("2006-01-02"),
		Day:           startDateTime.Weekday().String(),
		StartTime:     startDateTime.Format("15:04"),
		EndTime:       endDateTime.Format("15:04"),
		StartDate:     startDateTime,
		EndDate:       endDateTime,
		TransactionID: *event.GetTransactionId(),
	}, nil
}

func getEventIdFromSubsReq(resource string) string {
	var eventID string
	re := regexp.MustCompile(`Events/([^/]+)$`)
	match := re.FindStringSubmatch(resource)
	if len(match) > 1 {
		eventID = match[1]
	}
	return eventID
}

func getEntraIdFromResource(resource string) string {
	var userID string
	re := regexp.MustCompile(`Users/([^/]+)/`)
	match := re.FindStringSubmatch(resource)
	if len(match) > 1 {
		userID = match[1]
	}
	return userID
}
