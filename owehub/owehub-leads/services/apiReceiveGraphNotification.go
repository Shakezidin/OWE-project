/**************************************************************************
* File			: apiReceiveGraphNotification.go
* DESCRIPTION	: This file contains functions receiving msgraph api notification
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	graphapi "OWEApp/shared/graphApi"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"io"
	"net/http"
	"net/url"
)

func HandleReceiveGraphNotificationRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		subscriptionBody models.GraphNotification
	)

	log.EnterFn(0, "HandleReceiveGraphNotificationRequest")
	defer func() { log.ExitFn(0, "HandleReceiveGraphNotificationRequest", err) }()

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
			schedulerHandler := NewSchedulerEventHandler()
			router := graphapi.NewEventRouter(schedulerHandler)
			err = router.RoutingBasedOnChangeType(subscriptionBody.Value[0].ChangeType, subscriptionBody.Value[0].Resource)
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

type SchedulerEventHandler struct {
}

func NewSchedulerEventHandler() *SchedulerEventHandler {
	return &SchedulerEventHandler{}
}

func (h *SchedulerEventHandler) HandleCreated(eventDetails models.EventDetails) error {
	log.FuncInfoTrace(0, "CREATE HANDLER CALLED")
	log.FuncDebugTrace(0, "EventDetails: %+v", eventDetails)
	return nil
}

func (h *SchedulerEventHandler) HandleUpdated(eventDetails models.EventDetails, attendeeResponse string) error {
	log.FuncInfoTrace(0, "CREATE UPDATE CALLED")
	return nil
}

func (h *SchedulerEventHandler) HandleDeleted(eventDetails models.EventDetails) error {
	log.FuncInfoTrace(0, "CREATE DELETE CALLED")
	return nil
}
