/**************************************************************************
* File			: outlook.go
* DESCRIPTION	: This file contains outlook event handlers for leads service
* DATE			: 28-Aug-2024
**************************************************************************/
package common

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"
)

type LeadsEventHandler struct{}

func NewLeadsEventHandler() *LeadsEventHandler { return &LeadsEventHandler{} }

func (h *LeadsEventHandler) HandleCreated(eventDetails models.EventDetails) error {
	log.FuncInfoTrace(0, "CREATE HANDLER CALLED")
	logData(eventDetails)
	return nil
}

func (h *LeadsEventHandler) HandleUpdated(eventDetails models.EventDetails, attendeeResponse string) error {
	log.FuncInfoTrace(0, "UPDATE HANDLER CALLED")
	logData(eventDetails)
	return nil
}

func (h *LeadsEventHandler) HandleDeleted(eventDetails models.EventDetails) error {
	log.FuncInfoTrace(0, "CREATE HANDLER CALLED")
	return nil
}

func logData(data interface{}) {
	var (
		logBuilder     strings.Builder
		startTime      string
		logFile        *os.File
		logFileOpenErr error
		dataBytes      []byte
	)

	log.EnterFn(0, "logData")
	defer func() { log.ExitFn(0, "logData", logFileOpenErr) }()

	// initialize log parameters for the api call
	startTime = time.Now().Format(time.RFC3339)

	logFile, logFileOpenErr = os.OpenFile("/var/log/owe/owe-outlook.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)

	// initial logs for the api call
	if logFileOpenErr != nil {
		log.FuncErrorTrace(0, "Cannot open user log file err: %v", logFileOpenErr)
		return
	}
	_, err := logBuilder.WriteString(fmt.Sprintf("\n[%s]\n", startTime))
	if err != nil {
		log.FuncErrorTrace(0, "Cannot write to log builder err: %v", err)
		return
	}

	dataBytes, err = json.MarshalIndent(data, "", "\t")

	if err != nil {
		log.FuncErrorTrace(0, "Cannot convert data to json err: %v", err)
	}

	_, err = logBuilder.WriteString(string(dataBytes))
	if err != nil {
		log.FuncErrorTrace(0, "Cannot write to log builder err: %v", err)
	}

	_, err = logFile.WriteString(logBuilder.String())
	if err != nil {
		log.FuncErrorTrace(0, "Cannot write to user log file err: %v", err)
	}

	err = logFile.Close()
	if err != nil {
		log.FuncErrorTrace(0, "Cannot close log file: %v", err)
		return
	}
}
