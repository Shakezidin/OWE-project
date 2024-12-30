package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"math"

	"github.com/lib/pq"
)

func calculatePtoSummaryReport(dataReq models.QualitySummaryReportRequest) (interface{}, error) {
	var (
		query        string
		whereEleList []interface{}
	)

	query = `
        SELECT 
            pto_granted,
            utility_redlined_date,
            office,
            pto_app_status,
            project_status,
            source_of_fail,
            employee_responsible,
            redlined_reason_1,
            customer_unique_id,
            customer
        FROM pto_ic_schema
        WHERE (EXTRACT(YEAR FROM pto_granted) = $1 OR EXTRACT(YEAR FROM utility_redlined_date) = $1)
    `

	whereEleList = append(whereEleList, dataReq.Year)
	if len(dataReq.Office) > 0 {
		query += " AND office = ANY($2)"
		whereEleList = append(whereEleList, pq.Array(dataReq.Office))
	}

	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PTO data from DB err: %v", err)
		return nil, err
	}

	var summaryReport []models.PtoSummaryReport

	for _, item := range data {
		report := models.PtoSummaryReport{
			PtoGranted:          getTime(item, "pto_granted"),
			UtilityRedlinedDate: getTime(item, "utility_redlined_date"),
			Office:              getString(item, "office"),
			PtoAppStatus:        getString(item, "pto_app_status"),
			ProjectStatus:       getString(item, "project_status"),
			SourceOfFail:        getString(item, "source_of_fail"),
			EmployeeResponsible: getString(item, "employee_responsible"),
			RedlinedReason:      getString(item, "redlined_reason_1"),
			CustomerUniqueID:    getString(item, "customer_unique_id"),
			Customer:            getString(item, "customer"),
		}
		summaryReport = append(summaryReport, report)
	}

	ptoApproves := calculatePtoApproves(summaryReport, int(dataReq.Year))
	ptoFails := calculatePtoFails(summaryReport, int(dataReq.Year))
	ptoPassRates := calculatePtoPassRate(ptoApproves, ptoFails)
	appStatusCounts := countPtoAppStatus(summaryReport)
	ptoSourceOfFail := getPtoSourceOfFail(summaryReport)

	// Create the response map containing all calculated metrics
	response := make(map[string]interface{})
	response["approved"] = ptoApproves
	response["failed"] = ptoFails
	response["pass_rate"] = ptoPassRates
	response["app_status"] = appStatusCounts
	response["source_of_fail"] = ptoSourceOfFail

	return response, nil
}

func calculatePtoApproves(data []models.PtoSummaryReport, year int) map[int]map[string]int {
	ptoApproves := make(map[int]map[string]int)

	for week := 1; week <= 52; week++ {
		ptoApproves[week] = make(map[string]int)
	}

	for _, report := range data {
		if report.PtoGranted.IsZero() {
			continue
		}

		reportYear, reportWeek := report.PtoGranted.ISOWeek()
		if reportYear != year {
			continue
		}
		if _, exists := ptoApproves[reportWeek][report.Office]; !exists {
			ptoApproves[reportWeek][report.Office] = 0
		}
		ptoApproves[reportWeek][report.Office]++
	}

	return ptoApproves
}

func calculatePtoFails(data []models.PtoSummaryReport, year int) map[int]map[string]int {
	ptoFails := make(map[int]map[string]int)

	for week := 1; week <= 52; week++ {
		ptoFails[week] = make(map[string]int)
	}

	for _, report := range data {
		if report.UtilityRedlinedDate.IsZero() {
			continue
		}

		reportYear, reportWeek := report.UtilityRedlinedDate.ISOWeek()
		if reportYear != year {
			continue // Only consider reports from the specified year
		}

		if _, exists := ptoFails[reportWeek][report.Office]; !exists {
			ptoFails[reportWeek][report.Office] = 0
		}
		ptoFails[reportWeek][report.Office]++
	}

	return ptoFails
}

func calculatePtoPassRate(ptoApproves map[int]map[string]int, ptoFails map[int]map[string]int) map[int]map[string]float64 {
	passRates := make(map[int]map[string]float64)

	for week, offices := range ptoApproves {
		passRates[week] = make(map[string]float64)

		for office, approvedCount := range offices {
			failedCount := ptoFails[week][office]

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

func countPtoAppStatus(data []models.PtoSummaryReport) map[int][][]interface{} {
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
		if _, appExcluded := excludedAppStatuses[report.PtoAppStatus]; appExcluded {
			continue
		}

		if _, projExcluded := excludedProjectStatuses[report.ProjectStatus]; projExcluded {
			continue
		}

		// Skip if PTO granted date is zero and utility redlined date is not zero
		// or if both PTO granted date and utility redlined date are not zero
		if (report.PtoGranted.IsZero() && !report.UtilityRedlinedDate.IsZero()) ||
			(!report.PtoGranted.IsZero() && !report.UtilityRedlinedDate.IsZero()) {
			continue // Skip this report
		}

		_, reportWeek := report.PtoGranted.ISOWeek()

		if _, exists := tempCounts[reportWeek]; !exists {
			tempCounts[reportWeek] = make(map[string]map[string]int)
		}

		if _, exists := tempCounts[reportWeek][report.Office]; !exists {
			tempCounts[reportWeek][report.Office] = make(map[string]int)
		}

		tempCounts[reportWeek][report.Office][report.PtoAppStatus]++
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

func getPtoSourceOfFail(data []models.PtoSummaryReport) map[int][][]interface{} {
	result := make(map[int][][]interface{})

	for _, report := range data {
		if report.UtilityRedlinedDate.IsZero() {
			continue
		}

		if report.UtilityRedlinedDate.IsZero() {
			continue
		}
		_, reportWeek := report.UtilityRedlinedDate.ISOWeek()
		record := []interface{}{
			report.Office,              // office_name
			report.CustomerUniqueID,    // customer_unique_id
			report.SourceOfFail,        // source_of_fail
			report.EmployeeResponsible, // employee_responsible
			report.RedlinedReason,      // redlined_reason
			report.Customer,            // customer name
		}

		if _, exists := result[reportWeek]; !exists {
			result[reportWeek] = [][]interface{}{}
		}

		// Append the record to the week's slice
		result[reportWeek] = append(result[reportWeek], record)
	}

	return result
}
