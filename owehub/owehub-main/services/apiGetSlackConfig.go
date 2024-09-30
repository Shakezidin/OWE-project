/**************************************************************************
 * File       	   : apiGetSlackConfig.go
 * DESCRIPTION     : This file contains functions for get Slack Config data handler
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetSlackConfigRequest
 * DESCRIPTION:     handler for get Slack Config data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetSlackConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetSlackConfigRequest
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		RecordCount  int64
	)

	log.EnterFn(0, "HandleGetSlackConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetSlackConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Slack Config data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Slack Config data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Slack Config data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get Slack Config data Request body", http.StatusBadRequest, nil)
		return
	}

	query = fmt.Sprintf(`
		SELECT
			id,
			issue_type,
			channel_id,
			channel_name,
			bot_token,
			slack_app_token
		FROM %s
		WHERE is_archived = false
		LIMIT %d
		OFFSET %d
	`,
		db.TableName_slackconfig,
		dataReq.PageSize,
		dataReq.PageSize*(dataReq.PageNumber-1),
	)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Slack Config data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Slack Config data from DB", http.StatusBadRequest, nil)
		return
	}

	SlackConfigList := models.GetSlackConfigList{}

	for _, item := range data {
		RecordId, ok := item["id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		ChannelId, ok := item["channel_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get channel id for Record ID %v. Item: %+v\n", RecordId, item)
			ChannelId = ""
		}
		IssueType, ok := item["issue_type"].(string)
		if !ok || IssueType == "" {
			log.FuncErrorTrace(0, "Failed to get issue_type for Record ID %v. Item: %+v\n", RecordId, item)
			IssueType = ""
		}
		ChannelName, ok := item["channel_name"].(string)
		if !ok || ChannelName == "" {
			log.FuncErrorTrace(0, "Failed to get channel_name for Record ID %v. Item: %+v\n", RecordId, item)
			ChannelName = ""
		}
		SlackAppToken, ok := item["slack_app_token"].(string)
		if !ok || SlackAppToken == "" {
			log.FuncErrorTrace(0, "Failed to get slack_app_token for Record ID %v. Item: %+v\n", RecordId, item)
			SlackAppToken = ""
		}
		BotToken, ok := item["bot_token"].(string)
		if !ok || BotToken == "" {
			log.FuncErrorTrace(0, "Failed to get bot_token for Record ID %v. Item: %+v\n", RecordId, item)
			BotToken = ""
		}

		SlackConfig := models.GetSlackConfig{
			RecordId:      RecordId,
			ChannelName:   ChannelName,
			ChannelId:     ChannelId,
			IssueType:     IssueType,
			SlackAppToken: SlackAppToken,
			BotToken:      BotToken,
		}

		SlackConfigList.SlackConfigList = append(SlackConfigList.SlackConfigList, SlackConfig)
	}

	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of Slack Config List fetched : %v list %+v", len(SlackConfigList.SlackConfigList), SlackConfigList)
	appserver.FormAndSendHttpResp(resp, "Slack Config Data", http.StatusOK, SlackConfigList, RecordCount)
}
