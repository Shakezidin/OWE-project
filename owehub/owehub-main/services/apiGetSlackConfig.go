/**************************************************************************
 * File       	   : apiGetSlackConfig.go
 * DESCRIPTION     : This file contains functions for get Slack Config data handler
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
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
		err             error
		dataReq         models.DataRequestBody
		data            []map[string]interface{}
		whereEleList    []interface{}
		query           string
		queryWithFiler  string
		queryForAlldata string
		filter          string
		RecordCount     int64
	)

	log.EnterFn(0, "HandleGetSlackConfigRequest")
	defer func() { log.ExitFn(0, "HandleGetSlackConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Slack Config data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Slack Config data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Slack Config data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Slack Config data Request body", http.StatusBadRequest, nil)
		return
	}

	query = `SELECT 
		 ap.id as record_id, ap.issue_type, ap.channel_name, ap.bot_token, ap.slack_app_token
		 FROM ` + db.TableName_slackconfig + ` ap`

	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Slack Config data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Slack Config data from DB", http.StatusBadRequest, nil)
		return
	}

	SlackConfigList := models.GetSlackConfigList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		IssueType, ok := item["issue_type"].(string)
		if !ok || IssueType == "" {
			log.FuncErrorTrace(0, "Failed to get name for Record ID %v. Item: %+v\n", RecordId, item)
			IssueType = ""
		}
		ChannelName, ok := item["channel_name"].(string)
		if !ok || ChannelName == "" {
			log.FuncErrorTrace(0, "Failed to get month for Record ID %v. Item: %+v\n", RecordId, item)
			ChannelName = ""
		}

		SlackConfig := models.GetSlackConfig{
			RecordId:      RecordId,
			ChannelName:   ChannelName,
			IssueType:     IssueType,
		}

		SlackConfigList.SlackConfigList = append(SlackConfigList.SlackConfigList, SlackConfig)
	}


	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Slack Config data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Slack Config data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of Slack Config List fetched : %v list %+v", len(SlackConfigList.SlackConfigList), SlackConfigList)
	FormAndSendHttpResp(resp, "Slack Config Data", http.StatusOK, SlackConfigList, RecordCount)
}
 
 