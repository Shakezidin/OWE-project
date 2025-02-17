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
	"OWEApp/shared/types"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
	"strings"
)

/******************************************************************************
 * FUNCTION:		HandleReportsTargetListRequest
 * DESCRIPTION:     handler for get reports Target data
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleReportsTargetListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		dataReq            models.GetReportsTargetReq
		yearInt            int
		targetUserId       int64
		accountManagerName string
		targetStateCnd     string
		targetQuery        string
		acheivedQuery      string
		whereEleList       []interface{}
		targetData         []map[string]interface{}
		acheivedData       []map[string]interface{}
		lastMonthAchieved  *models.ProductionTargetOrAchievedItem
		lastMonthTarget    *models.ProductionTargetOrAchievedItem
		lastMonthPct       *models.ProductionTargetOrAchievedPercentage
		thisMonthPct       *models.ProductionTargetOrAchievedPercentage
		apiResp            models.GetReportsTargetResp
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

	targetUserId, err = getProdTargetUserId(req.Context(), dataReq.AccountManager)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get user id for %s, err: %v", dataReq.AccountManager, err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusBadRequest, nil)
		return
	}

	// get account manager name (if admin, then get from request body, else get name of authenticated user)

	authenticatedRole := req.Context().Value("rolename").(string)
	authenticatedEmail := req.Context().Value("emailid").(string)

	if authenticatedRole == string(types.RoleAdmin) {
		accountManagerName = dataReq.AccountManager
	}

	// if authenticated user is account manager, get account manager name from db
	if authenticatedRole == string(types.RoleAccountManager) {
		query := "SELECT name FROM user_details WHERE email_id = $1"
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmail})
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get account manager name from db err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get account manager name from db", http.StatusBadRequest, nil)
			return
		}
		if len(data) == 0 {
			log.FuncErrorTrace(0, "Failed to get account manager name from db")
			appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusBadRequest, nil)
			return
		}
		accountManagerName = data[0]["name"].(string)
	}

	targetStateCnd = "p.state = $6"

	// if "all" state and "all" AM selected, show sum of all states, i.e. company wide goals
	if authenticatedRole == string(types.RoleAdmin) && strings.ToLower(dataReq.AccountManager) == "all" &&
		strings.ToLower(dataReq.State) == "all" {
		targetStateCnd = "$6 = $6" // TRUE; no need to check state
	}

	// Query to retrieve production targets
	targetQuery = fmt.Sprintf(`
		WITH months(n) AS (SELECT generate_series($1::INT, $2::INT))
		SELECT
			TRIM(TO_CHAR(TO_DATE(months.n::TEXT, 'MM'), 'Month')) AS month,
			COALESCE(SUM(p.projects_sold), 0) AS projects_sold,
			COALESCE(SUM(p.mw_sold), 0) AS mw_sold,
			COALESCE(SUM(p.install_ct), 0) AS install_ct,
			COALESCE(SUM(p.mw_installed), 0) AS mw_installed,
			COALESCE(SUM(p.batteries_ct), 0) AS batteries_ct,
			COALESCE(SUM(p.ntp), 0) AS ntp
		FROM months
		LEFT JOIN production_targets p
		ON months.n = p.month AND p.target_percentage = $3 AND p.year = $4 AND p.user_id = $5 AND %s
		GROUP BY months.n
		ORDER BY months.n
	`, targetStateCnd)

	whereEleList = []interface{}{1, 12, dataReq.TargetPercentage, dataReq.Year, targetUserId, dataReq.State}
	targetData, err = db.ReteriveFromDB(db.OweHubDbIndex, targetQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusBadRequest, nil)
		return
	}

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusInternalServerError, nil)
		return
	}

	acheivedQuery = `
WITH MONTHS(N) AS (SELECT GENERATE_SERIES($1::INT, $2::INT)),
     STATES AS (
        SELECT STATE_ID AS STATES FROM STATES_DB_DATABASE_HUB_SCHEMA
        WHERE CASE WHEN LOWER($4) = 'all' THEN TRUE
        ELSE STATE_NAME = $4 END
        UNION SELECT '' WHERE LOWER($4) = 'all'
     ),
     AM AS (
        SELECT DISTINCT SALES_PARTNER_NAME AS DEALER
        FROM SALES_PARTNER_DBHUB_SCHEMA
        WHERE CASE WHEN LOWER($5) = 'all' THEN TRUE
        ELSE ACCOUNT_MANAGER = $5 END
        UNION SELECT '' WHERE LOWER($5) = 'all'
     ),
     CUSTOMERS AS (
        SELECT
            DATE_PART('MONTH', C.SALE_DATE) AS month,
            COUNT(DISTINCT C.UNIQUE_ID) AS projects_sold,
            SUM(COALESCE(NULLIF(C.CONTRACTED_SYSTEM_SIZE, '')::FLOAT, 0)) / 1000 AS mw_sold  
        FROM CUSTOMERS_CUSTOMERS_SCHEMA C
        WHERE DATE_PART('YEAR', C.SALE_DATE) = $3
            AND C.PROJECT_STATUS NOT ILIKE '%DUPLICATE%'
            AND C.UNIQUE_ID IS NOT NULL
            AND C.UNIQUE_ID != ''
            AND C.DEALER IN (SELECT DEALER FROM AM)
            AND C.STATE IN (SELECT STATES FROM STATES)
        GROUP BY month
     ),
     PV AS (
        SELECT
            DATE_PART('MONTH', P.PV_COMPLETION_DATE) AS month,
            COUNT(*) AS install_ct,
            SUM(COALESCE(NULLIF(P.SYSTEM_SIZE, '')::FLOAT, 0)) / 1000 AS mw_installed  
        FROM PV_INSTALL_INSTALL_SUBCONTRACTING_SCHEMA AS P
        WHERE DATE_PART('YEAR', P.PV_COMPLETION_DATE) = $3
            AND P.APP_STATUS NOT ILIKE '%DUPLICATE%'
            AND P.PROJECT_STATUS NOT ILIKE '%DUPLICATE%'
            AND P.CUSTOMER_UNIQUE_ID IS NOT NULL
            AND P.CUSTOMER_UNIQUE_ID != ''
            AND P.DEALER IN (SELECT DEALER FROM AM)
            AND P.STATE IN (SELECT STATES FROM STATES)
        GROUP BY month
     ),
     NTP AS (
        SELECT
            DATE_PART('MONTH', P.PV_COMPLETION_DATE) AS month,
            SUM((LENGTH(adder_breakdown_total) - LENGTH(REGEXP_REPLACE(adder_breakdown_total, 'powerwall', '', 'gi'))) 
                / LENGTH('powerwall')) 
            + SUM((LENGTH(adder_breakdown_total) - LENGTH(REGEXP_REPLACE(adder_breakdown_total, 'enphase battery', '', 'gi')))
                / LENGTH('enphase battery')) AS batteries_ct
        FROM PV_INSTALL_INSTALL_SUBCONTRACTING_SCHEMA AS P
        LEFT JOIN NTP_NTP_SCHEMA AS N
        ON N.UNIQUE_ID = P.CUSTOMER_UNIQUE_ID
        WHERE DATE_PART('YEAR', P.PV_COMPLETION_DATE) = $3
            AND P.APP_STATUS NOT ILIKE '%DUPLICATE%'
            AND P.PROJECT_STATUS NOT ILIKE '%DUPLICATE%'
            AND N.APP_STATUS NOT ILIKE '%DUPLICATE%'
            AND N.PROJECT_STATUS NOT ILIKE '%DUPLICATE%'
            AND P.CUSTOMER_UNIQUE_ID IS NOT NULL
            AND P.CUSTOMER_UNIQUE_ID != ''
            AND P.DEALER IN (SELECT DEALER FROM AM)
            AND P.STATE IN (SELECT STATES FROM STATES)
        GROUP BY month
     ),
     NTP_NEW AS (
        SELECT
            DATE_PART('MONTH', N.ntp_complete_date) AS month,
            COUNT(N.ntp_complete_date) AS ntp_ct
        FROM NTP_NTP_SCHEMA AS N
        WHERE DATE_PART('YEAR', N.ntp_complete_date) = $3
            AND N.APP_STATUS NOT ILIKE '%DUPLICATE%'
            AND N.PROJECT_STATUS NOT ILIKE '%DUPLICATE%'
            AND N.UNIQUE_ID IS NOT NULL
            AND N.UNIQUE_ID != ''
            AND N.DEALER IN (SELECT DEALER FROM AM)
            AND N.STATE IN (SELECT STATES FROM STATES)
        GROUP BY month
     )

SELECT
    TRIM(TO_CHAR(TO_DATE(MONTHS.n::TEXT, 'MM'), 'Month')) AS month,
    COALESCE(CUSTOMERS.projects_sold, 0)::FLOAT AS projects_sold,
    COALESCE(CUSTOMERS.mw_sold, 0) AS mw_sold,  
    COALESCE(PV.install_ct, 0)::FLOAT AS install_ct,
    COALESCE(PV.mw_installed, 0) AS mw_installed,  
    COALESCE(NTP.batteries_ct, 0)::FLOAT AS batteries_ct,
    COALESCE(NTP_NEW.ntp_ct, 0)::FLOAT AS ntp
FROM MONTHS
LEFT JOIN CUSTOMERS ON CUSTOMERS.month = MONTHS.n
LEFT JOIN PV ON PV.month = MONTHS.n
LEFT JOIN NTP ON NTP.month = MONTHS.n
LEFT JOIN NTP_NEW ON NTP_NEW.month = MONTHS.n
ORDER BY MONTHS.n

	 `
	whereEleList = []interface{}{1, 12, dataReq.Year, dataReq.State, accountManagerName}
	acheivedData, err = db.ReteriveFromDB(db.RowDataDBIndex, acheivedQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusInternalServerError, nil)
		return
	}
	log.FuncDebugTrace(0, "this is data achievd from db %#v", acheivedData)
	for i := 0; i < 12; i++ {
		targetMonth, ok := targetData[i]["month"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get target month for index %+v", i)
			continue
		}
		target := getProductionTargetOrAchievedItem(targetData[i])
		acheived := getProductionTargetOrAchievedItem(acheivedData[i])

		// get stats and overview data
		statsItem, overviewItem := getMonthlyStatsAndOverview(
			targetData[i][dataReq.TargetType].(float64),
			acheivedData[i][dataReq.TargetType].(float64),
			targetMonth == dataReq.Month)

		overviewItem.Month = targetMonth
		statsItem.Month = targetMonth

		apiResp.MonthlyOverview = append(apiResp.MonthlyOverview, *overviewItem)
		apiResp.MonthlyStats = append(apiResp.MonthlyStats, *statsItem)

		// assign summary data for selected month
		if targetMonth == dataReq.Month {
			// begin FETCHING LAST MONTH DATA

			// if January is selected, fetch from last year December
			if i == 0 {
				whereEleList = []interface{}{12, 12, yearInt - 1, dataReq.State, accountManagerName}
				rawAcheived, err := db.ReteriveFromDB(db.RowDataDBIndex, acheivedQuery, whereEleList)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to retrieve data from DB err %v", err)
					continue
				}

				whereEleList = []interface{}{12, 12, dataReq.TargetPercentage, yearInt - 1, targetUserId, dataReq.State}
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
					LastMonthAcheived: lastMonthPct.MwSold,
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
				"Batteries Installed": {
					Target:            target.BatteriesCt,
					Achieved:          acheived.BatteriesCt,
					LastMonthAcheived: lastMonthPct.BatteriesCt,
				},
				"ntp": {
					Target:            target.NTP,
					Achieved:          acheived.NTP,
					LastMonthAcheived: lastMonthPct.NTP,
				},
			}

			thisMonthPct = getProductionAchievedPercentage(target, acheived)
			apiResp.Progress = map[string]models.GetReportsTargetRespProgressItem{
				"Projects Sold": {
					Target:             target.ProjectsSold,
					Achieved:           acheived.ProjectsSold,
					PercentageAchieved: thisMonthPct.ProjectsSold,
				},
				"mW Sold": {
					Target:             target.MwSold,
					Achieved:           acheived.MwSold,
					PercentageAchieved: thisMonthPct.MwSold,
				},
				"Install Ct": {
					Target:             target.InstallCt,
					Achieved:           acheived.InstallCt,
					PercentageAchieved: thisMonthPct.InstallCt,
				},
				"mW Installed": {
					Target:             target.MwInstalled,
					Achieved:           acheived.MwInstalled,
					PercentageAchieved: thisMonthPct.MwInstalled,
				},
				"Batteries Installed": {
					Target:             target.BatteriesCt,
					Achieved:           acheived.BatteriesCt,
					PercentageAchieved: thisMonthPct.BatteriesCt,
				},
				"ntp": {
					Target:             target.NTP,
					Achieved:           acheived.NTP,
					PercentageAchieved: thisMonthPct.NTP,
				},
			}
		}
	}

	appserver.FormAndSendHttpResp(resp, "Report target data", http.StatusOK, apiResp)
}

// Extract and Assert Production Target or Production Achieved keys to relevant numeric types from the raw db record
func getProductionTargetOrAchievedItem(rawRecord map[string]interface{}) *models.ProductionTargetOrAchievedItem {
	var (
		item models.ProductionTargetOrAchievedItem
	)

	projectsSold, ok := rawRecord["projects_sold"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast projects_sold from type %T to float64", rawRecord["projects_sold"])
	}

	mwSold, ok := rawRecord["mw_sold"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast mw_sold from type %T to float64", rawRecord["mw_sold"])
	}

	installCt, ok := rawRecord["install_ct"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast install_ct from type %T to float64", rawRecord["install_ct"])
	}

	mwInstalled, ok := rawRecord["mw_installed"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast mw_installed from type %T to float64", rawRecord["mw_installed"])
	}

	batteriesCt, ok := rawRecord["batteries_ct"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast batteries_ct from type %T to float64", rawRecord["batteries_ct"])
	}

	ntp, ok := rawRecord["ntp"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to cast ntp from type %T to float64", rawRecord["ntp"])
	}

	item.NTP = ntp
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
func getMonthlyStatsAndOverview(target float64, achieved float64, isSelectedMonth bool) (
	*models.GetReportsTargetRespStatsItem, *models.GetReportsTargetRespOverviewItem) {
	var (
		statsItem    models.GetReportsTargetRespStatsItem
		overviewItem models.GetReportsTargetRespOverviewItem
	)

	// overviewItem is simply kept as is

	overviewItem.Achieved = achieved
	overviewItem.Target = target

	// now calculate stats
	statsItem.Target = target

	if isSelectedMonth {
		statsItem.Inprogress = achieved
		return &statsItem, &overviewItem
	}

	if achieved > target {
		statsItem.MoreThanTarget = achieved - target
		return &statsItem, &overviewItem
	}

	statsItem.Incomplete = target - achieved
	statsItem.Completed = achieved
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
		pct.ProjectsSold = acheived.ProjectsSold / target.ProjectsSold * 100
	}

	if target.MwSold > 0 {
		pct.MwSold = acheived.MwSold / target.MwSold * 100
	}

	if target.InstallCt > 0 {
		pct.InstallCt = acheived.InstallCt / target.InstallCt * 100
	}

	if target.MwInstalled > 0 {
		pct.MwInstalled = acheived.MwInstalled / target.MwInstalled * 100
	}

	if target.BatteriesCt > 0 {
		pct.BatteriesCt = acheived.BatteriesCt / target.BatteriesCt * 100
	}

	if target.NTP > 0 {
		pct.NTP = acheived.NTP / target.NTP * 100
	}

	return &pct
}
