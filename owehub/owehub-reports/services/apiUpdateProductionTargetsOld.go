/**************************************************************************
 * File       	   : apiUpdateProductionTargets.go
 * DESCRIPTION     : This file contains functions to update production targets
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
	"strings"
)

/******************************************************************************
 * FUNCTION:		HandleUpdateProductionTargetsRequestOld
 * DESCRIPTION:     handler for update production targets request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateProductionTargetsRequestOld(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		dataReq            models.UpdateProductionTargetsReqOld
		whereEleList       []interface{}
		valuesPlaceholders []string
		query              string
		targetUserId       int64
	)

	log.EnterFn(0, "HandleUpdateProductionTargetsRequestOld")
	defer func() { log.ExitFn(0, "HandleUpdateProductionTargetsRequestOld", err) }()

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

	targetUserId, err = getProdTargetUserId(req.Context(), dataReq.AccountManager)
	if err != nil {
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusBadRequest, nil)
		return
	}

	// Construct the upsert query
	// Example:
	// INSERT INTO production_targets (month, year, target_percentage, projects_sold, mw_sold, install_ct, mw_installed, batteries_ct)
	// VALUES ($1, $2, $3, $4, $5, $6, $7), ($8, $9, $10, $11, $12, $13, $14)
	// ON CONFLICT (month, year, target_percentage) DO UPDATE SET
	// 	projects_sold = excluded.projects_sold,
	// 	mw_sold = excluded.mw_sold,
	// 	install_ct = excluded.install_ct,
	// 	mw_installed = excluded.mw_installed,
	// 	batteries_ct = excluded.batteries_ct

	for _, item := range dataReq.Targets {
		prevWhereLen := len(whereEleList)
		itemPlaceholders := []string{}

		whereEleList = append(whereEleList,
			item.Month,
			item.Year,
			dataReq.TargetPercentage,
			targetUserId,
			dataReq.State,
			item.ProjectsSold,
			item.MwSold,
			item.InstallCt,
			item.MwInstalled,
			item.BatteriesCt,
			item.NTP,
			item.MwNtp,
		)

		for i := prevWhereLen; i < len(whereEleList); i++ {
			itemPlaceholders = append(itemPlaceholders, fmt.Sprintf("$%d", i+1))
		}

		valuesPlaceholders = append(valuesPlaceholders, fmt.Sprintf("(%s)", strings.Join(itemPlaceholders, ", ")))
	}

	query = fmt.Sprintf(`
		INSERT INTO %s (month, year, target_percentage, user_id, state, projects_sold, mw_sold, install_ct, mw_installed, batteries_ct, ntp, mw_ntp)
		VALUES %s
		ON CONFLICT (month, year, target_percentage, user_id, state) DO UPDATE SET
			projects_sold = EXCLUDED.projects_sold,
			mw_sold = EXCLUDED.mw_sold,
			install_ct = EXCLUDED.install_ct,
			mw_installed = EXCLUDED.mw_installed,
			batteries_ct = EXCLUDED.batteries_ct,
			ntp = EXCLUDED.ntp,
			mw_ntp = EXCLUDED.mw_ntp
	`, db.TableName_ProductionTargets, strings.Join(valuesPlaceholders, ", "))

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to upsert data in DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update the production targets", http.StatusInternalServerError, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Production targets updated", http.StatusOK, nil)
}
