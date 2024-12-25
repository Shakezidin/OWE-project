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
	"math/rand"
	"strconv"
	"strings"
	"time"

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
		err         error
		dataReq     models.SummaryReportRequest
		RecordCount int = 0
		reportResp  models.SummaryReportResponse
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

	/* Dummy Data Sent to API */
	rand.Seed(time.Now().UnixNano())
	//categories := []string{"AHJ +15 Days SLA"}
	reportResp.Data = make(map[string][]models.DataPoint)

	/*for _, category := range categories {
		var data []models.DataPoint = make([]models.DataPoint, 52)
		for i := 0; i < 52; i++ {
			data[i].Value = make(map[string]float64)

			if contains(dataReq.Office, "Tempe") {
				data[i].Value["Tempe"] = rand.Float64()
			}
			if contains(dataReq.Office, "Colorado") {
				data[i].Value["Colorado"] = rand.Float64()
			}
			if contains(dataReq.Office, "Texas") {
				data[i].Value["Texas"] = rand.Float64()
			}
			if contains(dataReq.Office, "#N/A") {
				data[i].Value["#N/A"] = rand.Float64()
			}
			if contains(dataReq.Office, "Tucson") {
				data[i].Value["Tucson"] = rand.Float64()
			}
			if contains(dataReq.Office, "Albuquerque/El Paso") {
				data[i].Value["Albuquerque/El Paso"] = rand.Float64()
			}
			if contains(dataReq.Office, "Peoria/Kingman") {
				data[i].Value["Peoria/Kingman"] = rand.Float64()
			}
		}
		reportResp.Data[category] = data
	}*/

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
		err          error
		dataReq      models.TimelineReportRequest
		RecordCount  int = 0
		reportResp   models.SummaryReportResponse
		whereEleList []interface{}
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

	escapedOffices := make([]string, len(dataReq.Office))
	for i, name := range dataReq.Office {
		escapedOffices[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
	}
	Offices := strings.Join(escapedOffices, ", ")

	escapedAhj := make([]string, len(dataReq.Ahj))
	for i, name := range dataReq.Ahj {
		escapedAhj[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
	}
	ahj := strings.Join(escapedAhj, ", ")

	escapedStates := make([]string, len(dataReq.State))
	for i, name := range dataReq.State {
		escapedStates[i] = "'" + strings.ReplaceAll(name, "'", "''") + "'" // Escape single quotes
	}
	states := strings.Join(escapedStates, ", ")

	query := fmt.Sprintf(`SELECT
    		DATE_PART('week', fin.pv_fin_date) AS install_week,
    		CASE 
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 0 AND 15 THEN '0-15 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 16 AND 30 THEN '16-30 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 31 AND 45 THEN '31-45 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 46 AND 60 THEN '46-60 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) BETWEEN 61 AND 90 THEN '61-90 days'
        		WHEN EXTRACT(DAY FROM (fin.pv_fin_date - pvi.pv_completion_date)) > 91 THEN '>90 days'
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
    		AND (pvi.office IN (%s))
    		AND (pvi.ahj IN (%s))
    		AND (pvi.state IN (%s))
		GROUP BY 
    		install_week, day_range
		ORDER BY 
    		install_week, day_range;
	`, Offices, ahj, states)

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
		days_range := item["day_range"].(string)
		project_count := item["project_count"].(int64)

		data[install_week].Value[days_range] = project_count
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
							AND (pvi.office IN (%s))
							AND (pvi.ahj IN (%s))
							AND (pvi.state IN (%s))
						GROUP BY
    						install_week
						ORDER BY
    						install_week;
					`, Offices, ahj, states)

	dbDataAverage, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		err = fmt.Errorf("failed to get table data from db err: %v", err)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get the Install to Fin Report", http.StatusInternalServerError, nil)
		return
	}

	log.FuncErrorTrace(0, "dbDataAverage: %+v", dbDataAverage)

	var dataAverage []models.DataPoint = make([]models.DataPoint, 52)
	for i := 0; i < 52; i++ {
		dataAverage[i].Value = make(map[string]interface{})
	}

	for _, item := range dbDataAverage {
		install_week := int(item["install_week"].(float64))

		byteArray := item["avg_day_diff"].([]uint8)
		strValue := string(byteArray)

		// Convert string to float64
		avgDayDiff, err := strconv.ParseFloat(strValue, 64)
		if err != nil {
			fmt.Println("Error parsing float:", err)
			return
		}

		dataAverage[install_week].Value["average"] = avgDayDiff
	}
	reportResp.Data[categories[1]] = dataAverage

	appserver.FormAndSendHttpResp(resp, "Install To Fin Report", http.StatusOK, reportResp, int64(RecordCount))
}
