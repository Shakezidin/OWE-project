/**************************************************************************
 *      Function        : webhookProjectStatusChanged.go
 *      DESCRIPTION     : This file contains functions to handle webhooks
 *						 for project status changed
 *      DATE            : 11-Sept-2024
 **************************************************************************/

package services

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
)

/******************************************************************************
 * FUNCTION:        HandleWebhookProjectStatusChanged
 *
 * DESCRIPTION:     function to handle webhooks for project status changed
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func HandleWebhookProjectStatusChanged(resp http.ResponseWriter, req *http.Request) {
	var err error

	log.EnterFn(0, "HandleWebhookProjectStatusChanged")
	defer func() { log.ExitFn(0, "HandleWebhookProjectStatusChanged", err) }()

	// MUST RESPOND ASAP
	appserver.FormAndSendHttpResp(resp, "Success", http.StatusOK, nil)

	logLn, logClose := initLogging()
	defer logClose(err)

	status := req.URL.Query().Get("status")
	project_id := req.URL.Query().Get("project_id")

	auth := req.Header.Values("X-OWEHUB-AUTH")

	logLn(fmt.Sprintf("status: %s, project_id: %s", status, project_id))
	logLn(fmt.Sprintf("auth: %v", auth))

}

// TEST ONLY; COPIED FROM USER API MAIN SVC
func initLogging() (
	logLn func(string), logClose func(error),
) {
	var (
		logBuilder     strings.Builder
		startTime      string
		logFile        *os.File
		logFileOpenErr error
	)

	log.EnterFn(0, "startUserApiLogging")
	defer func() { log.ExitFn(0, "startUserApiLogging", logFileOpenErr) }()
	// initialize log parameters for the api call

	startTime = time.Now().Format(time.Kitchen)

	logFile, logFileOpenErr = os.OpenFile("/var/log/owe/owe-webhooks.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)

	// initial logs for the api call
	if logFileOpenErr != nil {
		log.FuncErrorTrace(0, "Cannot open log file err: %v", logFileOpenErr)
	} else {
		// write authenticatedEmail and apiName
		_, err := logBuilder.WriteString(fmt.Sprintf("\n[%s]\n", startTime))
		if err != nil {
			log.FuncErrorTrace(0, "Cannot write to log builder err: %v", err)
		}
	}

	logLn = func(message string) {
		if logFileOpenErr != nil {
			return
		}
		_, err := logBuilder.WriteString(fmt.Sprintf("%s\n", message))
		if err != nil {
			log.FuncErrorTrace(0, "Cannot write to log builder err: %v", err)
		}
	}

	// Record end of api call (Call this in a deferred func)
	logClose = func(err error) {

		if logFileOpenErr != nil {
			return
		}

		defer func() {
			err = logFile.Close()
			if err != nil {
				log.FuncErrorTrace(0, "Cannot close log file: %v", err)
			}
		}()

		// only write log on api success
		if err != nil {
			return
		}

		_, err = logFile.WriteString(logBuilder.String())
		if err != nil {
			log.FuncErrorTrace(0, "Cannot write to log file err: %v", err)
		}

	}

	return logLn, logClose
}
