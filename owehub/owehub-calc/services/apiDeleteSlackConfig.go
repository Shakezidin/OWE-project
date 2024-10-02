/**************************************************************************
* File			: 	apiDeleteSlackConfig.go
* DESCRIPTION	: This file contains functions to delete Slack Config handler
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

	"net/http"

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:				HandleDeleteSlackConfigRequest
 * DESCRIPTION:     handler to delete Slack Config request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleDeleteSlackConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		deleteSlackConfigReq models.DeleteSlackConfig
		query                string
		whereEleList         []interface{}
		deletedRows          int64
	)

	log.EnterFn(0, "HandleDeleteSlackConfig")
	defer func() { log.ExitFn(0, "HandleDeleteSlackConfig", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in delete Slack Config request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from delete Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &deleteSlackConfigReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal delete Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal delete slack config request", http.StatusBadRequest, nil)
		return
	}

	query = fmt.Sprintf("DELETE FROM %s WHERE id = ANY($1)", db.TableName_slackconfig)
	whereEleList = append(whereEleList, pq.Array(deleteSlackConfigReq.RecordId))

	err, deletedRows = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete slack config data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to delete slack config Data from DB", http.StatusBadRequest, nil)
		return
	}

	log.DBTransDebugTrace(0, "Total %d slack config deleted with record ids: %v", deletedRows, deleteSlackConfigReq.RecordId)
	appserver.FormAndSendHttpResp(resp, "Delete slack config successfully", http.StatusOK, deletedRows)
}
