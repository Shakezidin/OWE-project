package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"math"
)

func calculateInstallFundingSummaryReport(dataReq models.QualitySummaryReportRequest) (interface{}, error) {
	var (
		query        string
		whereEleList []interface{}
	)

	query = `
        SELECT 
            approved_date,
            redlined_date,
            office,
            app_status,
            project_status,
            source_of_fail,
            employee_responsible_for_redline,
            redline_reason,
            customer_unique_id,
            customer
        FROM install_funding_finance_schema
        WHERE EXTRACT(YEAR FROM approved_date) = $1
           OR EXTRACT(YEAR FROM redlined_date) = $1
    `

	whereEleList = append(whereEleList, dataReq.Year)

	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get installation funding data from DB err: %v", err)
		return nil, err
	}

	var summaryReport []models.InstallFundingReport
	for _, item := range data {
		report := models.InstallFundingReport{
			ApprovedDate:                  getTime(item, "approved_date"),
			RedlinedDate:                  getTime(item, "redlined_date"),
			Office:                        getString(item, "office"),
			AppStatus:                     getString(item, "app_status"),
			ProjectStatus:                 getString(item, "project_status"),
			SourceOfFail:                  getString(item, "source_of_fail"),
			EmployeeResponsibleForRedline: getString(item, "employee_responsible_for_redline"),
			RedlineReason:                 getString(item, "redline_reason"),
			CustomerUniqueID:              getString(item, "customer_unique_id"),
			Customer:                      getString(item, "customer"),
		}
		summaryReport = append(summaryReport, report)
	}

	approvedCounts := calculateInstallFundingApprovals(summaryReport, int(dataReq.Year))
	failedCounts := calculateInstallFundingFails(summaryReport, int(dataReq.Year))
	passRates := calculateInstallFundingPassRate(approvedCounts, failedCounts)
	appStatusCounts := countInstallFundingAppStatus(summaryReport)
	sourceOfFails := getInstallFundingSourceOfFail(summaryReport)

	// Create the response map containing all calculated metrics
	response := make(map[string]interface{})
	response["approved"] = approvedCounts
	response["failed"] = failedCounts
	response["pass_rate"] = passRates
	response["app_status"] = appStatusCounts
	response["source_of_fail"] = sourceOfFails

	return response, nil
}

func calculateInstallFundingApprovals(data []models.InstallFundingReport, year int) map[int]map[string]int {
	approvedCounts := make(map[int]map[string]int)
	for week := 1; week <= 52; week++ {
		approvedCounts[week] = make(map[string]int)
	}

	for _, report := range data {
		if report.ApprovedDate.IsZero() {
			continue
		}

		reportYear, reportWeek := report.ApprovedDate.ISOWeek()
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

func calculateInstallFundingFails(data []models.InstallFundingReport, year int) map[int]map[string]int {
	failedCounts := make(map[int]map[string]int)
	for week := 1; week <= 52; week++ {
		failedCounts[week] = make(map[string]int)
	}

	for _, report := range data {
		if report.RedlinedDate.IsZero() {
			continue
		}
		reportYear, reportWeek := report.RedlinedDate.ISOWeek()
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

func countInstallFundingAppStatus(data []models.InstallFundingReport) map[int][][]interface{} {
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

		if (report.ApprovedDate.IsZero() && !report.RedlinedDate.IsZero()) ||
			(!report.ApprovedDate.IsZero() && !report.RedlinedDate.IsZero()) {
			continue // Skip this report
		}

		_, reportWeek := report.ApprovedDate.ISOWeek()
		record := []interface{}{
			report.Office,           // office_name
			report.Customer,         // customer name
			report.AppStatus,        // application status
			report.CustomerUniqueID, // customer unique ID
		}

		result[reportWeek] = append(result[reportWeek], record)
	}

	return result
}

func getInstallFundingSourceOfFail(data []models.InstallFundingReport) map[int][][]interface{} {
	result := make(map[int][][]interface{})

	for _, report := range data {
		if report.RedlinedDate.IsZero() {
			continue
		}

		_, reportWeek := report.RedlinedDate.ISOWeek()
		record := []interface{}{
			report.Office,                        // office_name
			report.CustomerUniqueID,              // customer_unique_id
			report.SourceOfFail,                  // source_of_fail
			report.EmployeeResponsibleForRedline, // employee responsible for redline
			report.RedlineReason,                 // redline_reason
			report.Customer,                      // customer name
		}

		result[reportWeek] = append(result[reportWeek], record)
	}

	return result
}

func calculateInstallFundingPassRate(approvedCounts, failedCounts map[int]map[string]int) map[int]map[string]float64 {
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
