/**************************************************************************
* File			: apiGetLeadsCountByStatus.go
* DESCRIPTION	: This file contains functions for getting leads count by status
* DATE			: 19-sept-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"time"
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
		dataReq     models.GetLeadsCountByStatusRequest
		reqBody     []byte
		data        []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetLeadsCountByStatus")
	defer func() { log.ExitFn(0, "HandleGetLeadsCountByStatus", err) }()

	authenticatedEmail, ok := req.Context().Value("emailid").(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get emailid from context")
		FormAndSendHttpResp(resp, "Failed to get leads count by status", http.StatusInternalServerError, nil)
		return
	}

	reqBody, err = ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get leads count by status data req err:  %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get leads count by status request body err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal request body", http.StatusBadRequest, nil)
		return
	}

	startDate, err := time.Parse("02-01-2006", dataReq.StartDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse start date err: %v", err)
		FormAndSendHttpResp(resp, "Failed to parse start date", http.StatusBadRequest, nil)
		return
	}
	endDate, err := time.Parse("02-01-2006", dataReq.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse end date err: %v", err)
		FormAndSendHttpResp(resp, "Failed to parse end date", http.StatusBadRequest, nil)
		return
	}

	startDate = time.Date(startDate.Year(), startDate.Month(), startDate.Day(), 0, 0, 0, 0, time.UTC)
	endDate = time.Date(endDate.Year(), endDate.Month(), endDate.Day(), 23, 59, 59, 0, time.UTC)

	whereEleList := []interface{}{authenticatedEmail, startDate, endDate}
	query := `
		SELECT s.status_id, s.status_name, grp.count 
		FROM (
			SELECT count(leads_info.*), leads_status.status_id
			FROM get_leads_info_hierarchy($1) leads_info
			RIGHT JOIN leads_status 
				ON leads_info.status_id = leads_status.status_id 
				AND leads_info.updated_at BETWEEN $2 AND $3
				AND leads_info.is_archived = false
				AND (leads_info.status_id != 2 OR leads_info.appointment_date > CURRENT_TIMESTAMP)
			GROUP BY leads_status.status_id
			HAVING leads_status.status_id NOT IN (5, 6) -- Excluding WON & LOST
		) grp INNER JOIN leads_status s ON s.status_id = grp.status_id
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil || len(data) <= 0 {
		log.FuncErrorTrace(0, "Failed to get leads count by status with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get leads count by status", http.StatusInternalServerError, nil)
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

		// Special case for status_id = 4 (Action Needed)
		if statusId == 4 {
			query = `
				SELECT count(li.*) FROM get_leads_info_hierarchy($1) li
				WHERE (
					(li.status_id = 5 AND li.proposal_created_date IS NULL)
					OR (li.status_id = 2 AND li.appointment_date < CURRENT_TIMESTAMP)
				) AND li.updated_at BETWEEN $2 AND $3 AND li.is_archived = false
			`

			data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
			if err != nil || len(data) <= 0 {
				log.FuncErrorTrace(0, "Failed to get action neeeded leads count with err: %v", err)
			} else {
				actionNeededCount, ok := data[0]["count"].(int64)
				if ok {
					count += actionNeededCount
				}
			}

		}
		apiResponse.Leads = append(apiResponse.Leads, models.GetLeadsCountByStatus{
			Count:      count,
			StatusName: statusName,
			StatusId:   statusId,
		})
	}

	log.FuncDebugTrace(0, "Retrieved leads count by status: %v", apiResponse.Leads)
	FormAndSendHttpResp(resp, "Get leads count by status", http.StatusOK, apiResponse)
}
