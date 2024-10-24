/**************************************************************************
* File			: apiReceiveGraphNotification.go
* DESCRIPTION	: This file contains functions receiving msgraph api notification
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
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
		decodedToken     string
	)

	log.EnterFn(0, "HandleReceiveGraphNotificationRequest")
	defer func() { log.ExitFn(0, "HandleReceiveGraphNotificationRequest", err) }()

	validationToken := req.URL.Query().Get("validationToken")
	if validationToken == "" {
		log.FuncErrorTrace(0, "Failed to fetch token from url query: %s", req.URL.RawQuery)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch token", http.StatusBadRequest, nil)
		return
	}

	decodedToken, err = url.QueryUnescape(validationToken)
	if err != nil {
		log.FuncErrorTrace(0, "Error decoding validation token: %v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid validation token", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Error reading req body: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read request body", http.StatusBadRequest, nil)
		return
	}

	if len(string(reqBody)) > 0 {
		err = json.Unmarshal(reqBody, &subscriptionBody)
		if err != nil {
			log.FuncErrorTrace(0, "Error unmarshalling subscription request: %v", err)
		}

		if subscriptionBody.Value != nil && len(subscriptionBody.Value) > 0 {
			schedulerHandler := leadsService.NewLeadsEventHandler()
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
