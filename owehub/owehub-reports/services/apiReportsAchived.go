/**************************************************************************
 * File       	   : apiReportTarget.go
 * DESCRIPTION     : This file contains functions to get report Target data
 * DATE            : 08-Jan-2025
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
	"strconv"
)

/******************************************************************************
 * FUNCTION:		HandleReportsTargetListRequest
 * DESCRIPTION:     handler for get reports Target data
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleReportsTargetListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err               error
		dataReq           models.GetReportsTargetReq
		yearInt           int
		targetQuery       string
		acheivedQuery     string
		whereEleList      []interface{}
		targetData        []map[string]interface{}
		acheivedData      []map[string]interface{}
		totalTarget       models.ProductionTargetOrAchievedItem
		totalAchieved     models.ProductionTargetOrAchievedItem
		totalPct          *models.ProductionTargetOrAchievedPercentage
		lastMonthAchieved *models.ProductionTargetOrAchievedItem
		lastMonthTarget   *models.ProductionTargetOrAchievedItem
		lastMonthPct      *models.ProductionTargetOrAchievedPercentage
		apiResp           models.GetReportsTargetResp
	)

	log.EnterFn(0, "HandleReportsTargetListRequest")
	defer func() { log.ExitFn(0, "HandleReportsTargetListRequest", err) }()

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

	yearInt, err = strconv.Atoi(dataReq.Year)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request Body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request Body", http.StatusBadRequest, nil)
		return
	}

	// query target data
	targetQuery = fmt.Sprintf(`
		WITH months(n) AS (SELECT generate_series($1::INT, $2::INT))
		SELECT
			TRIM(TO_CHAR(TO_DATE(months.n::TEXT, 'MM'), 'Month')) AS month,
			(COALESCE(p.projects_sold, 0) * ($3 / 100))::INT AS projects_sold,
			COALESCE(p.mw_sold, 0) * ($3 / 100) AS mw_sold,
			(COALESCE(p.install_ct, 0) * ($3 / 100))::INT AS install_ct,
			COALESCE(p.mw_installed, 0) * ($3 / 100) AS mw_installed,
			(COALESCE(p.batteries_ct, 0) * ($3 / 100))::INT AS batteries_ct
		FROM MONTHS
		LEFT JOIN %s p
		ON MONTHS.n = p.month AND p.year = $2
		ORDER BY MONTHS.n
	`, db.TableName_ProductionTargets)

	whereEleList = []interface{}{1, 12, dataReq.TargetPercentage, dataReq.Year}

	targetData, err = db.ReteriveFromDB(db.OweHubDbIndex, targetQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusInternalServerError, nil)
		return
	}

	// query achieved data
	acheivedQuery = `
		WITH 
			MONTHS(N) AS (SELECT GENERATE_SERIES($1::INT, $2::INT)),
			PROJECTS_SOLD AS (
				SELECT
					DATE_PART('MONTH', SALE_DATE) AS month,
					COUNT(DISTINCT UNIQUE_ID) AS val
				FROM CUSTOMERS_CUSTOMERS_SCHEMA
				WHERE DATE_PART('YEAR', SALE_DATE) = $3
				GROUP BY month
			),
			KW_SOLD AS (
				SELECT
					DATE_PART('MONTH', SALE_DATE) AS month,
					SUM(COALESCE(NULLIF(CONTRACTED_SYSTEM_SIZE, '')::FLOAT, 0)) AS val
				FROM CUSTOMERS_CUSTOMERS_SCHEMA
				WHERE DATE_PART('YEAR', SALE_DATE) = $3
				GROUP BY month
			),
			INSTALL_CT AS (
				SELECT
					DATE_PART('MONTH', PV_COMPLETION_DATE) AS month,
					COUNT(DISTINCT CUSTOMER_UNIQUE_ID) AS val
				FROM PV_INSTALL_INSTALL_SUBCONTRACTING_SCHEMA
				WHERE DATE_PART('YEAR', PV_COMPLETION_DATE) = $3
				GROUP BY month
			),
			KW_INSTALLED AS (
				SELECT
					DATE_PART('MONTH', PV_COMPLETION_DATE) AS month,
					SUM(COALESCE(NULLIF(SYSTEM_SIZE, '')::FLOAT, 0)) AS val
				FROM PV_INSTALL_INSTALL_SUBCONTRACTING_SCHEMA
				WHERE DATE_PART('YEAR', PV_COMPLETION_DATE) = $3
				GROUP BY month
			),
			BATTERIES_CT AS (
				SELECT
					DATE_PART('MONTH', TO_DATE(SALE_DATE, 'Dy Mon DD YYYY HH24:MI:SS')) AS month,
					SUM(COALESCE(NULLIF(BATTERY_QTY, '')::FLOAT, 0))::INTEGER AS val
				FROM PLANSET_CAD_SCHEMA
				WHERE SALE_DATE != '' AND
				DATE_PART('YEAR', TO_DATE(SALE_DATE, 'Dy Mon DD YYYY HH24:MI:SS')) = $3
				GROUP BY month
			)
		SELECT
			TRIM(TO_CHAR(TO_DATE(MONTHS.n::TEXT, 'MM'), 'Month')) AS month,
			COALESCE(PROJECTS_SOLD.val, 0) AS projects_sold,
			COALESCE(KW_SOLD.val, 0) / 1000 AS mw_sold,
			COALESCE(INSTALL_CT.val, 0) AS install_ct,
			COALESCE(KW_INSTALLED.val, 0) / 1000 AS mw_installed,
			COALESCE(BATTERIES_CT.val, 0) AS batteries_ct
		FROM MONTHS
		LEFT JOIN PROJECTS_SOLD ON PROJECTS_SOLD.MONTH = MONTHS.N
		LEFT JOIN KW_SOLD ON KW_SOLD.MONTH = MONTHS.N
		LEFT JOIN INSTALL_CT ON INSTALL_CT.MONTH = MONTHS.N
		LEFT JOIN KW_INSTALLED ON KW_INSTALLED.MONTH = MONTHS.N
		LEFT JOIN BATTERIES_CT ON BATTERIES_CT.MONTH = MONTHS.N
		ORDER BY MONTHS.N
	`
	whereEleList = []interface{}{1, 12, dataReq.Year}

	acheivedData, err = db.ReteriveFromDB(db.RowDataDBIndex, acheivedQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusInternalServerError, nil)
		return
	}

	for i := 0; i < 12; i++ {
		targetMonth, ok := targetData[i]["month"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get target month for index %+v", i)
			continue
		}
		target := getProductionTargetOrAchievedItem(targetData[i])
		acheived := getProductionTargetOrAchievedItem(acheivedData[i])

		// keep track of totals

		totalTarget.InstallCt += target.InstallCt
		totalTarget.MwInstalled += target.MwInstalled
		totalTarget.ProjectsSold += target.ProjectsSold
		totalTarget.MwSold += target.MwSold

		totalAchieved.InstallCt += acheived.InstallCt
		totalAchieved.MwInstalled += acheived.MwInstalled
		totalAchieved.ProjectsSold += acheived.ProjectsSold
		totalAchieved.MwSold += acheived.MwSold

		// get stats and overview data

		statsItem, overviewItem := getMonthlyStatsAndOverview(acheivedData[i][dataReq.TargetType], targetData[i][dataReq.TargetType], targetMonth == dataReq.Month)
		if overviewItem == nil || statsItem == nil {
			continue
		}
		overviewItem.Month = targetMonth
		statsItem.Month = targetMonth

		apiResp.MonthlyOverview = append(apiResp.MonthlyOverview, *overviewItem)
		apiResp.MonthlyStats = append(apiResp.MonthlyStats, *statsItem)

		// assign summary data for selected month
		if targetMonth == dataReq.Month {
			// begin FETCHING LAST MONTH DATA

			// if January is selected, fetch from last year December
			if i == 0 {
				whereEleList = []interface{}{12, 12, yearInt - 1}
				rawAcheived, err := db.ReteriveFromDB(db.RowDataDBIndex, acheivedQuery, whereEleList)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to retrieve data from DB err %v", err)
					continue
				}

				whereEleList = []interface{}{12, 12, dataReq.TargetPercentage, yearInt - 1}
				rawTarget, err := db.ReteriveFromDB(db.OweHubDbIndex, targetQuery, whereEleList)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to retrieve data from DB err %v", err)
					continue
				}

				lastMonthAchieved = getProductionTargetOrAchievedItem(rawAcheived[0])
				lastMonthTarget = getProductionTargetOrAchievedItem(rawTarget[0])
			} else {
				lastMonthAchieved = getProductionTargetOrAchievedItem(acheivedData[i-1])
				lastMonthTarget = getProductionTargetOrAchievedItem(targetData[i-1])
			}
			// end FETCHING LAST MONTH DATA

			lastMonthPct = getProductionAchievedPercentage(lastMonthTarget, lastMonthAchieved)
			apiResp.Summary = map[string]models.GetReportsTargetRespSummaryItem{
				"Projects Sold": {
					Target:            target.ProjectsSold,
					Achieved:          acheived.ProjectsSold,
					LastMonthAcheived: lastMonthPct.ProjectsSold,
				},
				"mW Sold": {
					Target:            target.MwSold,
					Achieved:          acheived.MwSold,
					LastMonthAcheived: lastMonthAchieved.MwSold,
				},
				"Install Ct": {
					Target:            target.InstallCt,
					Achieved:          acheived.InstallCt,
					LastMonthAcheived: lastMonthPct.InstallCt,
				},
				"mW Installed": {
					Target:            target.MwInstalled,
					Achieved:          acheived.MwInstalled,
					LastMonthAcheived: lastMonthPct.MwInstalled,
				},
				"Batteries Ct": {
					Target:            target.BatteriesCt,
					Achieved:          acheived.BatteriesCt,
					LastMonthAcheived: lastMonthPct.BatteriesCt,
				},
			}
		}
	}

	totalPct = getProductionAchievedPercentage(&totalTarget, &totalAchieved)
	apiResp.Progress = map[string]models.GetReportsTargetRespProgressItem{
		"Projects Sold": {
			Target:             totalTarget.ProjectsSold,
			Achieved:           totalAchieved.ProjectsSold,
			PercentageAchieved: totalPct.ProjectsSold,
		},
		"mW Sold": {
			Target:             totalTarget.MwSold,
			Achieved:           totalAchieved.MwSold,
			PercentageAchieved: totalPct.MwSold,
		},
		"Install Ct": {
			Target:             totalTarget.InstallCt,
			Achieved:           totalAchieved.InstallCt,
			PercentageAchieved: totalPct.InstallCt,
		},
		"mW Installed": {
			Target:             totalTarget.MwInstalled,
			Achieved:           totalAchieved.MwInstalled,
			PercentageAchieved: totalPct.MwInstalled,
		},
		"Batteries Ct": {
			Target:             totalTarget.BatteriesCt,
			Achieved:           totalAchieved.BatteriesCt,
			PercentageAchieved: totalPct.BatteriesCt,
		},
	}

	appserver.FormAndSendHttpResp(resp, "Report target data", http.StatusOK, apiResp)
}

// Extract and Assert Production Target or Production Achieved keys to relevant numeric types from the raw db record
func getProductionTargetOrAchievedItem(rawRecord map[string]interface{}) *models.ProductionTargetOrAchievedItem {
	var (
		item models.ProductionTargetOrAchievedItem
		err  error
	)

	log.EnterFn(0, "HandleReportsTargetListRequest")
	defer func() { log.ExitFn(0, "HandleReportsTargetListRequest", err) }()

	projectsSold, ok := rawRecord["projects_sold"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast projects_sold from type %T to int64", rawRecord["projects_sold"])
	}

	mwSold, ok := rawRecord["mw_sold"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast mw_sold from type %T to float64", rawRecord["mw_sold"])
	}

	installCt, ok := rawRecord["install_ct"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast install_ct from type %T to int64", rawRecord["install_ct"])

	}

	mwInstalled, ok := rawRecord["mw_installed"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast mw_installed from type %T to float64", rawRecord["mw_installed"])
	}

	batteriesCt, ok := rawRecord["batteries_ct"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast batteries_ct from type %T to int64", rawRecord["batteries_ct"])
	}

	item.ProjectsSold = projectsSold
	item.MwSold = mwSold
	item.InstallCt = installCt
	item.MwInstalled = mwInstalled
	item.BatteriesCt = batteriesCt
	return &item
}

// Get Monthly Stats(Completed, Incomplete, In Progress) and Overview(Target, Achieved)
// for a given month by given 2 numerics: target and achieved
//
// Specific to HandleReportsTargetListRequest api
func getMonthlyStatsAndOverview(target interface{}, achieved interface{}, isSelectedMonth bool) (
	*models.GetReportsTargetRespStatsItem, *models.GetReportsTargetRespOverviewItem) {
	var (
		targetFloat   float64
		achievedFloat float64
		isInt         bool
		statsItem     models.GetReportsTargetRespStatsItem
		overviewItem  models.GetReportsTargetRespOverviewItem
		ok            bool
	)

	overviewItem.Achieved = achieved
	overviewItem.Target = target

	// first convert target and achieved to float64 if not already for easier comparision

	if targetFloat, ok = target.(float64); !ok {
		isInt = true
		targetInt, ok := target.(int64)
		if !ok {
			log.FuncErrorTrace(0, "target is not an int64 or float64")
			return nil, nil
		}
		targetFloat = float64(targetInt)
	}

	if achievedFloat, ok = achieved.(float64); !ok {
		isInt = true
		achievedInt, ok := achieved.(int64)
		if !ok {
			log.FuncErrorTrace(0, "achieved is not an int64 or float64")
			return nil, nil
		}
		achievedFloat = float64(achievedInt)
	}

	statsItem.Target = target

	if isSelectedMonth {
		statsItem.Inprogress = achieved
		return &statsItem, &overviewItem
	}

	if achievedFloat > targetFloat {
		statsItem.MoreThanTarget = achievedFloat - targetFloat

		// cast to int64 if target and achieved are int64
		if isInt {
			statsItem.MoreThanTarget = int64(statsItem.MoreThanTarget.(float64))
		}
		return &statsItem, &overviewItem
	}

	statsItem.Incomplete = targetFloat - achievedFloat

	// cast to int64 if target and achieved are int64
	if isInt {
		statsItem.Incomplete = int64(statsItem.Incomplete.(float64))
	}
	statsItem.Completed = achievedFloat
	return &statsItem, &overviewItem
}

// Calculate Production Achieved percentage (target/achieved * 100)
func getProductionAchievedPercentage(target *models.ProductionTargetOrAchievedItem,
	acheived *models.ProductionTargetOrAchievedItem) *models.ProductionTargetOrAchievedPercentage {
	var (
		pct models.ProductionTargetOrAchievedPercentage
	)

	if target == nil || acheived == nil {
		return &pct
	}

	if target.ProjectsSold > 0 {
		pct.ProjectsSold = float64(acheived.ProjectsSold) / float64(target.ProjectsSold) * 100
	}

	if target.MwSold > 0 {
		pct.MwSold = float64(acheived.MwSold) / float64(target.MwSold) * 100
	}

	if target.InstallCt > 0 {
		pct.InstallCt = float64(acheived.InstallCt) / float64(target.InstallCt) * 100
	}

	if target.MwInstalled > 0 {
		pct.MwInstalled = float64(acheived.MwInstalled) / float64(target.MwInstalled) * 100
	}

	if target.BatteriesCt > 0 {
		pct.BatteriesCt = float64(acheived.BatteriesCt) / float64(target.BatteriesCt) * 100
	}
	return &pct
}
