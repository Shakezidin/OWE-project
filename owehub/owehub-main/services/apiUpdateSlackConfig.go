/**************************************************************************
* File			: 	apiUpdateSlackConfig.go
* DESCRIPTION	: This file contains functions to update Slack Config handler
* DATE			: 	14-Sep-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	"net/http"
)

/******************************************************************************
 * FUNCTION:				HandleUpdateSlackConfigRequest
 * DESCRIPTION:     handler to update Slack Config request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleUpdateSlackConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		updateSlackConfigReq models.UpdateSlackConfig
		queryParameters      []interface{}
	)

	log.EnterFn(0, "HandleUpdateSlackConfig")
	defer func() { log.ExitFn(0, "HandleUpdateSlackConfig", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update Slack Config request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateSlackConfigReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update slack config request", http.StatusBadRequest, nil)
		return
	}

	if (len(updateSlackConfigReq.IssueType) <= 0) || (len(updateSlackConfigReq.ChannelName) <= 0) ||
		(len(updateSlackConfigReq.BotToken) <= 0) || (len(updateSlackConfigReq.SlackAppToken) <= 0) ||
		(len(updateSlackConfigReq.ChannelId) <= 0) {
		err = fmt.Errorf("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, updateSlackConfigReq.RecordId)
	queryParameters = append(queryParameters, updateSlackConfigReq.ChannelId)
	queryParameters = append(queryParameters, updateSlackConfigReq.IssueType)
	queryParameters = append(queryParameters, updateSlackConfigReq.ChannelName)
	queryParameters = append(queryParameters, updateSlackConfigReq.BotToken)
	queryParameters = append(queryParameters, updateSlackConfigReq.SlackAppToken)

	_, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateSlackConfigFuntion, queryParameters)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to Update Slack Config in DB with err: %v", err)

		if strings.Contains(err.Error(), "not found") {
			appserver.FormAndSendHttpResp(resp, "Slack config not found", http.StatusNotFound, nil)
			return
		}

		appserver.FormAndSendHttpResp(resp, "Failed to Update Slack Config", http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "Updated Slack Config with Id: %d", updateSlackConfigReq.RecordId)
	appserver.FormAndSendHttpResp(resp, "Slack Config Updated Successfully", http.StatusOK, nil)
}
