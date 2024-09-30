/**************************************************************************
 * File            : apiDataUpdate.go
 * DESCRIPTION     : This file contains functions for data update handler
 * DATE            : 28-April-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:            HandleConfigUpdateHandler
 * DESCRIPTION:     handler for Config Update Notification
 * INPUT:                       resp, req
 * RETURNS:             void
 *****************************************************************************/
func HandleConfigUpdateHandler(resp http.ResponseWriter, req *http.Request) {
	var (
		err        error
		updatedCfg models.ConfigUpdateNotification
	)

	log.EnterFn(0, "HandleConfigUpdateHandler")
	defer func() { log.ExitFn(0, "HandleConfigUpdateHandler", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Login request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Login request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}
	err = json.Unmarshal(reqBody, &updatedCfg)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Login request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Login request", http.StatusBadRequest, nil)
		return
	} else {
		log.FuncDebugTrace(0, "Config udpate notification recieved for config_id: %v", updatedCfg.Config_id)
	}

	/*Identify where this configuration id is already applied*/
	/*Trigger recalculations*/

}
