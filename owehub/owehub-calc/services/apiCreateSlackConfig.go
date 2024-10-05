/**************************************************************************
* File			: 	apiCreateSlackConfig.go
* DESCRIPTION	: This file contains functions to create Slack Config handler
* DATE			: 	17-Aug-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"errors"
	"io"

	"encoding/json"
	"fmt"
	"net/http"
)

/******************************************************************************
 * FUNCTION:				HandleCreateSlackConfig
 * DESCRIPTION:     handler to create Slack Config request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleCreateSlackConfig(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		createSlackConfigReq models.CreateSlackConfig
		queryParameters      []interface{}
		result               []interface{}
	)

	log.EnterFn(0, "HandleCreateSlackConfig")
	defer func() { log.ExitFn(0, "HandleCreateSlackConfig", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create Slack Config request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &createSlackConfigReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	if (len(createSlackConfigReq.IssueType) <= 0) || (len(createSlackConfigReq.ChannelName) <= 0) || (len(createSlackConfigReq.BotToken) <= 0) || (len(createSlackConfigReq.SlackAppToken) <= 0) {
		err = errors.New("empty input fields in API is not allowed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, createSlackConfigReq.IssueType)
	queryParameters = append(queryParameters, createSlackConfigReq.ChannelId)
	queryParameters = append(queryParameters, createSlackConfigReq.ChannelName)
	queryParameters = append(queryParameters, createSlackConfigReq.BotToken)
	queryParameters = append(queryParameters, createSlackConfigReq.SlackAppToken)

	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateSlackConfigFuntion, queryParameters)
	if err != nil || len(result) <= 0 {
		log.FuncErrorTrace(0, "Failed to Add Slack Config in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Slack Config", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	log.DBTransDebugTrace(0, "New Slack Config created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "Slack Config Created Successfully", http.StatusOK, nil)
}
