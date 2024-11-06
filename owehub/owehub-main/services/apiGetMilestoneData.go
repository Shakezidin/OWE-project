/**************************************************************************
 * File       	   : apiGetMilestoneData.go
 * DESCRIPTION     : This file contains functions for get mile stone data handler
 * DATE            : 01-Nov-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetLeaderBoardDataRequest
 * DESCRIPTION:     handler for get LeaderBoard data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetMilestoneDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                  error
		dataReq              models.GetMilestoneDataReq
		data                 []map[string]interface{}
		whereEleList         []interface{}
		RecordCount          int64
		query                string
		totalSaleCount       int
		totalNtpCount        int
		totalInstallCount    int
		previousSaleCount    int
		previousNtpCount     int
		previousInstallCount int
		currentDate          string
		prevDate             string
	)
	log.EnterFn(0, "HandleGetMilestoneDataRequest")
	defer func() { log.ExitFn(0, "HandleGetMilestoneDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get milestone data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get milestone data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get milestone data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get milestone data Request body", http.StatusBadRequest, nil)
		return
	}

	milestoneData := models.GetMilestoneDataResp{}

	var saleCountMap = make(map[string]int)
	var ntpCountMap = make(map[string]int)
	var installCountMap = make(map[string]int)

	startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
	endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)

	endDate = endDate.Add(24*time.Hour - time.Second)

	// var prevEndDate, prevStartDate time.Time
	// var currentMonthStartDate time.Time
	// var currentMonthEndDate time.Time

	switch dataReq.DateBy {
	case "day":
		currentDate = endDate.Format("2006-01-02")
		prevDate = endDate.AddDate(0, 0, -1).Format("2006-01-02")

	case "month":
		// Format the current month as YYYY-MM
		currentDate = endDate.Format("2006-01")

		// Calculate previous month
		prevEndDate := endDate.AddDate(0, -1, 0) // Move to the same day in the previous month
		prevDate = prevEndDate.Format("2006-01") // Format as YYYY-MM

		// Check if prevEndDate is still the same day as endDate
		// If endDate is the last day of the month, we might need to adjust to the last day of previous month
		if endDate.Day() == daysInMonth(endDate) {
			prevEndDate = prevEndDate.AddDate(0, 0, -prevEndDate.Day()) // Go to the last day of the previous month
		}

		prevDate = prevEndDate.Format("2006-01") // Format again as YYYY-MM

	case "week":
		year, week := endDate.ISOWeek()
		currentDate = fmt.Sprintf("%d-W%02d", year, week)         // Current week
		prevYear, prevWeek := endDate.AddDate(0, 0, -7).ISOWeek() // Previous week
		prevDate = fmt.Sprintf("%d-W%02d", prevYear, prevWeek)    // Previous week formatted

	default: // "year"
		currentDate = endDate.Format("2006")                // Current year (YYYY)
		prevDate = endDate.AddDate(-1, 0, 0).Format("2006") // Previous year (YYYY)
	}

	csFilter, whereEleList := PrepareMilestoneDataFilters(dataReq, "customer")

	query = fmt.Sprintf(`SELECT sale_date FROM customers_customers_schema %s`, csFilter)

	val1, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	data = append(data, val1...)

	csFilter, whereEleList = PrepareMilestoneDataFilters(dataReq, "ntp")

	query = fmt.Sprintf(`SELECT ntp_complete_date FROM ntp_ntp_schema %s`, csFilter)

	val2, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	data = append(data, val2...)

	csFilter, whereEleList = PrepareMilestoneDataFilters(dataReq, "pv_install_install_subcontracting_schema")

	query = fmt.Sprintf(`SELECT pv_completion_date FROM pv_install_install_subcontracting_schema %s`, csFilter)

	val3, err := db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	data = append(data, val3...)

	// Loop through each item in data to calculate counts for sales, NTPs, and installations
	for _, item := range data {
		// Track the current and previous period keys for each metric
		saleDate, ok := item["sale_date"].(time.Time)
		// Only include sales in the current period
		if ok && !saleDate.IsZero() && !saleDate.After(endDate) && !saleDate.Before(startDate) {
			var saleKey string
			switch dataReq.DateBy {
			case "day":
				saleKey = saleDate.Format("2006-01-02")
			case "month":
				saleKey = saleDate.Format("2006-01")
			case "week":
				year, week := saleDate.ISOWeek()
				saleKey = fmt.Sprintf("%d-W%02d", year, week)
			default: // "year"
				saleKey = saleDate.Format("2006")
			}
			saleCountMap[saleKey]++
		}

		// Parse NTP Completion Date
		ntpDate, ok := item["ntp_complete_date"].(time.Time)
		if ok && !ntpDate.IsZero() && !ntpDate.After(endDate) && !ntpDate.Before(startDate) {
			var ntpKey string
			switch dataReq.DateBy {
			case "day":
				ntpKey = ntpDate.Format("2006-01-02")
			case "month":
				ntpKey = ntpDate.Format("2006-01")
			case "week":
				year, week := ntpDate.ISOWeek()
				ntpKey = fmt.Sprintf("%d-W%02d", year, week)
			default: // "year"
				ntpKey = ntpDate.Format("2006")
			}
			ntpCountMap[ntpKey]++
		}

		// Parse Installation Completion Date
		installDate, ok := item["pv_completion_date"].(time.Time)
		if ok && !installDate.IsZero() && !installDate.After(endDate) && !installDate.Before(startDate) {
			var isntallKey string
			switch dataReq.DateBy {
			case "day":
				isntallKey = installDate.Format("2006-01-02")
			case "month":
				isntallKey = installDate.Format("2006-01")
			case "week":
				year, week := installDate.ISOWeek()
				isntallKey = fmt.Sprintf("%d-W%02d", year, week)
			default: // "year"
				isntallKey = installDate.Format("2006")
			}
			installCountMap[isntallKey]++
		}
	}
	// Calculate total counts
	totalSaleCount = sumMapValues(saleCountMap)
	totalNtpCount = sumMapValues(ntpCountMap)
	totalInstallCount = sumMapValues(installCountMap)
	previousInstallCount = installCountMap[prevDate]
	previousNtpCount = ntpCountMap[prevDate]
	previousSaleCount = saleCountMap[prevDate]
	currentInstallCount := installCountMap[currentDate]
	currentNtpCount := ntpCountMap[currentDate]
	currentSaleCount := saleCountMap[currentDate]

	// Calculate the percentage increase based on current vs. previous counts
	milestoneData.SaleIncreasePercent = calculatePercentageIncrease(currentSaleCount, previousSaleCount)
	milestoneData.NtpIncreasePercent = calculatePercentageIncrease(currentNtpCount, previousNtpCount)
	milestoneData.InstallIncreasePercent = calculatePercentageIncrease(currentInstallCount, previousInstallCount)

	// Populate response
	milestoneData.TotalInstall = totalInstallCount
	milestoneData.TotalNtp = totalNtpCount
	milestoneData.TotalSale = totalSaleCount
	milestoneData.InstallData = installCountMap
	milestoneData.SaleData = saleCountMap
	milestoneData.NtpData = ntpCountMap

	appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, milestoneData, RecordCount)

}

/******************************************************************************
 * FUNCTION:		PrepareLeaderDateFilters
 * DESCRIPTION:     handler for prepare primary filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

// func PrepareMilestoneDataFilters(dataReq models.GetMilestoneDataReq) (filters string, whereEleList []interface{}) {
// 	log.EnterFn(0, "PrepareMilestoneDataFilters")
// 	defer func() { log.ExitFn(0, "PrepareMilestoneDataFilters", nil) }()

// 	var filtersBuilder strings.Builder
// 	var whereAdded bool

// 	if dataReq.StartDate != "" && dataReq.EndDate != "" {
// 		startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
// 		endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)

// 		endDate = endDate.Add(24*time.Hour - time.Second)

// 		whereEleList = append(whereEleList,
// 			startDate.Format("02-01-2006 00:00:00"),
// 			endDate.Format("02-01-2006 15:04:05"),
// 		)

// 		filtersBuilder.WriteString(" WHERE")
// 		filtersBuilder.WriteString(fmt.Sprintf(" ((cs.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')) OR", len(whereEleList)-1, len(whereEleList)))
// 		filtersBuilder.WriteString(fmt.Sprintf(" (pis.pv_completion_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')) OR", len(whereEleList)-1, len(whereEleList)))
// 		filtersBuilder.WriteString(fmt.Sprintf(" (ns.ntp_complete_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')))", len(whereEleList)-1, len(whereEleList)))
// 		whereAdded = true
// 	}

// 	if len(dataReq.DealerNames) > 0 {
// 		if whereAdded {
// 			filtersBuilder.WriteString(" AND ")
// 		} else {
// 			filtersBuilder.WriteString(" WHERE ")
// 			whereAdded = true
// 		}

// 		// Escape single quotes and format dealer names
// 		var dealerNames []string
// 		for _, dealer := range dataReq.DealerNames {
// 			escapedDealer := strings.ReplaceAll(dealer, "'", "''")
// 			dealerNames = append(dealerNames, fmt.Sprintf("'%s'", escapedDealer))
// 		}

// 		// Join the dealer names for SQL IN clause
// 		filtersBuilder.WriteString(fmt.Sprintf("cs.dealer IN (%s)", strings.Join(dealerNames, ", ")))
// 		whereAdded = true
// 	}

// 	if len(dataReq.State) > 0 {
// 		if whereAdded {
// 			filtersBuilder.WriteString(" AND ")
// 		} else {
// 			filtersBuilder.WriteString(" WHERE ")
// 			whereAdded = true
// 		}

// 		filtersBuilder.WriteString(fmt.Sprintf("cs.state ILIKE '%%%s%%'", dataReq.State))
// 	}

// 	if whereAdded {
// 		filtersBuilder.WriteString(" AND ")
// 	} else {
// 		filtersBuilder.WriteString(" WHERE ")
// 		whereAdded = true
// 	}
// 	filtersBuilder.WriteString("cs.project_status != 'DUPLICATE' AND cs.unique_id != '' ")

// 	filters = filtersBuilder.String()
// 	return filters, whereEleList
// }

func calculatePercentageIncrease(currentMonthSales, lastMonthSales int) float64 {
	if lastMonthSales == 0 {
		return 0 // To avoid division by zero, return 0% if last month sales are zero.
	}

	increase := currentMonthSales - lastMonthSales
	percentageIncrease := (float64(increase) / float64(lastMonthSales)) * 100
	return percentageIncrease
}

func sumMapValues(m map[string]int) int {
	total := 0
	for _, count := range m {
		total += count
	}
	return total
}

func daysInMonth(date time.Time) int {
	nextMonth := date.AddDate(0, 1, 0)                     // Move to next month
	return nextMonth.AddDate(0, 0, -nextMonth.Day()).Day() // Go to the last day of the previous month
}

func PrepareMilestoneDataFilters(dataReq models.GetMilestoneDataReq, table string) (csFilters string, whereEleList []interface{}) {
	var csBuilder strings.Builder
	var whereAdded bool

	// Apply date range filters for each table
	if dataReq.StartDate != "" && dataReq.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)
		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		// Select appropriate column based on the table
		dateColumn := ""
		switch table {
		case "customer":
			dateColumn = "sale_date"
		case "ntp":
			dateColumn = "ntp_complete_date"
		default:
			dateColumn = "pv_completion_date"
		}

		csBuilder.WriteString(fmt.Sprintf(" WHERE %s BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", dateColumn, len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	// State filter
	if len(dataReq.State) > 0 {
		if whereAdded {
			csBuilder.WriteString(" AND ")
		} else {
			csBuilder.WriteString(" WHERE ")
			whereAdded = true
		}
		csBuilder.WriteString(fmt.Sprintf("state ILIKE '%%%s%%'", dataReq.State))
	}

	// Dealer filter
	if len(dataReq.DealerNames) > 0 {
		if whereAdded {
			csBuilder.WriteString(" AND ")
		} else {
			csBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		// Escape single quotes in dealer names
		var dealerNames []string
		for _, dealer := range dataReq.DealerNames {
			escapedDealer := strings.ReplaceAll(dealer, "'", "''")
			dealerNames = append(dealerNames, fmt.Sprintf("'%s'", escapedDealer))
		}

		csBuilder.WriteString(fmt.Sprintf("dealer IN (%s)", strings.Join(dealerNames, ", ")))
	}

	// Additional static filters based on table
	if table == "customer" || table == "ntp" {
		csBuilder.WriteString(" AND project_status != 'DUPLICATE' AND unique_id != ''")
	} else {
		csBuilder.WriteString(" AND project_status != 'DUPLICATE' AND customer_unique_id != ''")
	}

	return csBuilder.String(), whereEleList
}
