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
		err        error
		dataReq    models.ProductionSummaryReportRequest
		weekData   map[string]interface{}
		totals     map[string]interface{}
		subReport  models.ProductionSummarySubReport
		apiResp    models.ProductionSummaryReportResponse
		dbOffices  []string
		tableName  string
		calcQuery  string
		dateFilter []string
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
		calcQuery = "CAST(SUM(CASE WHEN system_size = '' THEN 0 ELSE system_size::DECIMAL END) AS FLOAT)"

		// 1. Install Scheduled - Day 1
		subReport = models.ProductionSummarySubReport{SubReportName: "Install Scheduled - Day 1"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[float64](tableName, calcQuery, "pv_install_day_window", dbOffices, dataReq.Year, dataReq.Week)
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
		subReport.ChartData, weekData, err = queryProductionWeeklyData[float64](tableName, calcQuery, "pv_install_day_window_day_2", dbOffices, dataReq.Year, dataReq.Week)
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
		subReport.ChartData, weekData, err = queryProductionWeeklyData[float64](tableName, calcQuery, "pv_install_day_window_day_3", dbOffices, dataReq.Year, dataReq.Week)
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
		subReport.ChartData, weekData, err = queryProductionWeeklyData[float64](tableName, calcQuery, "install_fix_scheduled_date", dbOffices, dataReq.Year, dataReq.Week)
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
		subReport.ChartData, _, err = queryProductionWeeklyData[float64](tableName, calcQuery, "pv_completion_date", dbOffices, dataReq.Year, dataReq.Week)
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
		subReport.ChartData, _, err = queryProductionWeeklyData[float64](tableName, calcQuery, "install_fix_complete_date", dbOffices, dataReq.Year, dataReq.Week)
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
		subReport = models.ProductionSummarySubReport{SubReportName: "Pending Installs"}

		// fill in chart data
		subReport.ChartData, totals, err = queryProductionStatusGrouping[float64](tableName, calcQuery, dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for office, total := range totals {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":      office,
				"System Size": total,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		appserver.FormAndSendHttpResp(resp, "Production summary report data", http.StatusOK, apiResp)
		return
	}

	if dataReq.ReportType == "battery" {
		tableName = "batteries_service_electrical_schema"
		calcQuery = "COUNT(DISTINCT customer_unique_id)"

		// 1. Battery Scheduled
		subReport = models.ProductionSummarySubReport{SubReportName: "Battery Scheduled"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "battery_installation_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 2. Battery Completed
		subReport = models.ProductionSummarySubReport{SubReportName: "Battery Completed"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "completion_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 3. Pending Battery
		subReport = models.ProductionSummarySubReport{SubReportName: "Pending Battery"}
		subReport.ChartData, totals, err = queryProductionStatusGrouping[int64](tableName, calcQuery, dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for office, totalCustomers := range totals {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    office,
				"Customers": totalCustomers,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		appserver.FormAndSendHttpResp(resp, "Production summary report data", http.StatusOK, apiResp)
		return
	}

	if dataReq.ReportType == "service" {
		tableName = "service_requests_service_electrical_schema"
		calcQuery = "COUNT(DISTINCT customer_unique_id)"

		// 1. Service Scheduled
		subReport = models.ProductionSummarySubReport{SubReportName: "Service Scheduled"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "scheduled_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 2. Service Completed
		subReport = models.ProductionSummarySubReport{SubReportName: "Service Completed"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "completion_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 3. Pending Service
		subReport = models.ProductionSummarySubReport{SubReportName: "Pending Service"}
		subReport.ChartData, _, err = queryProductionStatusGrouping[int64](tableName, calcQuery, dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		//  fill in table data
		subReport.TableData, err = queryProductionCustomerCountGrouping(tableName, "service_type", nil, dbOffices)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		appserver.FormAndSendHttpResp(resp, "Production summary report data", http.StatusOK, apiResp)
		return
	}

	if dataReq.ReportType == "mpu" {
		tableName = "mpu_service_electrical_schema"
		calcQuery = "COUNT(DISTINCT customer_unique_id)"

		// 1. MPU Scheduled
		subReport = models.ProductionSummarySubReport{SubReportName: "MPU Scheduled"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "pk_or_cutover_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 2. MPU Completed
		subReport = models.ProductionSummarySubReport{SubReportName: "MPU Completed"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "pk_or_cutover_date_of_completion", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 3. Pending MPU
		subReport = models.ProductionSummarySubReport{SubReportName: "Pending MPU"}
		subReport.ChartData, totals, err = queryProductionStatusGrouping[int64](tableName, calcQuery, dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for key, value := range totals {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		appserver.FormAndSendHttpResp(resp, "Production summary report data", http.StatusOK, apiResp)
		return
	}

	if dataReq.ReportType == "derate" {
		tableName = "derates_service_electrical_schema"
		calcQuery = "COUNT(DISTINCT customer_unique_id)"

		// 1. Derate Scheduled
		subReport = models.ProductionSummarySubReport{SubReportName: "Derate Scheduled"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "scheduled_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 2. Derate Completed
		subReport = models.ProductionSummarySubReport{SubReportName: "Derate Completed"}

		// fill in chart data
		subReport.ChartData, weekData, err = queryProductionWeeklyData[int64](tableName, calcQuery, "completion_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for key, value := range weekData {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 3. Pending Derate
		subReport = models.ProductionSummarySubReport{SubReportName: "Pending Derate"}
		subReport.ChartData, totals, err = queryProductionStatusGrouping[int64](tableName, calcQuery, dbOffices)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		// fill in table data
		for key, value := range totals {
			subReport.TableData = append(subReport.TableData, map[string]interface{}{
				"Office":    key,
				"Customers": value,
			})
		}
		apiResp.SubReports = append(apiResp.SubReports, subReport)

		appserver.FormAndSendHttpResp(resp, "Production summary report data", http.StatusOK, apiResp)
		return
	}

	if dataReq.ReportType == "der/lst" {
		tableName = "der_lst_sub_panel_service_electrical_schema"
		calcQuery = "COUNT(DISTINCT customer_unique_id)"

		// 1. DER/LST Scheduled
		subReport = models.ProductionSummarySubReport{SubReportName: "DER/LST Scheduled"}

		// fill in chart data
		subReport.ChartData, _, err = queryProductionWeeklyData[int64](tableName, calcQuery, "scheduled_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		dateFilter = []string{
			fmt.Sprintf("EXTRACT('WEEK' FROM scheduled_date) = %d", dataReq.Week),
			fmt.Sprintf("EXTRACT('YEAR' FROM scheduled_date) = %d", dataReq.Year),
		}
		subReport.TableData, err = queryProductionCustomerCountGrouping(tableName, "sow", dateFilter, dbOffices)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// 2. DER/LST Completed
		subReport = models.ProductionSummarySubReport{SubReportName: "DER/LST Completed"}

		// fill in chart data
		subReport.ChartData, _, err = queryProductionWeeklyData[int64](tableName, calcQuery, "completed_date", dbOffices, dataReq.Year, dataReq.Week)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}
		// fill in table data
		dateFilter = []string{
			fmt.Sprintf("EXTRACT('WEEK' FROM completed_date) = %d", dataReq.Week),
			fmt.Sprintf("EXTRACT('YEAR' FROM completed_date) = %d", dataReq.Year),
		}
		subReport.TableData, err = queryProductionCustomerCountGrouping(tableName, "sow", dateFilter, dbOffices)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to fetch data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
			return
		}

		apiResp.SubReports = append(apiResp.SubReports, subReport)

		// TODO: Fetch Pending DER/LST
		appserver.FormAndSendHttpResp(resp, "Production summary report data", http.StatusOK, apiResp)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Invalid report type", http.StatusBadRequest, nil)
}

// Query Production Reports:
//   - Grouping by week number (week in an year)
//   - Grouping by office
//   - Filtering by year and office
//   - TableName decides which table to query
//   - DateCol decides date column to group weeks by
func queryProductionWeeklyData[TNum int64 | float64](
	tableName, calculationQuery, dateCol string, offices []string, year, selectedWeek int) (
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
            %s AS calculated_col,
            office AS office,
            CAST(EXTRACT('WEEK' FROM %s) AS INT) AS week_number
        FROM %s
        WHERE
            OFFICE IS NOT NULL
            AND EXTRACT('YEAR' FROM %s) = $1
            AND OFFICE = ANY($2)
        GROUP BY week_number, office
        ORDER BY week_number
    `, calculationQuery, dateCol, tableName, dateCol)

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

			sysSize, ok := row["calculated_col"].(TNum)
			if !ok {
				log.FuncErrorTrace(0, "Failed to convert calculated_col to TNum from type %T", row["calculated_col"])
				continue
			}

			reportOfficeName := getReportOfficeName(office)
			officesFound[reportOfficeName] = true

			if _, ok := weekDataAccumulated[reportOfficeName]; !ok {
				weekDataAccumulated[reportOfficeName] = sysSize
				continue
			}
			weekDataAccumulated[reportOfficeName] = weekDataAccumulated[reportOfficeName].(TNum) + sysSize
		}

		// for all offices that were not found, add a row with zero
		for _, office := range offices {
			reportOfficeName := getReportOfficeName(office)
			if _, ok := officesFound[reportOfficeName]; !ok {
				weekDataAccumulated[reportOfficeName] = 0.0
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
//   - Filtering by office
//
// Used for bar chart data
func queryProductionStatusGrouping[TNum int64 | float64](tableName, calculationQuery string, offices []string) (
	chartData []map[string]interface{}, totals map[string]interface{}, err error) {
	var (
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
			%s AS calculated_col,
            app_status,
            office
        FROM %s
        WHERE project_status NOT IN (%s)
        GROUP BY app_status, office
        HAVING app_status NOT IN (%s)
        AND OFFICE = ANY($1)
    `, calculationQuery, tableName, strings.Join(projStatusExceptions, ", "), strings.Join(appStatusExceptions, ", "))

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, []interface{}{pq.Array(offices)})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve data from DB err: %v", err)
		return nil, nil, fmt.Errorf("failed to retrieve data from DB")
	}

	// first, group by office
	officeGrps = make(map[string][]map[string]interface{})
	for _, row := range data {
		office, ok := row["office"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert office to string from type %T", row["office"])
			continue
		}

		reportOfficeName := getReportOfficeName(office)

		if _, ok := officeGrps[reportOfficeName]; !ok {
			officeGrps[reportOfficeName] = []map[string]interface{}{}
		}
		officeGrps[reportOfficeName] = append(officeGrps[reportOfficeName], row)
	}

	// then for each office, accumulate to system size counts and app status
	chartData = []map[string]interface{}{}
	totals = make(map[string]interface{}) // sum totals per office
	for office, officeData := range officeGrps {
		officeDataAccumulated := map[string]interface{}{
			"office": office,
		}
		totals[office] = TNum(0)

		for _, row := range officeData {
			calcCol, ok := row["calculated_col"].(TNum)
			if !ok {
				log.FuncErrorTrace(0, "Failed to convert system_size_sum to float64 from type %T", row["system_size_sum"])
				continue
			}
			appStatus, ok := row["app_status"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to convert app_status to string from type %T", row["app_status"])
				continue
			}

			totals[office] = totals[office].(TNum) + calcCol
			if _, ok := officeDataAccumulated[appStatus]; !ok {
				officeDataAccumulated[appStatus] = calcCol
				continue
			}
			officeDataAccumulated[appStatus] = officeDataAccumulated[appStatus].(TNum) + calcCol

		}
		chartData = append(chartData, officeDataAccumulated)
	}
	return chartData, totals, nil
}

// Query Production Reports:
//   - Group customer counts by column specified
func queryProductionCustomerCountGrouping(tableName, grpCol string, dateFilter, offices []string) ([]map[string]interface{}, error) {
	var (
		err           error
		query         string
		dateFilterStr string
		whereEleList  []interface{}
		officeGrps    map[string][]map[string]interface{}
		groupNames    map[string]bool
		outData       []map[string]interface{}
	)

	if len(dateFilter) > 0 {
		for _, filter := range dateFilter {
			dateFilterStr = fmt.Sprintf("%s AND %s", dateFilterStr, filter)
		}
	}

	query = fmt.Sprintf(`
		SELECT
			%s AS grp_col,
			office,
			COUNT(DISTINCT customer_unique_id) AS customer_count
		FROM %s
		WHERE OFFICE = ANY($1)
		%s
		GROUP BY %s, OFFICE
	`, grpCol, tableName, dateFilterStr, grpCol)

	whereEleList = []interface{}{pq.Array(offices)}

	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve data from DB err: %v", err)
		return nil, fmt.Errorf("failed to retrieve data from DB")
	}

	// first, group by office
	officeGrps = make(map[string][]map[string]interface{})
	groupNames = make(map[string]bool) // maintain list of all group names
	for _, row := range data {
		office, ok := row["office"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert office to string from type %T", row["office"])
			continue
		}
		grpName, ok := row["grp_col"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert grpName to string from type %T", row["grp_col"])
			continue
		}
		groupNames[grpName] = true // maintain list of all group names
		officeName := getReportOfficeName(office)
		officeGrps[officeName] = append(officeGrps[officeName], row)
	}

	// add offices that did not appear in rows
	for _, office := range offices {
		officeName := getReportOfficeName(office)
		if _, ok := officeGrps[officeName]; !ok {
			officeGrps[officeName] = []map[string]interface{}{}
		}
	}

	// accumulate data for each office
	for office, rows := range officeGrps {
		outItem := map[string]interface{}{
			"Office": office,
		}
		total := int64(0)
		for _, row := range rows {
			grpCol := row["grp_col"].(string)
			customerCount := row["customer_count"].(int64)
			total += customerCount

			if _, ok := outItem[grpCol]; !ok {
				outItem[grpCol] = customerCount
			} else {
				outItem[grpCol] = outItem[grpCol].(int64) + customerCount
			}
		}
		// fill groups that did't appear in rows
		for groupName := range groupNames {
			if _, ok := outItem[groupName]; !ok {
				outItem[groupName] = 0
			}
		}
		outItem["Total"] = total
		outData = append(outData, outItem)
	}
	return outData, nil
}

// Query Production Reports:
//   - Grouping by office
//   - Filtering by year, week number and office
//   - DateCol decides date column to group weeks by
func queryProductionWeekSummary(dateColName string, weekNo int64, year int, offices []string) ([]map[string]interface{}, error) {
	var (
		err        error
		query      string
		data       []map[string]interface{}
		outData    []map[string]interface{}
		officeGrps map[string]map[string]interface{}
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

	// group by office
	officeGrps = make(map[string]map[string]interface{})
	for _, item := range data {
		officeName := getReportOfficeName(item["office"].(string))
		if _, ok := officeGrps[officeName]; !ok {
			officeGrps[officeName] = map[string]interface{}{
				"Office":              officeName,
				"System Size":         float64(0),
				"Customers":           int64(0),
				"Average System Size": float64(0),
			}
		}
		officeGrps[officeName]["System Size"] =
			officeGrps[officeName]["System Size"].(float64) + item["system_size_sum"].(float64)
		officeGrps[officeName]["Customers"] =
			officeGrps[officeName]["Customers"].(int64) + item["customers_count"].(int64)
		officeGrps[officeName]["Average System Size"] =
			officeGrps[officeName]["Average System Size"].(float64) + item["system_size_avg"].(float64)
	}

	// extract officeGrps values to outData
	for _, officeData := range officeGrps {
		outData = append(outData, officeData)
	}
	return outData, nil
}
