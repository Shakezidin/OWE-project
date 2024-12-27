/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to get summary report
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

	"github.com/lib/pq"
)

/******************************************************************************
 * FUNCTION:		HandleGetProductionSummaryReportRequest
 * DESCRIPTION:     handler for get Dealer pay commissions data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetProductionSummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err       error
		dataReq   models.ProductionSummaryReportRequest
		data      []map[string]interface{}
		weekData  map[string]interface{}
		subReport models.ProductionSummarySubReport
		apiResp   models.ProductionSummaryReportResponse
		dbOffices []string
		tableName string
	)

	log.EnterFn(0, "HandleGetProductionSummaryReportRequest")
	defer func() { log.ExitFn(0, "HandleGetProductionSummaryReportRequest", err) }()

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

	// Convert report office names to db office names
	for _, reportOffice := range dataReq.Office {
		dbOffices = append(dbOffices, getDBOfficeNames(reportOffice)...)
	}

	if dataReq.ReportType == "install" {
		tableName = "pv_install_install_subcontracting_schema"

		// 1. Install Scheduled - Day 1
		subReport = models.ProductionSummarySubReport{SubReportName: "Install Scheduled - Day 1"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklySystemSizes(tableName, "pv_install_day_window", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":      key,
				"System Size": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 2. Install Scheduled - Day 2
		subReport = models.ProductionSummarySubReport{SubReportName: "Install Scheduled - Day 2"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklySystemSizes(tableName, "pv_install_day_window_day_2", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":      key,
				"System Size": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 3. Install Scheduled - Day 3
		subReport = models.ProductionSummarySubReport{SubReportName: "Install Scheduled - Day 3"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklySystemSizes(tableName, "pv_install_day_window_day_3", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":      key,
				"System Size": value,
			})
		}

		// 4. Install Fix Scheduled
		subReport = models.ProductionSummarySubReport{SubReportName: "Install Fix Scheduled"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklySystemSizes(tableName, "install_fix_scheduled_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":      key,
				"System Size": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 5. Install Completed
		subReport = models.ProductionSummarySubReport{SubReportName: "Install Completed"}

		// fill in chart data
		subReport.ChartData, _, err = queryProductionWeeklySystemSizes(tableName, "pv_completion_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		subReport.TableData, err = queryProductionWeekSummary("pv_completion_date", int64(dataReq.Week), dataReq.Year, dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 6. Install Fix Completed
		subReport = models.ProductionSummarySubReport{SubReportName: "Install Fix Completed"}

		// fill in chart data
		subReport.ChartData, _, err = queryProductionWeeklySystemSizes(tableName, "install_fix_complete_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		subReport.TableData, err = queryProductionWeekSummary("install_fix_complete_date", int64(dataReq.Week), dataReq.Year, dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 7. Pending Installs
		data, err = queryProductionStatusGrouping(dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		subReport = models.ProductionSummarySubReport{
			SubReportName: "Pending Installs",
			ChartData:     data,
			TableData:     []map[string]interface{}{},
		}

		// sum system size for each office
		for _, row := range data {
			sysSizeSum := 0.0
			for _, val := range row {
				if sysSize, ok := val.(float64); ok {
					sysSizeSum += sysSize
				}
			}
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":      row["office"],
				"System Size": sysSizeSum,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		appserver.FormAndSendHttpResp(resp, "Production summary report data", http.StatusOK, apiResp)
		return
	}

	// TODO: Handle more report types here

	appserver.FormAndSendHttpResp(resp, "Invalid report type", http.StatusBadRequest, nil)
}

// Query Production Reports:
//   - Grouping by week number (week in an year)
//   - Grouping by office
//   - Filtering by year and office
//   - TableName decides which table to query
//   - DateCol decides date column to group weeks by
func queryProductionWeeklySystemSizes(tableName string, dateCol string, offices []string, year int, selectedWeek int) (
	chartData []map[string]interface{}, selectedWeekData map[string]interface{}, err error) {
	var (
		query       string
		data        []map[string]interface{}
		weekNoGrps  map[int64][]map[string]interface{}
		weekNumbers []int64
		lastWeekNo  int64
	)

	log.EnterFn(0, "queryProductionWeeklySystemSizes")
	defer func() { log.ExitFn(0, "queryProductionWeeklySystemSizes", err) }()

	query = fmt.Sprintf(`
        SELECT
            CAST(SUM(system_size::DECIMAL) AS FLOAT) AS system_size_sum,
            office AS office,
            CAST(EXTRACT('WEEK' FROM %s) AS INT) AS week_number
        FROM %s
        WHERE
            system_size != ''
            AND OFFICE IS NOT NULL
            AND EXTRACT('YEAR' FROM %s) = $1
            AND OFFICE = ANY($2)
        GROUP BY week_number, office
        ORDER BY week_number
    `, dateCol, tableName, dateCol)

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, []interface{}{year, pq.Array(offices)})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve data from DB err: %v", err)
		err = fmt.Errorf("failed to retrieve data from DB")
		return nil, nil, err
	}

	// first, group by week
	weekNoGrps = make(map[int64][]map[string]interface{})
	weekNumbers = make([]int64, 0) // store week numbers to maintain week no. ordering
	for _, row := range data {
		weekNo, ok := row["week_number"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert week number to int64 from type %T", row["week_number"])
			err = fmt.Errorf("internal Server Error")
			return nil, nil, err
		}

		if _, ok := weekNoGrps[weekNo]; !ok {
			weekNoGrps[weekNo] = []map[string]interface{}{}
			weekNumbers = append(weekNumbers, weekNo)
		}

		weekNoGrps[weekNo] = append(weekNoGrps[weekNo], row)
	}

	// then for each week, accumulate to system size counts
	data = []map[string]interface{}{}
	selectedWeekData = make(map[string]interface{})
	for _, weekNo := range weekNumbers {
		officesFound := make(map[string]bool)
		weekDataAccumulated := make(map[string]interface{})

		weekDataAccumulated["week"] = weekNo
		for _, row := range weekNoGrps[weekNo] {
			office, ok := row["office"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to convert office to string from type %T", row["office"])
				continue
			}

			sysSize, ok := row["system_size_sum"].(float64)

			if !ok {
				log.FuncErrorTrace(0, "Failed to convert system_size_sum to float64 from type %T", row["system_size_sum"])
				continue
			}
			officesFound[office] = true
			weekDataAccumulated[getReportOfficeName(office)] = sysSize
		}

		// for all offices that were not found, add a row with zero
		for _, office := range offices {
			if _, ok := officesFound[office]; !ok {
				weekDataAccumulated[getReportOfficeName(office)] = 0.0
			}
		}

		// fill in the gaps with zero values
		for i := lastWeekNo + 1; i < weekNo; i++ {
			zeroWeekData := make(map[string]interface{})
			zeroWeekData["week"] = i
			for _, office := range offices {
				zeroWeekData[getReportOfficeName(office)] = 0.0
			}
			data = append(data, zeroWeekData)
			if i == int64(selectedWeek) {
				delete(zeroWeekData, "week") // don't include week number in selectedWeekData
				selectedWeekData = zeroWeekData
			}
		}

		lastWeekNo = weekNo
		data = append(data, weekDataAccumulated)
		if weekNo == int64(selectedWeek) {
			delete(weekDataAccumulated, "week") // don't include week number in selectedWeekData
			selectedWeekData = weekDataAccumulated
		}
	}

	return data, selectedWeekData, nil
}

// Query Production Reports:
//   - Grouping by office
//   - Filtering by year, week number and office
//   - DateCol decides date column to group weeks by
func queryProductionWeekSummary(dateColName string, weekNo int64, year int, offices []string) ([]map[string]interface{}, error) {
	var (
		err     error
		query   string
		data    []map[string]interface{}
		outData []map[string]interface{}
	)
	log.EnterFn(0, "HandleGetProductionSummaryReportRequest")
	defer func() { log.ExitFn(0, "HandleGetProductionSummaryReportRequest", err) }()

	query = fmt.Sprintf(`
        SELECT
            office,
            CAST(SUM(system_size::DECIMAL) AS FLOAT) AS system_size_sum,
            COUNT(DISTINCT customer_unique_id) AS customers_count,
            CAST(AVG(system_size::DECIMAL) AS FLOAT) AS system_size_avg
        FROM pv_install_install_subcontracting_schema
        WHERE system_size != ''
        AND EXTRACT('WEEK' FROM %s) = $1
        AND EXTRACT('YEAR' FROM %s) = $2
        GROUP BY office
        HAVING office = ANY($3)
    `, dateColName, dateColName)

	whereEleList := []interface{}{weekNo, year, pq.Array(offices)}
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve data from DB err: %v", err)
		return nil, fmt.Errorf("failed to retrieve data from DB")
	}

	for _, item := range data {
		officeName := getReportOfficeName(item["office"].(string))
		outData = append(outData, map[string]interface{}{
			"Office":              officeName,
			"System Size":         item["system_size_sum"],
			"Customers":           item["customers_count"],
			"Average System Size": item["system_size_avg"],
		})
	}
	return outData, nil
}

// Query Production Reports:
//   - Grouping by office
//   - Filtering by office
//
// Used for bar chart data
func queryProductionStatusGrouping(offices []string) ([]map[string]interface{}, error) {
	var (
		err                  error
		query                string
		projStatusExceptions []string
		appStatusExceptions  []string
		data                 []map[string]interface{}
		officeGrps           map[string][]map[string]interface{}
	)
	projStatusExceptions = []string{
		"DUPLICATE",
		"CANCEL",
		"HOLD",
		"BLOCKED",
		"JEOPARDY",
	}
	appStatusExceptions = []string{
		"",
		"Install Complete",
		"CANCEL",
		"DUPLICATE",
	}

	// apply single quotes to exception columns
	for i := range projStatusExceptions {
		projStatusExceptions[i] = fmt.Sprintf("'%s'", projStatusExceptions[i])
	}
	for i := range appStatusExceptions {
		appStatusExceptions[i] = fmt.Sprintf("'%s'", appStatusExceptions[i])
	}

	query = fmt.Sprintf(`
        SELECT
            CAST(SUM(system_size::DECIMAL) AS FLOAT) AS system_size_sum,
            app_status,
            office
        FROM pv_install_install_subcontracting_schema
        WHERE system_size != ''
        AND project_status NOT IN (%s)
        GROUP BY app_status, office
        HAVING app_status NOT IN (%s)
        AND OFFICE = ANY($1)
    `, strings.Join(projStatusExceptions, ", "), strings.Join(appStatusExceptions, ", "))

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, []interface{}{pq.Array(offices)})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve data from DB err: %v", err)
		return nil, fmt.Errorf("failed to retrieve data from DB")
	}

	// first, group by office
	officeGrps = make(map[string][]map[string]interface{})
	for _, row := range data {
		office, ok := row["office"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert office to string from type %T", row["office"])
			continue
		}
		if _, ok := officeGrps[office]; !ok {
			officeGrps[office] = []map[string]interface{}{}
		}
		officeGrps[office] = append(officeGrps[office], row)
	}

	// then for each office, accumulate to system size counts and app status
	data = []map[string]interface{}{}
	for office, officeData := range officeGrps {
		officeDataAccumulated := make(map[string]interface{})

		officeDataAccumulated["office"] = getReportOfficeName(office)
		for _, row := range officeData {
			sysSize, ok := row["system_size_sum"].(float64)
			if !ok {
				log.FuncErrorTrace(0, "Failed to convert system_size_sum to float64 from type %T", row["system_size_sum"])
				continue
			}
			appStatus, ok := row["app_status"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to convert app_status to string from type %T", row["app_status"])
				continue
			}
			officeDataAccumulated[appStatus] = sysSize
		}
		data = append(data, officeDataAccumulated)
	}
	return data, nil
}
