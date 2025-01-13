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
)

/******************************************************************************
 * FUNCTION:		HandleReportsTargetListRequest
 * DESCRIPTION:     handler for get reports Target data
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleReportsTargetListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                    error
		dataReq                models.GetReportsTargetReq
		query                  string
		whereEleList           []interface{}
		targetData             []map[string]interface{}
		acheivedData           []map[string]interface{}
		lastMonthPercentageMap map[string]float64
		apiResp                models.GetReportsTargetResp
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

	// query target data
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

	whereEleList = []interface{}{dataReq.Year}

	targetData, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusInternalServerError, nil)
		return
	}

	// query achieved data
	query = `
		WITH 
			MONTHS(N) AS (SELECT GENERATE_SERIES($1, $2)),
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

	acheivedData, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusInternalServerError, nil)
		return
	}

	var (
		// total target
		targetProjectsSold int64
		targetMwSold       float64
		targetInstallCt    int64
		targetMwInstalled  float64
		targetBatteriesCt  int64

		// total achieved
		achievedProjectsSold int64
		achievedMwSold       float64
		achievedInstallCt    int64
		achievedMwInstalled  float64
		achievedBatteriesCt  int64

		// percentage
		projectsSoldPct float64
		mwSoldPct       float64
		installCtPct    float64
		mwInstalledPct  float64
		batteriesCtPct  float64
	)

	for i := 0; i < 12; i++ {
		targetMonth, ok := targetData[i]["month"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get target month for index %+v", i)
			continue
		}

		targetProjectsSold += targetData[i]["projects_sold"].(int64)
		targetMwSold += targetData[i]["mw_sold"].(float64)
		targetInstallCt += targetData[i]["install_ct"].(int64)
		targetMwInstalled += targetData[i]["mw_installed"].(float64)
		targetBatteriesCt += targetData[i]["batteries_ct"].(int64)

		achievedProjectsSold += acheivedData[i]["projects_sold"].(int64)
		achievedMwSold += acheivedData[i]["mw_sold"].(float64)
		achievedInstallCt += acheivedData[i]["install_ct"].(int64)
		achievedMwInstalled += acheivedData[i]["mw_installed"].(float64)
		achievedBatteriesCt += acheivedData[i]["batteries_ct"].(int64)

		monthlyItem := models.GetReportsTargetRespMonthlyItem{Month: targetMonth}

		monthlyItem.Achieved = acheivedData[i][dataReq.TargetType]
		monthlyItem.Target = targetData[i][dataReq.TargetType]

		if targetMonth == dataReq.Month {

			// fetch/query last month data
			// if January is selected, query for last December
			if i == 0 {
				whereEleList = []interface{}{12, 12, fmt.Sprintf("(%s - 1)", dataReq.Year)}
				lastMonthAchieved, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to retrieve data from DB err %v", err)
					continue
				}
				if len(lastMonthAchieved) == 0 {
					log.FuncErrorTrace(0, "Failed to retrieve data from DB")
					continue
				}

				query = fmt.Sprintf("SELECT * FROM %s WHERE MONTH = 12 AND YEAR = (%s - 1)", db.TableName_ProductionTargets, dataReq.Year)
				lastMonthTarget, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)

				if err != nil {
					log.FuncErrorTrace(0, "Failed to retrieve data from DB err %v", err)
					continue
				}
				lastMonthPercentageMap = make(map[string]float64)

				if len(lastMonthTarget) > 0 {
					if lastMonthTarget[0]["projects_sold"].(int64) > 0 {
						lastMonthPercentageMap["projects_sold"] = float64(lastMonthAchieved[0]["projects_sold"].(int64)) / float64(lastMonthTarget[0]["projects_sold"].(int64)) * 100.00
					}
					if lastMonthTarget[0]["mw_sold"].(float64) > 0 {
						lastMonthPercentageMap["mw_sold"] = float64(lastMonthAchieved[0]["mw_sold"].(float64)) / float64(lastMonthTarget[0]["mw_sold"].(float64)) * 100.00
					}
					if lastMonthTarget[0]["install_ct"].(int64) > 0 {
						lastMonthPercentageMap["install_ct"] = float64(lastMonthAchieved[0]["install_ct"].(int64)) / float64(lastMonthTarget[0]["install_ct"].(int64)) * 100.00
					}
					if lastMonthTarget[0]["mw_installed"].(float64) > 0 {
						lastMonthPercentageMap["mw_installed"] = float64(lastMonthAchieved[0]["mw_installed"].(float64)) / float64(lastMonthTarget[0]["mw_installed"].(float64)) * 100.00
					}
					if lastMonthTarget[0]["batteries_ct"].(int64) > 0 {
						lastMonthPercentageMap["batteries_ct"] = float64(lastMonthAchieved[0]["batteries_ct"].(int64)) / float64(lastMonthTarget[0]["batteries_ct"].(int64)) * 100.00
					}
				}
			} else {
				lastMonthPercentageMap = make(map[string]float64)
				if targetData[i-1]["projects_sold"].(int64) > 0 {
					lastMonthPercentageMap["projects_sold"] = float64(acheivedData[i-1]["projects_sold"].(int64)) / float64(targetData[i-1]["projects_sold"].(int64)) * 100.00
				}
				if targetData[i-1]["mw_sold"].(float64) > 0 {
					lastMonthPercentageMap["mw_sold"] = float64(acheivedData[i-1]["mw_sold"].(float64)) / float64(targetData[i-1]["mw_sold"].(float64)) * 100.00
				}
				if targetData[i-1]["install_ct"].(int64) > 0 {
					lastMonthPercentageMap["install_ct"] = float64(acheivedData[i-1]["install_ct"].(int64)) / float64(targetData[i-1]["install_ct"].(int64)) * 100.00
				}
				if targetData[i-1]["mw_installed"].(float64) > 0 {
					lastMonthPercentageMap["mw_installed"] = float64(acheivedData[i-1]["mw_installed"].(float64)) / float64(targetData[i-1]["mw_installed"].(float64)) * 100.00
				}
				if targetData[i-1]["batteries_ct"].(int64) > 0 {
					lastMonthPercentageMap["batteries_ct"] = float64(acheivedData[i-1]["batteries_ct"].(int64)) / float64(targetData[i-1]["batteries_ct"].(int64)) * 100.00
				}
			}

			apiResp.Summary = map[string]models.GetReportsTargetRespSummaryItem{
				"Projects Sold": {
					Target:            targetData[i]["projects_sold"].(int64),
					Achieved:          acheivedData[i]["projects_sold"].(int64),
					LastMonthAcheived: lastMonthPercentageMap["projects_sold"],
				},
				"MW Sold": {
					Target:            targetData[i]["mw_sold"].(float64),
					Achieved:          acheivedData[i]["mw_sold"].(float64),
					LastMonthAcheived: lastMonthPercentageMap["mw_sold"],
				},
				"Installed Contracting": {
					Target:            targetData[i]["install_ct"].(int64),
					Achieved:          acheivedData[i]["install_ct"].(int64),
					LastMonthAcheived: lastMonthPercentageMap["install_ct"],
				},
				"MW Installed": {
					Target:            targetData[i]["mw_installed"].(float64),
					Achieved:          acheivedData[i]["mw_installed"].(float64),
					LastMonthAcheived: lastMonthPercentageMap["mw_installed"],
				},
				"Batteries": {
					Target:            targetData[i]["batteries_ct"].(int64),
					Achieved:          acheivedData[i]["batteries_ct"].(int64),
					LastMonthAcheived: lastMonthPercentageMap["batteries_ct"],
				},
			}
		}
	}

	if targetProjectsSold > 0 {
		projectsSoldPct = float64(achievedProjectsSold) / float64(targetProjectsSold) * 100
	}
	if targetMwSold > 0 {
		mwSoldPct = float64(achievedMwSold) / float64(targetMwSold) * 100
	}
	if targetInstallCt > 0 {
		installCtPct = float64(achievedInstallCt) / float64(targetInstallCt) * 100
	}
	if targetMwInstalled > 0 {
		mwInstalledPct = float64(achievedMwInstalled) / float64(targetMwInstalled) * 100
	}
	if targetBatteriesCt > 0 {
		batteriesCtPct = float64(achievedBatteriesCt) / float64(targetBatteriesCt) * 100
	}

	apiResp.Progress = map[string]models.GetReportsTargetRespProgressItem{
		"Projects Sold": {
			Target:             targetProjectsSold,
			Achieved:           achievedProjectsSold,
			PercentageAchieved: projectsSoldPct,
		},
		"mW Sold": {
			Target:             targetMwSold,
			Achieved:           achievedMwSold,
			PercentageAchieved: mwSoldPct,
		},
		"Installs": {
			Target:             targetInstallCt,
			Achieved:           achievedInstallCt,
			PercentageAchieved: installCtPct,
		},
		"mW Installed": {
			Target:             targetMwInstalled,
			Achieved:           achievedMwInstalled,
			PercentageAchieved: mwInstalledPct,
		},
		"Batteries": {
			Target:             targetBatteriesCt,
			Achieved:           achievedBatteriesCt,
			PercentageAchieved: batteriesCtPct,
		},
	}

	apiResp.MonthlyOverview = make(map[string]models.GetReportsTargetRespMonthlyItem)

	appserver.FormAndSendHttpResp(resp, "Report target data", http.StatusOK, apiResp)
}
