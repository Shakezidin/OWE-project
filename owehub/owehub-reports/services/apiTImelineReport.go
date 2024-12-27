/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to timeline report
 * DATE            : 22-Dec-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strconv"
	"strings"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetTimelineAhjFifteenReportRequest
 * DESCRIPTION:     handler for get AHJ+15 Report request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTimelineAhjFifteenReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.TimelineReportRequest
		RecordCount    int = 0
		reportResp     models.SummaryReportResponse
		whereEleList   []interface{}
		escapedOffices []string
	)

	log.EnterFn(0, "HandleGetTimelineAhjFifteenReportRequest")
	defer func() { log.ExitFn(0, "HandleGetTimelineAhjFifteenReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get AHJ+15 Report")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get AHJ+15 Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get AHJ+15 Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal AHJ+15 Report", http.StatusBadRequest, nil)
		return
	}

	Offices := ""
	if (len(dataReq.Office) > 0) && (dataReq.Office[0] == "ALL") {
		Offices = "'ALL' = 'ALL'"
	} else {
		for _, name := range dataReq.Office {
			for _, officeCode := range getDBOfficeNames(name) {
				escapedOffices = append(escapedOffices, "'"+strings.ReplaceAll(officeCode, "'", "''")+"'")
			}
		}
		Offices = "pv.office IN (" + strings.Join(escapedOffices, ", ") + ")"
	}

	ahj := ""
	if (len(dataReq.Ahj) > 0) && (dataReq.Ahj[0] == "ALL") {
		ahj = "'ALL' = 'ALL'"
	} else {
		escapedAhj := make([]string, len(dataReq.Ahj))
		for i, name := range dataReq.Ahj {
			escapedAhj[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
		}
		ahj = "pv.ahj IN (" + strings.Join(escapedAhj, ", ") + ")"
	}

	states := ""
	if (len(dataReq.State) > 0) && (dataReq.State[0] == "ALL") {
		states = "'ALL' = 'ALL'"
	} else {
		escapedStates := make([]string, len(dataReq.State))
		for i, name := range dataReq.State {
			escapedStates[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
		}
		states = "pv.state IN (" + strings.Join(escapedStates, ", ") + ")"
	}

	quarter := ""
	if len(dataReq.Quarter) == 0 {
		quarter = "'ALL' = 'ALL'"
	} else {
		for i, q := range dataReq.Quarter {
			if i == 0 {
				quarter = fmt.Sprintf("%d", q)
				continue
			}
			quarter = fmt.Sprintf("%s, %d", quarter, q)
		}
		quarter = fmt.Sprintf("quarter IN (%s)", quarter)
	}

	query := fmt.Sprintf(`SELECT 
							quarter,
							install_week,
							SLA_Status,
							COUNT(*) AS count,
							ROUND((COUNT(*) * 100.0) / SUM(COUNT(*)) OVER (PARTITION BY install_week), 2) AS percentage
						FROM (
							SELECT 
								DATE_PART('quarter', pv.pv_completion_date) AS quarter,
								DATE_PART('week', pv.pv_completion_date) AS install_week,
								CASE 
									WHEN DATE_PART('day', pv.pv_completion_date - cu.sale_date) < (CAST(ah.ahj_timeline AS INT) + 15) THEN 'within'
									ELSE 'out'
								END AS SLA_Status
							FROM 
								pv_install_install_subcontracting_schema AS pv
							JOIN 
								customers_customers_schema AS cu
								ON cu.unique_id = pv.customer_unique_id
							JOIN 
								ahj_db_database_hub_schema AS ah
								ON pv.ahj = ah.title
							WHERE 
								DATE_PART('year', pv.pv_completion_date) = $1
								AND (%s)
								AND (%s)
								AND (%s)
								AND ah.ahj_timeline IS NOT NULL
								AND ah.ahj_timeline != ''
						) subquery
						GROUP BY 
							install_week, SLA_Status, quarter
						HAVING (%s)
						ORDER BY 
							install_week, SLA_Status;
				`, Offices, ahj, states, quarter)

	whereEleList = append(whereEleList, dataReq.Year)

	dbData, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		err = fmt.Errorf("failed to get table data from db err: %v", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get the AHJ+15 Report", http.StatusInternalServerError, nil)
		return
	}

	categories := []string{"Percentage AHJ +15 Days SLA", "Total AHJ +15 Days SLA"}
	reportResp.Data = make(map[string][]models.DataPoint)

	var dataTotal []models.DataPoint = make([]models.DataPoint, 52)
	for i := 0; i < 52; i++ {
		dataTotal[i].Value = make(map[string]interface{})
	}

	var dataPercentage []models.DataPoint = make([]models.DataPoint, 52)
	for i := 0; i < 52; i++ {
		dataPercentage[i].Value = make(map[string]interface{})
	}

	qtrToCountMaping := make(map[float64]map[string]int64)
	for _, item := range dbData {
		install_week := int(item["install_week"].(float64))
		install_week -= 1

		status := item["sla_status"].(string)
		count := item["count"].(int64)

		quarter := item["quarter"].(float64)

		byteArray := item["percentage"].([]uint8)
		strValue := string(byteArray)
		percentage, err := strconv.ParseFloat(strValue, 64)
		if err != nil {
			fmt.Println("Error parsing float:", err)
			return
		}

		if _, ok := qtrToCountMaping[quarter]; !ok {
			qtrToCountMaping[quarter] = map[string]int64{
				"within": 0,
				"out":    0,
			}
		}
		qtrToCountMaping[quarter][status] += int64(count)

		slaStatusSlabel := "Within SLA"
		if status == "out" {
			slaStatusSlabel = "Out of SLA"
		}

		qtrToCountMaping[quarter][slaStatusSlabel] += count
		dataTotal[install_week].Value[slaStatusSlabel] = count
		dataPercentage[install_week].Value[slaStatusSlabel] = percentage

		dataTotal[install_week].Index = install_week + 1
		dataPercentage[install_week].Index = install_week + 1
	}

	qtrSummary := make(map[string]map[string]float64)

	for qtr, countMap := range qtrToCountMaping {
		total := countMap["within"] + countMap["out"]

		withinSlaPercentage := 0.0
		outSideSlaPercentage := 0.0
		if total > 0 {
			withinSlaPercentage = float64(countMap["within"]) / float64(total) * 100.00
			outSideSlaPercentage = float64(countMap["out"]) / float64(total) * 100.00
		}

		qtrSummaryItem := map[string]float64{
			"Within SLA Count":      float64(countMap["within"]),
			"Within SLA Percentage": withinSlaPercentage,
			"Out of SLA Count":      float64(countMap["out"]),
			"Out of SLA Percentage": outSideSlaPercentage,
		}
		qtrSummary[fmt.Sprintf("q%.0f", qtr)] = qtrSummaryItem
	}

	reportResp.Data[categories[0]] = dataPercentage
	reportResp.Data[categories[1]] = dataTotal
	reportResp.Summary = qtrSummary

	log.FuncDebugTrace(0, "reportResp: %+v", reportResp.Summary)

	appserver.FormAndSendHttpResp(resp, "AHJ+15 Report", http.StatusOK, reportResp, int64(RecordCount))
}

/******************************************************************************
 * FUNCTION:		HandleGetTimelineInstallToFinReportRequest
 * DESCRIPTION:     handler for get Install To Fin Report request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTimelineInstallToFinReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err            error
		dataReq        models.TimelineReportRequest
		RecordCount    int = 0
		reportResp     models.SummaryReportResponse
		whereEleList   []interface{}
		escapedOffices []string
	)

	log.EnterFn(0, "HandleGetTimelineInstallToFinReportRequest")
	defer func() { log.ExitFn(0, "HandleGetTimelineInstallToFinReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Install To Fin Report")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Install To Fin Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Install To Fin Report err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Install To Fin Report", http.StatusBadRequest, nil)
		return
	}

	Offices := ""
	if (len(dataReq.Office) > 0) && (dataReq.Office[0] == "ALL") {
		Offices = "'ALL' = 'ALL'"
	} else {
		for _, name := range dataReq.Office {
			for _, officeCode := range getDBOfficeNames(name) {
				escapedOffices = append(escapedOffices, "'"+strings.ReplaceAll(officeCode, "'", "''")+"'")
			}
		}
		Offices = "pvi.office IN (" + strings.Join(escapedOffices, ", ") + ")"
	}

	ahj := ""
	if (len(dataReq.Ahj) > 0) && (dataReq.Ahj[0] == "ALL") {
		ahj = "'ALL' = 'ALL'"
	} else {
		escapedAhj := make([]string, len(dataReq.Ahj))
		for i, name := range dataReq.Ahj {
			escapedAhj[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
		}
		ahj = "pvi.ahj IN (" + strings.Join(escapedAhj, ", ") + ")"
	}

	states := ""
	if (len(dataReq.State) > 0) && (dataReq.State[0] == "ALL") {
		states = "'ALL' = 'ALL'"
	} else {
		escapedStates := make([]string, len(dataReq.State))
		for i, name := range dataReq.State {
			escapedStates[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
		}
		states = "pvi.state IN (" + strings.Join(escapedStates, ", ") + ")"
	}

	quarter := ""
	if len(dataReq.Quarter) == 0 {
		quarter = "'ALL' = 'ALL'"
	} else {
		for i, q := range dataReq.Quarter {
			if i == 0 {
				quarter = fmt.Sprintf("%d", q)
				continue
			}
			quarter = fmt.Sprintf("%s, %d", quarter, q)
		}
		quarter = fmt.Sprintf("DATE_PART('quarter', fin.pv_fin_date) IN (%s)", quarter)
	}

	query := fmt.Sprintf(`SELECT
    		DATE_PART('week', fin.pv_fin_date) AS install_week,
    		CASE 
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 0 AND 15 THEN '0-15 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 16 AND 30 THEN '16-30 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 31 AND 45 THEN '31-45 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 46 AND 60 THEN '46-60 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 61 AND 90 THEN '61-90 days'
        		ELSE '>90 days'
    		END AS day_range,
    		COUNT(*) AS project_count
		FROM 
    		pv_install_install_subcontracting_schema AS pvi
		LEFT JOIN 
    		fin_permits_fin_schema AS fin
		ON 
    		pvi.customer_unique_id = fin.customer_unique_id
		WHERE
    		DATE_PART('year', fin.pv_fin_date) = $1
			AND (%s)
			AND (%s)
    		AND (%s)
    		AND (%s)
		GROUP BY 
    		install_week, day_range
		ORDER BY 
    		install_week, day_range;
	`, Offices, ahj, states, quarter)

	whereEleList = append(whereEleList, dataReq.Year)

	dbData, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		err = fmt.Errorf("failed to get table data from db err: %v", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get the Install to Fin Report", http.StatusInternalServerError, nil)
		return
	}

	categories := []string{"Install to FIN Day Range", "Average Days From Install to FIN"}
	reportResp.Data = make(map[string][]models.DataPoint)

	//Install to FIN Day Range
	var data []models.DataPoint = make([]models.DataPoint, 52)
	for i := 0; i < 52; i++ {
		data[i].Value = make(map[string]interface{})
	}

	for _, item := range dbData {
		install_week := int(item["install_week"].(float64))
		install_week -= 1

		days_range := item["day_range"].(string)
		project_count := item["project_count"].(int64)

		data[install_week].Value[days_range] = project_count
		data[install_week].Index = install_week + 1
	}
	reportResp.Data[categories[0]] = data

	//Average Days From Install to FIN
	query = fmt.Sprintf(`SELECT
    						DATE_PART('week', fin.pv_fin_date) AS install_week,
    						COUNT(*) AS project_count,
    						AVG(EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date))) AS avg_day_diff
						FROM
							pv_install_install_subcontracting_schema AS pvi
						LEFT JOIN
    						fin_permits_fin_schema AS fin
						ON
    						pvi.customer_unique_id = fin.customer_unique_id
						WHERE
							DATE_PART('year', fin.pv_fin_date) = $1
							AND (%s)
							AND (%s)
							AND (%s)
							AND (%s)
						GROUP BY
    						install_week
						ORDER BY
    						install_week;
					`, quarter, Offices, ahj, states)

	dbDataAverage, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		err = fmt.Errorf("failed to get table data from db err: %v", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get the Install to Fin Report", http.StatusInternalServerError, nil)
		return
	}

	var dataAverage []models.DataPoint = make([]models.DataPoint, 52)
	for i := 0; i < 52; i++ {
		dataAverage[i].Value = make(map[string]interface{})
	}

	for _, item := range dbDataAverage {
		install_week := int(item["install_week"].(float64))
		install_week -= 1

		byteArray := item["avg_day_diff"].([]uint8)
		strValue := string(byteArray)

		// Convert string to float64
		avgDayDiff, err := strconv.ParseFloat(strValue, 64)
		if err != nil {
			fmt.Println("Error parsing float:", err)
			return
		}
		dataAverage[install_week].Value["average"] = avgDayDiff
		dataAverage[install_week].Index = install_week + 1
	}
	reportResp.Data[categories[1]] = dataAverage

	appserver.FormAndSendHttpResp(resp, "Install To Fin Report", http.StatusOK, reportResp, int64(RecordCount))
}
