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
		err                    error
		dataReq                models.GetMilestoneDataReq
		data                   []map[string]interface{}
		whereEleList           []interface{}
		filter                 string
		RecordCount            int64
		query                  string
		thisPeriodNtpCount     int
		thisPeriodSaleCount    int
		thisPeriodInstallCount int
		totalSaleCount         int
		totalNtpCount          int
		totalInstallCount      int
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

	query = `select cs.sale_date, ns.ntp_complete_date, pis.pv_completion_date
			FROM customers_customers_schema cs 
			LEFT JOIN ntp_ntp_schema ns ON ns.unique_id = cs.unique_id 
			LEFT JOIN pv_install_install_subcontracting_schema pis ON pis.customer_unique_id = cs.unique_id`

	filter, whereEleList = PrepareMilestoneDataFilters(dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	var saleCountMap = make(map[string]int)
	var ntpCountMap = make(map[string]int)
	var installCountMap = make(map[string]int)

	now := time.Now()
	currentYear, currentWeek := now.ISOWeek()
	startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
	endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)

	endDate = endDate.Add(24*time.Hour - time.Second)

	for _, item := range data {
		// Check Sale Date
		saleDate, ok := item["sale_date"].(time.Time)
		if ok && !saleDate.IsZero() && saleDate.After(startDate) && saleDate.Before(endDate) {
			var key string
			switch dataReq.DateBy {
			case "day":
				key = saleDate.Format("2006-01-02") // Format for day
			case "month":
				key = saleDate.Format("2006-01") // Format for month
			case "week":
				year, week := saleDate.ISOWeek()
				key = fmt.Sprintf("%d-W%02d", year, week) // Format for week (YYYY-WW)
			default: // year
				key = saleDate.Format("2006") // Format for year
			}
			saleCountMap[key]++

			// Check if date is within this period
			saleYear, saleWeek := saleDate.ISOWeek()
			if (dataReq.DateBy == "year" && saleDate.Year() == now.Year()) ||
				(dataReq.DateBy == "month" && saleDate.Year() == now.Year() && saleDate.Month() == now.Month()) ||
				(dataReq.DateBy == "week" && saleDate.Year() == now.Year() && saleYear == currentYear && saleWeek == currentWeek) ||
				(dataReq.DateBy == "day" && saleDate.Year() == now.Year() && saleDate.YearDay() == now.YearDay()) {
				thisPeriodSaleCount++
			}
		}

		// Check NTP Completion Date
		ntpDate, ok := item["ntp_complete_date"].(time.Time)
		if ok && !ntpDate.IsZero() && saleDate.After(startDate) && saleDate.Before(endDate) {
			var key string
			switch dataReq.DateBy {
			case "day":
				key = ntpDate.Format("2006-01-02")
			case "month":
				key = ntpDate.Format("2006-01")
			case "week":
				year, week := ntpDate.ISOWeek()
				key = fmt.Sprintf("%d-W%02d", year, week)
			default:
				key = ntpDate.Format("2006")
			}
			ntpCountMap[key]++

			// Check if date is within this period
			ntpYear, ntpWeek := ntpDate.ISOWeek()
			if (dataReq.DateBy == "year" && ntpDate.Year() == now.Year()) ||
				(dataReq.DateBy == "month" && ntpDate.Year() == now.Year() && ntpDate.Month() == now.Month()) ||
				(dataReq.DateBy == "week" && ntpDate.Year() == now.Year() && ntpYear == currentYear && ntpWeek == currentWeek) ||
				(dataReq.DateBy == "day" && ntpDate.Year() == now.Year() && ntpDate.YearDay() == now.YearDay()) {
				thisPeriodNtpCount++
			}
		}

		// Check Installation Completion Date
		installDate, ok := item["pv_completion_date"].(time.Time)
		if ok && !installDate.IsZero() && saleDate.After(startDate) && saleDate.Before(endDate) {
			var key string
			switch dataReq.DateBy {
			case "day":
				key = installDate.Format("2006-01-02")
			case "month":
				key = installDate.Format("2006-01")
			case "week":
				year, week := installDate.ISOWeek()
				key = fmt.Sprintf("%d-W%02d", year, week)
			default:
				key = installDate.Format("2006")
			}
			installCountMap[key]++

			// Check if date is within this period
			installYear, installWeek := installDate.ISOWeek()
			if (dataReq.DateBy == "year" && installDate.Year() == now.Year()) ||
				(dataReq.DateBy == "month" && installDate.Year() == now.Year() && installDate.Month() == now.Month()) ||
				(dataReq.DateBy == "week" && installDate.Year() == now.Year() && installYear == currentYear && installWeek == currentWeek) ||
				(dataReq.DateBy == "day" && installDate.Year() == now.Year() && installDate.YearDay() == now.YearDay()) {
				thisPeriodInstallCount++
			}
		}
	}

	for _, count := range saleCountMap {
		totalSaleCount += count
	}

	for _, count := range ntpCountMap {
		totalNtpCount += count
	}

	for _, count := range installCountMap {
		totalInstallCount += count
	}

	milestoneData.InstallData = installCountMap
	milestoneData.SaleData = saleCountMap
	milestoneData.NtpData = ntpCountMap

	// Set the totals in the milestoneData response
	milestoneData.TotalInstall = totalInstallCount
	milestoneData.TotalNtp = totalNtpCount
	milestoneData.TotalSale = totalSaleCount

	// Set the previous period totals for comparison
	milestoneData.InstallIncreasePercent = int(calculatePercentageIncrease(float64(totalInstallCount), float64(thisPeriodInstallCount)))
	milestoneData.NtpIncreasePercent = int(calculatePercentageIncrease(float64(totalNtpCount), float64(thisPeriodNtpCount)))
	milestoneData.SaleIncreasePercent = int(calculatePercentageIncrease(float64(totalSaleCount), float64(thisPeriodSaleCount)))

	RecordCount = int64(len(data))
	appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, milestoneData, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareLeaderDateFilters
 * DESCRIPTION:     handler for prepare primary filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func PrepareMilestoneDataFilters(dataReq models.GetMilestoneDataReq) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareMilestoneDataFilters")
	defer func() { log.ExitFn(0, "PrepareMilestoneDataFilters", nil) }()

	var filtersBuilder strings.Builder
	var whereAdded bool

	if dataReq.StartDate != "" && dataReq.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)

		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		filtersBuilder.WriteString(" WHERE")
		filtersBuilder.WriteString(fmt.Sprintf(" ((cs.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')) OR", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" (pis.pv_completion_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')) OR", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" (ns.ntp_complete_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')))", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	if len(dataReq.DealerNames) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		// Escape single quotes and format dealer names
		var dealerNames []string
		for _, dealer := range dataReq.DealerNames {
			escapedDealer := strings.ReplaceAll(dealer, "'", "''")
			dealerNames = append(dealerNames, fmt.Sprintf("'%s'", escapedDealer))
		}

		// Join the dealer names for SQL IN clause
		filtersBuilder.WriteString(fmt.Sprintf("cs.dealer IN (%s)", strings.Join(dealerNames, ", ")))
		whereAdded = true
	}

	if len(dataReq.State) > 0 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}

		filtersBuilder.WriteString(fmt.Sprintf("cs.state ILIKE '%%%s%%'", dataReq.State))
	}

	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	filtersBuilder.WriteString("cs.project_status != 'DUPLICATE' AND cs.unique_id != '' ")

	filters = filtersBuilder.String()
	return filters, whereEleList
}

func calculatePercentageIncrease(thisPeriod, total float64) float64 {
	previousTotal := total - thisPeriod
	if previousTotal == 0 {
		return 100 // If there were no previous sales, growth is considered 100%
	}
	return (thisPeriod / previousTotal) * 100
}
