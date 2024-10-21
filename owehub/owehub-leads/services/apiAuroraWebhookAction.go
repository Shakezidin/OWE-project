/**************************************************************************
 *      Function        : apiAuroraWebhookAction.go
 *      DESCRIPTION     : This file contains functions to handle webhooks
 *						 for project status changed
 *      DATE            : 11-Sept-2024
 **************************************************************************/

package services

import (
	"net/http"

	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

/******************************************************************************
 * FUNCTION:        HandleAuroraWebhookAction
 *
 * DESCRIPTION:     function to handle webhooks for project status changed
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func HandleAuroraWebhookAction(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		auth         []string
		action       string
		query        string
		whereEleList []interface{}
	)

	log.EnterFn(0, "HandleAuroraWebhookAction")
	defer func() { log.ExitFn(0, "HandleAuroraWebhookAction", err) }()

	// MUST RESPOND ASAP
	appserver.FormAndSendHttpResp(resp, "Success", http.StatusOK, nil)

	auth = req.Header.Values("X-OWEHUB-AUTH")
	log.FuncErrorTrace(0, "Received Auth  : %v", auth)

	action = req.URL.Query().Get("action")

	if action == "project_status_changed" {
		status := req.URL.Query().Get("status")
		projectId := req.URL.Query().Get("project_id")

		query = `UPDATE leads_info SET aurora_proposal_status = $1 WHERE project_id = $2`
		whereEleList = []interface{}{status, projectId}

		err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update the proposal status in db : %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to update the proposal status in db", http.StatusInternalServerError, nil)
			return
		}

	}
	// if action == "project_created" {
	// 	projectId := req.URL.Query().Get("project_id")
	// 	source := req.URL.Query().Get("source")
	// }
}
