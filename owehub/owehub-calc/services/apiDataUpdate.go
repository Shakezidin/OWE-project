/**************************************************************************
 * File            : apiDataUpdate.go
 * DESCRIPTION     : This file contains functions for data update handler
 * DATE            : 28-April-2024
 **************************************************************************/

package services

import (
	//common "OWEApp/owehub-calc/common"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:            HandleDataUpdateHandler
 * DESCRIPTION:     handler for Data udpate notification
 * INPUT:                       resp, req
 * RETURNS:             void
 *****************************************************************************/
func HandleDataUpdateHandler(resp http.ResponseWriter, req *http.Request) {
	var (
		err  error
		data models.DataUpdateNotification
	)

	log.EnterFn(0, "HandleDataUpdateHandler")
	defer func() { log.ExitFn(0, "HandleDataUpdateHandler", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Login request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Login request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}
	err = json.Unmarshal(reqBody, &data)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Login request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal Login request", http.StatusBadRequest, nil)
		return
	} else {
		log.FuncDebugTrace(0, "Data udpate notification recieved for unique_id: %v", data.Unique_id)
	}

	/*Identify the entities to be recalculated */
	/*Trigger recalculations*/
}
