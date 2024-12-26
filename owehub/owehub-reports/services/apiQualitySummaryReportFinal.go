package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"math"
)

func calculateFinalFundingSummaryReport(dataReq models.QualitySummaryReportRequest) (interface{}, error) {
	var (
		query        string
		whereEleList []interface{}
	)

	query = `
        SELECT 
            approved,
            redlined,
            office,
            app_status,
            project_status,
            source_of_fail,
            employee_responsible,
            redline_notes,
            customer_unique_id,
            customer
        FROM final_funding_finance_schema
        WHERE EXTRACT(YEAR FROM approved) = $1
           OR EXTRACT(YEAR FROM redlined) = $1
    `

	whereEleList = append(whereEleList, dataReq.Year)
	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get final funding data from DB err: %v", err)
		return nil, err
	}

	var summaryReport []models.FinalFundingReport

	for _, item := range data {
		report := models.FinalFundingReport{
			Approved:            getTime(item, "approved"),
			Redlined:            getTime(item, "redlined"),
			Office:              getString(item, "office"),
			AppStatus:           getString(item, "app_status"),
			ProjectStatus:       getString(item, "project_status"),
			SourceOfFail:        getString(item, "source_of_fail"),
			EmployeeResponsible: getString(item, "employee_responsible"),
			RedlineNotes:        getString(item, "redline_notes"),
			CustomerUniqueID:    getString(item, "customer_unique_id"),
			Customer:            getString(item, "customer"),
		}
		summaryReport = append(summaryReport, report)
	}

	approvedCounts := calculateFinalFundingApprovals(summaryReport, int(dataReq.Year))
	failedCounts := calculateFinalFundingFails(summaryReport, int(dataReq.Year))
	passRates := calculateFinalFundingPassRate(approvedCounts, failedCounts)
	appStatusCounts := countFinalFundingAppStatus(summaryReport)
	sourceOfFails := getFinalFundingSourceOfFail(summaryReport)

	response := make(map[string]interface{})
	response["approved"] = approvedCounts
	response["failed"] = failedCounts
	response["pass_rate"] = passRates
	response["app_status"] = appStatusCounts
	response["source_of_fail"] = sourceOfFails

	return response, nil
}

func calculateFinalFundingApprovals(data []models.FinalFundingReport, year int) map[int]map[string]int {
	approvedCounts := make(map[int]map[string]int)

	for week := 1; week <= 52; week++ {
		approvedCounts[week] = make(map[string]int)
	}

	for _, report := range data {
		if report.Approved.IsZero() {
			continue
		}

		reportYear, reportWeek := report.Approved.ISOWeek()
		if reportYear != year {
			continue
		}

		if _, exists := approvedCounts[reportWeek][report.Office]; !exists {
			approvedCounts[reportWeek][report.Office] = 0
		}
		approvedCounts[reportWeek][report.Office]++
	}

	return approvedCounts
}

func calculateFinalFundingFails(data []models.FinalFundingReport, year int) map[int]map[string]int {
	failedCounts := make(map[int]map[string]int)

	for week := 1; week <= 52; week++ {
		failedCounts[week] = make(map[string]int)
	}

	for _, report := range data {
		if report.Redlined.IsZero() {
			continue
		}

		reportYear, reportWeek := report.Redlined.ISOWeek()
		if reportYear != year {
			continue
		}

		if _, exists := failedCounts[reportWeek][report.Office]; !exists {
			failedCounts[reportWeek][report.Office] = 0
		}
		failedCounts[reportWeek][report.Office]++
	}

	return failedCounts
}

func countFinalFundingAppStatus(data []models.FinalFundingReport) map[int][][]interface{} {
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

	for _, report := range data {
		if _, appExcluded := excludedAppStatuses[report.AppStatus]; appExcluded {
			continue
		}

		if _, projExcluded := excludedProjectStatuses[report.ProjectStatus]; projExcluded {
			continue
		}

		if report.Approved.IsZero() && report.Redlined.IsZero() ||
			(!report.Approved.IsZero() && !report.Redlined.IsZero()) {
			continue
		}

		_, reportWeek := report.Approved.ISOWeek()

		record := []interface{}{
			report.Office,
			report.CustomerUniqueID,
			report.Customer,
			report.AppStatus,
		}

		result[reportWeek] = append(result[reportWeek], record)
	}

	return result
}

func getFinalFundingSourceOfFail(data []models.FinalFundingReport) map[int][][]interface{} {
	result := make(map[int][][]interface{})

	for _, report := range data {
		if report.Redlined.IsZero() {
			continue
		}

		_, reportWeek := report.Redlined.ISOWeek()

		record := []interface{}{
			report.Office,
			report.CustomerUniqueID,
			report.SourceOfFail,
			report.EmployeeResponsible,
			report.RedlineNotes,
			report.Customer,
		}

		result[reportWeek] = append(result[reportWeek], record)
	}

	return result
}

func calculateFinalFundingPassRate(approvedCounts, failedCounts map[int]map[string]int) map[int]map[string]float64 {
	passRates := make(map[int]map[string]float64)

	for week := 1; week <= 52; week++ {
		passRates[week] = make(map[string]float64)

		for office := range approvedCounts[week] {
			approved := approvedCounts[week][office]
			failed := failedCounts[week][office]
			total := approved + failed

			if total > 0 {
				passRate := float64(approved) / float64(total) * 100
				passRates[week][office] = math.Round(passRate*100) / 100 // Round to two decimal places
			} else {
				passRates[week][office] = 0
			}
		}
	}

	return passRates
}
