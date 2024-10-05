/**************************************************************************
* File			: apiGetLeadsCountByStatus.go
* DESCRIPTION	: This file contains functions for getting leads count by status
* DATE			: 19-sept-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetLeadsCountByStatusRequest
 * DESCRIPTION:     handler for getting leads count by status
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLeadsCountByStatusRequest(resp http.ResponseWriter, req *http.Request) {

	var (
		err         error
		apiResponse models.GetLeadsCountByStatusList
		data        []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetLeadsCountByStatus")
	defer func() { log.ExitFn(0, "HandleGetLeadsCountByStatus", err) }()

	authenticatedEmail, ok := req.Context().Value("emailid").(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get emailid from context")
		appserver.FormAndSendHttpResp(resp, "Failed to get leads count by status", http.StatusInternalServerError, nil)
		return
	}

	query := `
		SELECT s.status_id, s.status_name, grp.count 
		FROM (
			SELECT count(leads_info.*), leads_status.status_id
			FROM get_leads_info_hierarchy($1) leads_info
			RIGHT JOIN leads_status ON leads_info.status_id = leads_status.status_id
			GROUP BY leads_status.status_id
		) grp INNER JOIN leads_status s ON s.status_id = grp.status_id
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmail})

	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get leads count by status with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get leads count by status", http.StatusInternalServerError, nil)
		return
	}

	for _, item := range data {
		count, ok := item["count"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert count to int64 type Item: %+v", item)
			continue
		}
		statusName, ok := item["status_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert status_name to string type Item: %+v", item)
			continue
		}
		statusId, ok := item["status_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert status_id to int64 type Item: %+v", item)
			continue
		}
		apiResponse.Leads = append(apiResponse.Leads, models.GetLeadsCountByStatus{
			Count:      count,
			StatusName: statusName,
			StatusId:   statusId,
		})
	}

	log.FuncDebugTrace(0, "Retrieved leads count by status: %v", apiResponse.Leads)
	appserver.FormAndSendHttpResp(resp, "Get leads count by status", http.StatusOK, apiResponse)
}
