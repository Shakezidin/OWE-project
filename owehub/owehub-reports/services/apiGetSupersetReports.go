/**************************************************************************
 * File       	   : apiGetSupersetReports.go
 * DESCRIPTION     : This file contains functions to get superset reports
 * DATE            : 22-Dec-2024
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
 * FUNCTION:		HandleGetSupersetReportsRequest
 * DESCRIPTION:     handler for get superset reports request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetSupersetReportsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		query   string
		data    []map[string]interface{}
		apiResp models.GetSupersetReportsResponse
	)

	log.EnterFn(0, "HandleGetSupersetReportsRequest")
	defer func() { log.ExitFn(0, "HandleGetSupersetReportsRequest", err) }()

	query = `
		SELECT
			id,
			category,
			title,
			subtitle,
			dashboard_id
		FROM
			superset_reports
		WHERE
			is_archived = FALSE
		ORDER BY
			created_at DESC
	`

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get superset reports from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get superset reports", http.StatusInternalServerError, nil)
		return
	}

	// map reports by category
	apiResp = make(models.GetSupersetReportsResponse)
	for _, item := range data {
		cat, ok := item["category"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert category to string from type %T", item["category"])
			continue
		}

		id, ok := item["id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert id to int64 from type %T", item["id"])
			continue
		}

		title, ok := item["title"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert title to string from type %T", item["title"])
			continue
		}

		subtitle, ok := item["subtitle"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert subtitle to string from type %T", item["subtitle"])
			continue
		}

		dashboardId, ok := item["dashboard_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert dashboard_id to string from type %T", item["dashboard_id"])
			continue
		}

		apiResp[cat] = append(apiResp[cat], models.GetSupersetReportsResponseItem{
			Id:          id,
			Title:       title,
			Subtitle:    subtitle,
			DashboardId: dashboardId,
		})
	}

	appserver.FormAndSendHttpResp(resp, "Superset reports", http.StatusOK, apiResp, int64(len(data)))
}
