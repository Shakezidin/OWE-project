/**************************************************************************
 * File       	   : apiGetProductionTargetsByYear.go
 * DESCRIPTION     : This file contains functions to get production targets
 * DATE            : 22-Dec-2024
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
 * FUNCTION:		HandleGetProductionTargetsByYearRequest
 * DESCRIPTION:     handler for get production targets by year request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetProductionTargetsByYearRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		query   string
		dataReq models.ProductionTargetsByYearReq
		apiResp []models.ProductionTargetsByYearRespItem
	)

	log.EnterFn(0, "HandleGetProductionTargetsByYearRequest")
	defer func() { log.ExitFn(0, "HandleGetProductionTargetsByYearRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request Body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request Body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request Body", http.StatusBadRequest, nil)
		return
	}

	query = fmt.Sprintf(`
		WITH months(n) AS (SELECT generate_series(1, 12))
		SELECT
			TRIM(TO_CHAR(TO_DATE(months.n::TEXT, 'MM'), 'Month')) AS month,
			COALESCE(p.projects_sold, 0) AS projects_sold,
			COALESCE(p.mw_sold, 0) AS mw_sold,
			COALESCE(p.install_ct, 0) AS install_ct,
			COALESCE(p.mw_installed, 0) AS mw_installed,
			COALESCE(p.batteries_ct, 0) AS batteries_ct
		FROM MONTHS
		LEFT JOIN %s p
		ON MONTHS.n = p.month AND p.year = $1
		ORDER BY MONTHS.n
	`, db.TableName_ProductionTargets)

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{dataReq.Year})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusBadRequest, nil)
		return
	}

	for _, item := range data {
		month, ok := item["month"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'month' Item: %+v\n", item)
			continue
		}

		projectsSold, ok := item["projects_sold"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'projects_sold' Item: %+v\n", item)
		}

		mwSold, ok := item["mw_sold"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'mw_sold' Item: %+v\n", item)
		}

		installCt, ok := item["install_ct"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'install_ct' Item: %+v\n", item)
		}

		mwInstalled, ok := item["mw_installed"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'mw_installed' Item: %+v\n", item)
		}

		batteriesCt, ok := item["batteries_ct"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'batteries_ct' Item: %+v\n", item)
		}

		apiResp = append(apiResp, models.ProductionTargetsByYearRespItem{
			Month:        month,
			ProjectsSold: projectsSold,
			MwSold:       mwSold,
			InstallCt:    installCt,
			MwInstalled:  mwInstalled,
			BatteriesCt:  batteriesCt,
		})
	}
	appserver.FormAndSendHttpResp(resp, "Production targets by year", http.StatusOK, apiResp)
}
