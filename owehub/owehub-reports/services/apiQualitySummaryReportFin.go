package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"math"

	"github.com/lib/pq"
)

func calculateFinSummaryReport(dataReq models.QualitySummaryReportRequest) (interface{}, error) {
	var (
		query        string
		whereEleList []interface{}
	)

	query = `
		SELECT 
			source_of_fail,
			employee_responsible,
			office,
			app_status,
			project_status, 
			pv_redlined_date,
			pv_fin_date,
			fin_redline_reason,
			customer_unique_id,
			customer
		FROM fin_permits_fin_schema
		WHERE (EXTRACT(YEAR FROM pv_redlined_date) = $1 OR EXTRACT(YEAR FROM pv_fin_date) = $1)
	`

	whereEleList = append(whereEleList, dataReq.Year)
	if len(dataReq.Office) > 0 {
		query += " AND office = ANY($2)"
		whereEleList = append(whereEleList, pq.Array(dataReq.Office))
	}

	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get table data from DB err: %v", err)
		return nil, err
	}

	var summaryReport []models.FinSummaryReport

	for _, item := range data {
		report := models.FinSummaryReport{
			SourceOfFail:        getString(item, "source_of_fail"),
			EmployeeResponsible: getString(item, "employee_responsible"),
			Office:              getString(item, "office"),
			AppStatus:           getString(item, "app_status"),
			ProjectStatus:       getString(item, "project_status"),
			PvRedlinedDate:      getTime(item, "pv_redlined_date"),
			PvFinDate:           getTime(item, "pv_fin_date"),
			FinRedlineReason:    getString(item, "fin_redline_reason"),
			CustomerUniqueID:    getString(item, "customer_unique_id"),
			Customer:            getString(item, "customer"),
		}
		summaryReport = append(summaryReport, report)
	}

	finApproves := calculateFinApproves(summaryReport, int(dataReq.Year))
	finFails := calculateFinFails(summaryReport, int(dataReq.Year))
	finPassRates := calculateFinPassRate(finApproves, finFails)
	appStatusCounts := countAppStatus(summaryReport)
	finSourceOfFail := getFinSourceOfFail(summaryReport)

	response := make(map[string]interface{})
	response["fin_approved"] = finApproves
	response["fin_fails"] = finFails
	response["fin_pass_rate"] = finPassRates
	response["app_status_counts"] = appStatusCounts
	response["fin_source_of_fail"] = finSourceOfFail

	return response, nil
}

func calculateFinApproves(data []models.FinSummaryReport, year int) map[int]map[string]int {
	finApproves := make(map[int]map[string]int)

	for week := 1; week <= 52; week++ {
		finApproves[week] = make(map[string]int)
	}

	for _, report := range data {
		if !report.PvFinDate.IsZero() {
			reportYear, reportWeek := report.PvFinDate.ISOWeek()
			if reportYear == year {
				if _, exists := finApproves[reportWeek][report.Office]; !exists {
					finApproves[reportWeek][report.Office] = 0
				}
				finApproves[reportWeek][report.Office]++
			}
		}
	}

	return finApproves
}

func calculateFinFails(data []models.FinSummaryReport, year int) map[int]map[string]int {
	finFails := make(map[int]map[string]int)

	for week := 1; week <= 52; week++ {
		finFails[week] = make(map[string]int)
	}

	for _, report := range data {
		if !report.PvRedlinedDate.IsZero() {
			reportYear, reportWeek := report.PvRedlinedDate.ISOWeek()
			if reportYear == year {
				if _, exists := finFails[reportWeek][report.Office]; !exists {
					finFails[reportWeek][report.Office] = 0
				}
				finFails[reportWeek][report.Office]++
			}
		}
	}

	return finFails
}

func calculateFinPassRate(finApproves map[int]map[string]int, finFails map[int]map[string]int) map[int]map[string]float64 {
	passRates := make(map[int]map[string]float64)

	for week, offices := range finApproves {
		passRates[week] = make(map[string]float64)

		for office, approvedCount := range offices {
			failedCount := finFails[week][office]

			totalCount := approvedCount + failedCount
			if totalCount > 0 {
				passRate := (float64(approvedCount) / float64(totalCount)) * 100
				passRates[week][office] = math.Round(passRate*100) / 100
			} else {
				passRates[week][office] = 0.0
			}
		}
	}

	return passRates
}

func countAppStatus(data []models.FinSummaryReport) map[int][][]interface{} {
	excludedAppStatuses := map[string]struct{}{
		"Complete":  {},
		"CANCELED":  {},
		"HOLD":      {},
		"DUPLICATE": {},
		"Approved":  {},
	}

	excludedProjectStatuses := map[string]struct{}{
		"DUPLICATE": {},
		"CANCEL":    {},
		"HOLD":      {},
		"BLOCKED":   {},
		"JEOPARDY":  {},
	}

	result := make(map[int][][]interface{})
	tempCounts := make(map[int]map[string]map[string]int)

	for _, report := range data {
		if _, appExcluded := excludedAppStatuses[report.AppStatus]; appExcluded {
			continue
		}

		if _, projExcluded := excludedProjectStatuses[report.ProjectStatus]; projExcluded {
			continue
		}

		// Skip if PvFinDate is zero and PvRedlinedDate is not zero
		// or if both PvFinDate and PvRedlinedDate are not zero
		if (report.PvFinDate.IsZero() && !report.PvRedlinedDate.IsZero()) ||
			(!report.PvFinDate.IsZero() && !report.PvRedlinedDate.IsZero()) {
			continue // Skip this report
		}

		_, reportWeek := report.PvFinDate.ISOWeek()
		if _, exists := tempCounts[reportWeek]; !exists {
			tempCounts[reportWeek] = make(map[string]map[string]int)
		}
		if _, exists := tempCounts[reportWeek][report.Office]; !exists {
			tempCounts[reportWeek][report.Office] = make(map[string]int)
		}

		tempCounts[reportWeek][report.Office][report.AppStatus]++
	}
	for week, offices := range tempCounts {
		for office, statuses := range offices {
			for status, count := range statuses {
				result[week] = append(result[week], []interface{}{office, status, count})
			}
		}
	}

	return result
}

func getFinSourceOfFail(data []models.FinSummaryReport) map[int][][]interface{} {
	result := make(map[int][][]interface{})

	for _, report := range data {
		if report.PvRedlinedDate.IsZero() {
			continue
		}
		_, reportWeek := report.PvRedlinedDate.ISOWeek()

		record := []interface{}{
			report.Office,              // office_name
			report.CustomerUniqueID,    // customer_unique_id
			report.SourceOfFail,        // source_of_fail
			report.EmployeeResponsible, // employee_responsible
			report.FinRedlineReason,    // redlinereason
			report.Customer,            // customer name (assuming you have this field)
		}

		if _, exists := result[reportWeek]; !exists {
			result[reportWeek] = [][]interface{}{}
		}

		result[reportWeek] = append(result[reportWeek], record)
	}

	return result
}
