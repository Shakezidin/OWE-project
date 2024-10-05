/**************************************************************************
* File			: apiGetSchedulingProjects.go
* DESCRIPTION	: This file contains functions for fetching scheduling projects
*                 with pagination support.
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	log "OWEApp/shared/logger"
	"io"
	"net/http"
	"net/url"
)

func HandleGetGraphNotificationRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err error
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

	resp.Header().Set("Content-Type", "text/plain")
	resp.WriteHeader(http.StatusOK)
	_, err = resp.Write([]byte(decodedToken))

	if err != nil {
		log.FuncInfoTrace(0, "Error writing response: %v", err)
		http.Error(resp, "Invalid validation token", http.StatusBadRequest)
		return
	}
}
