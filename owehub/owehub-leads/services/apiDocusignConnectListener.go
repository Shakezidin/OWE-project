/**************************************************************************
* File			: apiDocusignConnectListener.go
* DESCRIPTION	: This file contains functions for listening docusign events
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

/******************************************************************************
 * FUNCTION:		HandleDocusignConnectListenerRequest
 * DESCRIPTION:     handler for listening docusign events
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDocusignConnectListenerRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		reqBody []byte
		// query               string
		// data                []map[string]interface{}
		dataReq models.DocusignConnectListenerRequest
	)
	log.EnterFn(0, "HandleDocusignConnectListenerRequest")
	defer func() { log.ExitFn(0, "HandleDocusignConnectListenerRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in connect docusign listener request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from connect docusign listener request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to connect docusign listener request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Docusign Connect Listener", http.StatusOK, nil)
	writeToDummyFile(map[string]interface{}{
		"data":       dataReq,
		"accountid":  req.Header.Get("x-docusign-accountid"),
		"accountId":  req.Header.Get("x-docusign-accountId"),
		"account_id": req.Header.Get("x-docusign-account_id"),
	})
}

func writeToDummyFile(data interface{}) {
	var (
		err            error
		logFile        *os.File
		jsonData       []byte
		logFileOpenErr error
	)

	log.EnterFn(0, "writeToDummyFile")
	defer func() { log.ExitFn(0, "writeToDummyFile", err) }()
	logFile, logFileOpenErr = os.OpenFile("/var/log/owe/owe-outlook.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)

	if logFileOpenErr != nil {
		log.FuncErrorTrace(0, "Failed to open log file err: %v", logFileOpenErr)
		return
	}
	defer logFile.Close()

	jsonData, err = json.MarshalIndent(data, "", "  ")

	_, err = logFile.Write(jsonData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to write to dummy file err: %v", err)
		return
	}
}
