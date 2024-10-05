/**************************************************************************
* File			: 	apiArchiveSlackConfig.go
* DESCRIPTION	: This file contains functions to archive Slack Config handler
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
 * FUNCTION:				HandleArchiveSlackConfigRequest
 * DESCRIPTION:     handler to archive Slack Config request
 * INPUT:						resp, req
 * RETURNS:    			void
 ******************************************************************************/
func HandleArchiveSlackConfigRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		archiveSlackConfigReq models.ArchiveSlackConfig
		queryParameters       []interface{}
	)

	log.EnterFn(0, "HandleArchiveSlackConfigRequest")
	defer func() { log.ExitFn(0, "HandleArchiveSlackConfigRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in archive Slack Config request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from archive Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &archiveSlackConfigReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal archive Slack Config request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal archive slack config request", http.StatusBadRequest, nil)
		return
	}
	if len(archiveSlackConfigReq.RecordId) <= 0 {
		err = fmt.Errorf("record Id is empty, unable to proceed")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Record Id is empty,  archive failed", http.StatusBadRequest, nil)
		return
	}

	queryParameters = append(queryParameters, pq.Array(archiveSlackConfigReq.RecordId))
	queryParameters = append(queryParameters, archiveSlackConfigReq.IsArchived)

	// Call the database function
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.UpdateSlackConfigArchiveFuntion, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to archive slack_config in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to archive slack_config", http.StatusInternalServerError, nil)
		return
	}

	log.DBTransDebugTrace(0, "slack config archived with id Id: %v", archiveSlackConfigReq.RecordId)
	appserver.FormAndSendHttpResp(resp, "Slack config archived Successfully", http.StatusOK, nil)
}
